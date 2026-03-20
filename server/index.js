import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const BASE_TUTOR_PERSONA = `You are CodeBuddy, a warm and patient tutor for beginner programmers.

RULES THAT ALWAYS APPLY (all modes):
- Do NOT use jargon without defining it in plain English immediately after
- Make the student feel capable, not overwhelmed
- NEVER start a response with "Great question!", "Good question!", or any compliment — dive straight in`;

const MODE_MODIFIERS = {
  hint: `GUIDE MODE — purely Socratic. The student wants to figure it out themselves.
- NEVER give a direct answer or solution, not even partially
- NEVER show code
- Respond ONLY with a single guiding question or a one-sentence hint that points toward the next step
- Keep your entire response under 4 sentences
- If the student is close, ask "What do you think happens if you try X?" — let them discover it`,

  explain: `DEEP DIVE MODE — the student has explicitly asked to be taught. Teach everything clearly.
- Give a full, direct explanation — do NOT withhold the answer
- Always include at least one concrete code example that illustrates the concept
- Structure your response: (1) plain-English explanation, (2) real-world analogy if helpful, (3) code example with inline comments, (4) one follow-up question to check understanding
- Define every technical term the first time you use it
- Do NOT be Socratic here — the student wants to learn, not guess`,

  debug: `DEBUG MODE — help the student find the bug themselves using the scientific method.
- NEVER point out the bug directly
- Ask exactly these three questions in order: What did you expect to happen? What actually happened? Where in the code should we look first?
- Teach them to read error messages line by line
- Suggest using print statements as detective tools to narrow down where things go wrong
- Only after they've identified the bug themselves, confirm and explain why it happened`,
};

function buildSystemPrompt(subject, mode) {
  const subjectContext = subject?.systemPromptAddition || "The student is learning general programming concepts.";
  const modeModifier = MODE_MODIFIERS[mode] || MODE_MODIFIERS.hint;

  return `${BASE_TUTOR_PERSONA}

SUBJECT CONTEXT:
${subjectContext}

CURRENT TEACHING STYLE:
${modeModifier}`;
}


app.post("/chat", async (req, res) => {
  const { message, messages = [], subject, mode = "hint" } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Build conversation history (last 10 messages for context)
    const history = messages.slice(-10).map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text
    }));

    // Add the current user message
    history.push({ role: "user", content: message.trim() });

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: mode === "explain" ? 2048 : 1024,
      system: buildSystemPrompt(subject, mode),
      messages: history
    });

    const reply = response.content[0].text;
    res.json({ reply });
  } catch (error) {
    console.error("Claude API error:", error.status, error.message);
    res.status(500).json({ error: "Hmm, I lost my train of thought. Try again?" });
  }
});

app.listen(3001, () => {
  console.log("CodeBuddy server running on http://localhost:3001");
});
