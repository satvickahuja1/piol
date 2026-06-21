import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import { db } from "@/drizzle";
import { workflow } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow", triggers: { event: "workflows/execute" } },
  async ({ event, step }) => {
    await step.sleep("infinite", "4s");
    const workflowId = event.data.workflowId;
    if (!workflowId) {
      throw new NonRetriableError("workflow id is missing");
    }

    const nodes = await step.run("prepare-workflow", async () => {
      const workflow1 = await db.query.workflow.findFirst({
        where: eq(workflow.id, workflowId),
        with: {
          node: true,
          connection: true,
        },
      });
      if (!workflow1) {
        throw new NonRetriableError("workflow not found");
      }
      return workflow1.node
    });
    return {nodes}
  },
);
