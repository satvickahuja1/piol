// src/inngest/functions.ts
// import { model } from "@/lib/ai";
import { inngest } from "./client";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

import * as sentry from "@sentry/nextjs";

export const goai = inngest.createFunction(
  {
    id: "go-ai",
    triggers: { event: "go/ai" },
  },
  async ({ event, step }) => {
    sentry.logger.error("this can delete your whole data")
    sentry.logger.info("you did not listen everything got deleted")
    sentry.logger.error("no data left")

    await step.sleep("wait for 10s", "10s");
    const { steps } = await step.ai.wrap("generating-text", generateText, {
      model: openai("gpt-5-nano"),
      prompt: "what is 3 * 3 in maths",
      experimental_telemetry: {
        isEnabled: true,
        recordInputs: true,
        recordOutputs: true,
      },
    });
    return steps;
  },
);
