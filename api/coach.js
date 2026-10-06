// Vercel serverless function: POST /api/coach
// Keeps the Claude API key on the server, checks the person is signed in,
// loads their I-OPT profile and team from Supabase, and builds the Coach prompt.
//
// Required Vercel environment variables:
//   ANTHROPIC_API_KEY          - from console.anthropic.com
//   REACT_APP_SUPABASE_URL     - same value the browser app uses
//   REACT_APP_SUPABASE_ANON_KEY
// Optional:
//   ANTHROPIC_MODEL            - defaults to claude-sonnet-4-5

const { buildSystemPrompt } = require("./_buildPrompt");

const MAX_MESSAGES = 30;
const MAX_CHARS = 4000;

async function getJson(url, headers) {
  const r = await fetch(url, { headers });
  if (!r.ok) return null;
  return r.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
  const SUPABASE_ANON = process.env.REACT_APP_SUPABASE_ANON_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON || !ANTHROPIC_KEY) {
    res.status(500).json({ error: "Server is missing configuration." });
    return;
  }

  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) {
    res.status(401).json({ error: "Please sign in." });
    return;
  }

  const sbHeaders = { apikey: SUPABASE_ANON, Authorization: `Bearer ${token}` };

  // 1. Who is this? (Supabase validates the token.)
  const user = await getJson(`${SUPABASE_URL}/auth/v1/user`, sbHeaders);
  if (!user || !user.email) {
    res.status(401).json({ error: "Your session has expired. Please sign in again." });
    return;
  }

  // 2. Load their team's profiles. Row Level Security limits this to their own team.
  const rows = await getJson(`${SUPABASE_URL}/rest/v1/iopt_profiles?select=*`, sbHeaders);
  const me = (rows || []).find((r) => r.email.toLowerCase() === user.email.toLowerCase());
  if (!me) {
    res.status(403).json({ error: "No I-OPT profile found for this email." });
    return;
  }

  // 3. Clean up the conversation sent from the browser.
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const mode = body.mode === "report" ? "report" : "coach";
  let messages = Array.isArray(body.messages) ? body.messages : [];
  messages = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .slice(-MAX_MESSAGES);
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length) {
    res.status(400).json({ error: "No message to send." });
    return;
  }

  let system = buildSystemPrompt(me, rows);
  if (mode === "report") {
    system += "\n\nREPORT MODE\n\nYou are writing a written report section, not chatting. Follow the requested JSON format exactly and return only valid JSON with no markdown.";
  }

  // 4. Call Claude.
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: mode === "report" ? 1200 : 800,
        // Prompt caching: the long Coach prompt is billed at a fraction of the price on repeat messages.
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages,
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      console.error("Anthropic error", r.status, data);
      res.status(502).json({ error: "The Coach is unavailable right now. Please try again." });
      return;
    }
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    res.status(200).json({ text });
  } catch (e) {
    console.error(e);
    res.status(502).json({ error: "The Coach is unavailable right now. Please try again." });
  }
};
