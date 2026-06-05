import { inngest } from "./client";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import * as Sentry from "@sentry/nextjs";

export const inngest1 = inngest.createFunction(
  { id: "top-1", triggers: { event: "app/top-1" } },
  async ({
    event,
    step,
  }: {
    event: { data: { promptI: string } };
    step: any;
  }) => {
    const { promptI } = event.data;
    try {
      Sentry.logger.error("ho gaya kaaand fat  gaya brahmaand");
      await step.sleep("starting work in 3 seconf", 3000);
      const { text } = await step.ai.wrap("working on love", generateText, {
        model: openai("gpt-5-nano"),
        prompt: promptI,
      });
      return text;
    } catch (error) {
      console.error(error);
      return "ai generation failed";
    }
  },
);
