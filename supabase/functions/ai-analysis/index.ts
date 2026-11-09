// =============================================================================
// SONORA — AI Album Analysis Edge Function
// Uses Google Gemini API to generate insightful album analyses
// =============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ---------------------------------------------------------------------------
// CORS headers — allow all origins for client access
// ---------------------------------------------------------------------------
const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TrackInput {
  title: string;
  position: number;
}

interface AnalysisRequest {
  albumId: string;
  mbid: string;
  title: string;
  artistName: string;
  releaseYear: number;
  genres: string[];
  tracks: TrackInput[];
  forceRefresh?: boolean;
}

interface AnalysisResult {
  summary: string;
  themes: string[];
  sound_description: string;
  influences: string;
  significance: string;
}

interface CachedAnalysis extends AnalysisResult {
  id: string;
  album_id: string;
  generated_at: string;
  model_version: string;
  token_count: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_TEMPERATURE = 0.7;
const GEMINI_MAX_TOKENS = 800;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

/** Validates the incoming request body and returns typed input or an error. */
function validateRequest(body: unknown): {
  data?: AnalysisRequest;
  error?: string;
} {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be a JSON object" };
  }

  const b = body as Record<string, unknown>;

  if (!b.albumId || typeof b.albumId !== "string") {
    return { error: "albumId is required and must be a string" };
  }
  if (!b.title || typeof b.title !== "string") {
    return { error: "title is required and must be a string" };
  }
  if (!b.artistName || typeof b.artistName !== "string") {
    return { error: "artistName is required and must be a string" };
  }
  if (
    b.releaseYear !== undefined &&
    (typeof b.releaseYear !== "number" || !Number.isInteger(b.releaseYear))
  ) {
    return { error: "releaseYear must be an integer" };
  }
  if (b.genres !== undefined && !Array.isArray(b.genres)) {
    return { error: "genres must be an array of strings" };
  }
  if (b.tracks !== undefined && !Array.isArray(b.tracks)) {
    return { error: "tracks must be an array of objects with title and position" };
  }

  // Validate each track if provided
  if (Array.isArray(b.tracks)) {
    for (const track of b.tracks) {
      if (!track || typeof track !== "object") {
        return { error: "Each track must be an object with title and position" };
      }
      const t = track as Record<string, unknown>;
      if (!t.title || typeof t.title !== "string") {
        return { error: "Each track must have a string title" };
      }
      if (typeof t.position !== "number") {
        return { error: "Each track must have a numeric position" };
      }
    }
  }

  // Validate UUID format for albumId
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(b.albumId as string)) {
    return { error: "albumId must be a valid UUID" };
  }

  return {
    data: {
      albumId: b.albumId as string,
      mbid: (b.mbid as string) || "",
      title: b.title as string,
      artistName: b.artistName as string,
      releaseYear: (b.releaseYear as number) || 0,
      genres: ((b.genres as string[]) || []).filter(
        (g) => typeof g === "string"
      ),
      tracks: ((b.tracks as TrackInput[]) || []).map((t) => ({
        title: String(t.title),
        position: Number(t.position),
      })),
      forceRefresh: Boolean(b.forceRefresh),
    },
  };
}

// ---------------------------------------------------------------------------
// Cache: check for existing analysis
// ---------------------------------------------------------------------------

async function getCachedAnalysis(
  supabase: ReturnType<typeof createClient>,
  albumId: string
): Promise<CachedAnalysis | null> {
  const { data, error } = await supabase
    .from("ai_analyses")
    .select("*")
    .eq("album_id", albumId)
    .maybeSingle();

  if (error) {
    console.error("Cache lookup error:", error.message);
    return null;
  }

  return data as CachedAnalysis | null;
}

// ---------------------------------------------------------------------------
// Quota management
// ---------------------------------------------------------------------------

interface QuotaCheck {
  allowed: boolean;
  used: number;
  max: number;
}

/**
 * Checks and optionally increments the Gemini daily quota.
 * Automatically resets the counter if reset_at has passed.
 */
async function checkQuota(
  supabase: ReturnType<typeof createClient>
): Promise<QuotaCheck> {
  // First, auto-reset quota if the reset window has passed
  const { error: resetError } = await supabase
    .from("api_quotas")
    .update({
      used: 0,
      reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })
    .eq("id", "gemini_daily")
    .lt("reset_at", new Date().toISOString());

  if (resetError) {
    console.error("Quota reset error:", resetError.message);
  }

  // Now read the current quota
  const { data, error } = await supabase
    .from("api_quotas")
    .select("used, max_allowed")
    .eq("id", "gemini_daily")
    .single();

  if (error || !data) {
    console.error("Quota check error:", error?.message);
    // If we can't check quota, be conservative and allow (don't block on infra issues)
    return { allowed: true, used: 0, max: 100 };
  }

  return {
    allowed: data.used < data.max_allowed,
    used: data.used,
    max: data.max_allowed,
  };
}

/** Increments the quota usage counter by 1. */
async function incrementQuota(
  supabase: ReturnType<typeof createClient>
): Promise<void> {
  // Use rpc or raw update to atomically increment
  const { error } = await supabase.rpc("increment_quota", {
    quota_id: "gemini_daily",
  });

  if (error) {
    // Fallback: try a direct update if the rpc doesn't exist
    console.warn(
      "increment_quota RPC not found, using direct update:",
      error.message
    );
    const { data } = await supabase
      .from("api_quotas")
      .select("used")
      .eq("id", "gemini_daily")
      .single();

    if (data) {
      await supabase
        .from("api_quotas")
        .update({ used: data.used + 1 })
        .eq("id", "gemini_daily");
    }
  }
}

// ---------------------------------------------------------------------------
// Gemini API integration
// ---------------------------------------------------------------------------

/** Builds the system prompt for music criticism. */
function buildSystemPrompt(): string {
  return `You are a knowledgeable music critic and cultural writer. Given an album's metadata, write a concise, insightful analysis. Be specific — reference the actual tracks, genre conventions, and cultural context. Never invent facts you don't know. If you're uncertain about specific details, focus on what the genre, era, and tracklist suggest about the album's character. Write in a warm, authoritative editorial voice — like a thoughtful magazine feature, not a Wikipedia article.

You MUST respond with valid JSON matching this exact structure:
{
  "summary": "A concise 2-3 sentence album summary capturing its essence.",
  "themes": ["theme1", "theme2", "theme3"],
  "sound_description": "What the album sounds like — instrumentation, production style, mood.",
  "influences": "Musical influences, predecessors, and cultural context.",
  "significance": "Why this album matters — its impact, legacy, or what makes it notable."
}

Rules:
- "summary" should be 2-3 sentences, evocative and specific.
- "themes" should be 3-6 key thematic or sonic elements as short phrases.
- "sound_description" should be 2-4 sentences about the sonic palette.
- "influences" should be 2-3 sentences about lineage and context.
- "significance" should be 2-3 sentences about why it matters.
- Respond ONLY with the JSON object, no markdown fences or extra text.`;
}

/** Builds the user prompt from album metadata. */
function buildUserPrompt(req: AnalysisRequest): string {
  const trackList =
    req.tracks.length > 0
      ? req.tracks
          .sort((a, b) => a.position - b.position)
          .map((t) => `  ${t.position}. ${t.title}`)
          .join("\n")
      : "  (tracklist not available)";

  const genreStr =
    req.genres.length > 0 ? req.genres.join(", ") : "genre not specified";

  return `Analyze this album:

Title: ${req.title}
Artist: ${req.artistName}
Year: ${req.releaseYear || "unknown"}
Genre(s): ${genreStr}

Tracklist:
${trackList}

Provide your analysis as the specified JSON structure.`;
}

/** Calls the Gemini API and returns the parsed analysis. */
async function callGemini(
  req: AnalysisRequest,
  apiKey: string
): Promise<{ result?: AnalysisResult; tokenCount?: number; error?: string; status?: number }> {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(req);

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    generationConfig: {
      temperature: GEMINI_TEMPERATURE,
      maxOutputTokens: GEMINI_MAX_TOKENS,
      responseMimeType: "application/json",
    },
  };

  let response: Response;
  try {
    response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
  } catch (fetchError) {
    console.error("Gemini fetch error:", fetchError);
    return { error: "Failed to reach AI service", status: 502 };
  }

  // Handle Gemini error responses
  if (!response.ok) {
    const errorText = await response.text().catch(() => "unknown error");
    console.error(`Gemini API error ${response.status}:`, errorText);

    if (response.status === 429) {
      return { error: "AI service rate limited, try again later", status: 429 };
    }
    return { error: "AI analysis unavailable", status: 502 };
  }

  // Parse the Gemini response
  let geminiResponse: Record<string, unknown>;
  try {
    geminiResponse = await response.json();
  } catch {
    console.error("Failed to parse Gemini response as JSON");
    return { error: "AI analysis unavailable", status: 502 };
  }

  // Extract the generated text from Gemini's response structure
  // Structure: { candidates: [{ content: { parts: [{ text: "..." }] } }], usageMetadata: { ... } }
  const candidates = geminiResponse.candidates as Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;

  if (!candidates || candidates.length === 0) {
    console.error("No candidates in Gemini response:", geminiResponse);
    return { error: "AI analysis unavailable", status: 502 };
  }

  const generatedText = candidates[0]?.content?.parts?.[0]?.text;
  if (!generatedText) {
    console.error("No text in Gemini response candidate:", candidates[0]);
    return { error: "AI analysis unavailable", status: 502 };
  }

  // Extract token count from usage metadata
  const usageMetadata = geminiResponse.usageMetadata as {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
  };
  const tokenCount = usageMetadata?.totalTokenCount ?? 0;

  // Parse the structured JSON from Gemini's output
  let analysis: AnalysisResult;
  try {
    // Clean up potential markdown fences just in case
    const cleanedText = generatedText
      .replace(/^```json\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleanedText);

    // Validate and coerce the structure
    analysis = {
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      themes: Array.isArray(parsed.themes)
        ? parsed.themes.filter((t: unknown) => typeof t === "string")
        : [],
      sound_description:
        typeof parsed.sound_description === "string"
          ? parsed.sound_description
          : "",
      influences:
        typeof parsed.influences === "string" ? parsed.influences : "",
      significance:
        typeof parsed.significance === "string" ? parsed.significance : "",
    };

    // Validate we got meaningful content
    if (!analysis.summary) {
      console.error("Gemini returned empty summary");
      return { error: "AI analysis unavailable", status: 502 };
    }
  } catch (parseError) {
    console.error("Failed to parse Gemini output as structured JSON:", parseError);
    console.error("Raw text:", generatedText.substring(0, 500));
    return { error: "AI analysis unavailable", status: 502 };
  }

  return { result: analysis, tokenCount };
}

// ---------------------------------------------------------------------------
// Cache: save analysis to DB
// ---------------------------------------------------------------------------

async function cacheAnalysis(
  supabase: ReturnType<typeof createClient>,
  albumId: string,
  analysis: AnalysisResult,
  tokenCount: number
): Promise<CachedAnalysis | null> {
  const row = {
    album_id: albumId,
    summary: analysis.summary,
    themes: analysis.themes,
    sound_description: analysis.sound_description,
    influences: analysis.influences,
    significance: analysis.significance,
    generated_at: new Date().toISOString(),
    model_version: GEMINI_MODEL,
    token_count: tokenCount,
  };

  // Upsert: insert or update on album_id conflict
  const { data, error } = await supabase
    .from("ai_analyses")
    .upsert(row, { onConflict: "album_id" })
    .select()
    .single();

  if (error) {
    console.error("Failed to cache analysis:", error.message);
    return null;
  }

  return data as CachedAnalysis;
}

// ---------------------------------------------------------------------------
// Response helpers
// ---------------------------------------------------------------------------

function jsonResponse(
  body: Record<string, unknown>,
  status = 200
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status);
}

// ---------------------------------------------------------------------------
// Main handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  // Only allow POST
  if (req.method !== "POST") {
    return errorResponse("Method not allowed", 405);
  }

  // ---------------------------------------------------------------------------
  // 1. Authenticate the request
  // ---------------------------------------------------------------------------
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errorResponse("Missing or invalid authorization header", 401);
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const geminiApiKey = Deno.env.get("GEMINI_API_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables");
    return errorResponse("Server configuration error", 500);
  }

  if (!geminiApiKey) {
    console.error("Missing GEMINI_API_KEY environment variable");
    return errorResponse("AI service not configured", 500);
  }

  // Create a user-scoped client to verify authentication
  const userClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const {
    data: { user },
    error: authError,
  } = await userClient.auth.getUser();

  if (authError || !user) {
    return errorResponse("Unauthorized", 401);
  }

  // Create a service-role client for DB operations (bypasses RLS for writes)
  const serviceClient = createClient(supabaseUrl, supabaseServiceKey);

  // ---------------------------------------------------------------------------
  // 2. Parse and validate request body
  // ---------------------------------------------------------------------------
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const validation = validateRequest(body);
  if (validation.error) {
    return errorResponse(validation.error, 400);
  }
  const input = validation.data!;

  // ---------------------------------------------------------------------------
  // 3. Check cache (unless forceRefresh)
  // ---------------------------------------------------------------------------
  if (!input.forceRefresh) {
    const cached = await getCachedAnalysis(serviceClient, input.albumId);
    if (cached) {
      return jsonResponse({
        data: {
          summary: cached.summary,
          themes: cached.themes,
          sound_description: cached.sound_description,
          influences: cached.influences,
          significance: cached.significance,
          generated_at: cached.generated_at,
          model_version: cached.model_version,
        },
        cached: true,
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 4. Check quota before calling Gemini
  // ---------------------------------------------------------------------------
  const quota = await checkQuota(serviceClient);
  if (!quota.allowed) {
    return errorResponse("AI analysis temporarily unavailable", 429);
  }

  // ---------------------------------------------------------------------------
  // 5. Call Gemini API
  // ---------------------------------------------------------------------------
  const geminiResult = await callGemini(input, geminiApiKey);

  if (geminiResult.error) {
    return errorResponse(
      geminiResult.error,
      geminiResult.status || 502
    );
  }

  const analysis = geminiResult.result!;
  const tokenCount = geminiResult.tokenCount ?? 0;

  // ---------------------------------------------------------------------------
  // 6. Cache the result and increment quota (fire-and-forget for speed,
  //    but we await to ensure consistency)
  // ---------------------------------------------------------------------------
  const [cachedRow] = await Promise.all([
    cacheAnalysis(serviceClient, input.albumId, analysis, tokenCount),
    incrementQuota(serviceClient),
  ]);

  // ---------------------------------------------------------------------------
  // 7. Return the analysis
  // ---------------------------------------------------------------------------
  return jsonResponse({
    data: {
      summary: analysis.summary,
      themes: analysis.themes,
      sound_description: analysis.sound_description,
      influences: analysis.influences,
      significance: analysis.significance,
      generated_at: cachedRow?.generated_at ?? new Date().toISOString(),
      model_version: GEMINI_MODEL,
    },
    cached: false,
  });
});
