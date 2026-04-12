// src/inngest/functions.ts
import { model } from "@/lib/ai";
import { inngest } from "./client";
import { openai } from "@ai-sdk/openai";
import {generateText } from 'ai'

export const goai = inngest.createFunction({
  id :"go-ai",
  triggers : {event:'go/ai'}
}, async ({event,step})=>{
  await  step.sleep('wait for 10s','10s')
  const {steps} = await step.ai.wrap('generating-text',generateText,{model : openai('gpt-5-nano'), prompt : "what is 3 * 3 in maths"})
  return steps
})