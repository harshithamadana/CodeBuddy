# CodeBuddy

A Socratic coding tutor powered by Claude AI. Instead of handing you the answer, it asks you the right question.

---

## Why I built this

I built this for students who are learning to code and keep getting stuck on concepts they don't fully understand. The usual options are bad: Google gives you an answer you can copy but not understand, ChatGPT writes the code for you, and documentation assumes you already know what you're doing. None of them actually teach you.

CodeBuddy has two modes that solve this differently. Guide mode is a Socratic tutor: it never gives you the answer directly. Instead it asks you questions that push you toward figuring it out yourself, which is the only way something actually sticks. Deep Dive mode is the opposite: if you just need to understand something and don't have time to be guided through it, it explains everything clearly from scratch.

It connects to Claude's API and uses a layered system prompt that controls how the AI behaves depending on which mode you're in! 

---

## How the prompt architecture works

This was the most interesting part to figure out. There are three layers that stack on top of each other to shape every response:

**Layer 1 — The base persona**
This is always active, no matter what. It tells Claude who it is: a warm, patient tutor whose job is to guide, not to give answers. It also sets the absolute rules: no compliments at the start of a response, no jargon without an explanation, never start with "Great question!"

**Layer 2 — The mode modifier**
This overrides the teaching *style* based on which mode the user selected:
- **Guide mode** locks everything down and there are no direct answers, no code, just one guiding question per response. Purely Socratic.
- **Deep Dive mode** does the opposite, and it explicitly un-Socratizes the AI and tells it to give a full explanation with code examples, structured in four parts. The user asked to be taught, so teach them.
- **Debug mode** forces the scientific method where Claude asks "what did you expect? what happened? where should we look?" and walks the student toward finding the bug themselves.

**Layer 3 — The subject context**
Each topic (Python, JavaScript, HTML/CSS, CS concepts, debugging) adds a short sentence to the prompt that tells Claude which domain it's operating in. This keeps analogies and examples relevant.

These three layers get combined into a single system prompt string on every request. The user's message history (last 10 messages) is also sent each time so Claude remembers the conversation.

---

## Data flow

```
User types a message in the browser
           │
           ▼
   React frontend (port 5173)
   useChat.js collects: message + history + subject + mode
           │
           │  POST /chat  (JSON)
           ▼
   Express server (port 3001)
   Reads ANTHROPIC_API_KEY from .env
   Builds system prompt:
     BASE_PERSONA + MODE_MODIFIER + SUBJECT_CONTEXT
           │
           │  HTTPS request
           ▼
   Anthropic API → claude-sonnet-4-5
           │
           │  response.content[0].text
           ▼
   Express sends { reply } back to frontend
           │
           ▼
   MessageBubble renders the response
   (parses markdown, highlights code blocks)
```

---

## How to run it locally (Windows)

You'll need Node.js installed and an Anthropic API key. You can get a key at [console.anthropic.com](https://console.anthropic.com) — there's a free tier.

**1. Clone the repo**
```powershell
git clone https://github.com/harshithamadana/CodeBuddy.git
cd CodeBuddy
```

**2. Install server dependencies**
```powershell
cd server
npm install
```

**3. Add your API key**

Create a file called `.env` inside the `server/` folder:
```
ANTHROPIC_API_KEY=your-key-here
```
(There's a `server/.env.example` showing the format.)

**4. Start the backend**
```powershell
node index.js
```
You should see: `CodeBuddy server running on http://localhost:3001`

**5. Open a second terminal, install frontend dependencies**
```powershell
cd codebuddy
npm install
```

**6. Start the frontend**
```powershell
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## What I learned

**The hardest part wasn't the code, it was the prompts.**
Getting the AI to behave consistently across three different modes took way more iteration than I expected. The base system prompt kept bleeding into the mode modifiers. I eventually had to restructure it so the base persona only contains universal rules, and each mode modifier is fully self-contained and can override the defaults.

**Environment variables and security.**
I learned the hard way why you don't hardcode API keys. Setting up `.gitignore` properly, using `dotenv`, making sure the `.env` file loads from an absolute path regardless of where you run the server from and these felt like small details but caused real bugs.

**Debugging async code is different.**
When the Express server was returning errors but `console.error` wasn't showing up in my logs, I had to isolate the problem by running the exact same API call as a standalone script. Turned out the background process wasn't capturing stderr the way I expected. The bug was a stale process holding the port — not the code itself.

**CSS is not easy.**
I spent an embarrassing amount of time on the glowing active-mode buttons. Getting the border color, background opacity, outer glow, inner glow, and text glow all working together and looking right at different screen brightnesses is genuinely hard.

---

## Tech stack

| Layer | What I used |
|---|---|
| Frontend | React 19, Vite, custom CSS (no Tailwind in the end) |
| Backend | Node.js, Express 5 |
| AI | Anthropic Claude API (`claude-sonnet-4-5`) |
| Syntax highlighting | `react-syntax-highlighter` |
| Fonts | Sora, Inter, JetBrains Mono |

---

*Built by Harshitha Madana — UWB*
