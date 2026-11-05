import {
  getApiKey,
  getBaseUrl,
  getModel,
} from "https://cdn.jsdelivr.net/gh/trythursday/ai-for-all@main/src/client/storage.js";

const SYSTEM_PROMPT_URL = new URL(
  "../static/SYSTEM-PROMPT.md",
  import.meta.url,
);
const OPENAI_URL = "https://esm.sh/jsr/@agent/openai@0.0.8";

let openaiPromise;
let systemPrompt;

export const preload = () => (openaiPromise ??= import(OPENAI_URL));

// The answer is written for one moment in time. Say which, in the reader's own
// timezone, rather than leaving the model to infer it from training data.
const now = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZoneName: "short",
});

async function loadSystemPrompt() {
  if (!systemPrompt) {
    systemPrompt = await (await fetch(SYSTEM_PROMPT_URL)).text();
  }

  return `${systemPrompt}\n\nThe current date and time, in the user's timezone, is ${now.format(new Date())}.`;
}

export async function generate({ goal, thoughts, onToken }) {
  const OpenAI = await preload();

  const client = OpenAI.credentials({
    apikey: getApiKey(),
    baseURL: `${(getBaseUrl() ?? "").replace(/\/+$/, "")}/`,
  });

  const stream = await OpenAI.stream(client, {
    method: "POST",
    path: "/chat/completions",
    body: {
      stream: true,
      model: getModel(),
      messages: [
        { role: "system", content: await loadSystemPrompt() },
        { role: "user", content: `Goal: ${goal}\n\nThoughts:\n${thoughts}` },
      ],
    },
  });

  let text = "";

  for await (const chunk of stream) {
    text += chunk.choices[0]?.delta?.content ?? "";
    onToken?.(text);
  }

  return text;
}
