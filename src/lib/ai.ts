'server only'
// lib/ai.ts
import { ChatOpenAI } from "@langchain/openai";

export const model = new ChatOpenAI({
  model: "gpt-5-nano",
});

