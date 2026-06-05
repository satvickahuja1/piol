ALTER TABLE "connection" RENAME COLUMN "nodeId" TO "fromNodeId";--> statement-breakpoint
ALTER TABLE "connection" DROP CONSTRAINT "connection_nodeId_node_id_fk";
--> statement-breakpoint
ALTER TABLE "connection" ADD COLUMN "toNodeId" text;--> statement-breakpoint
ALTER TABLE "connection" ADD CONSTRAINT "connection_fromNodeId_node_id_fk" FOREIGN KEY ("fromNodeId") REFERENCES "public"."node"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connection" ADD CONSTRAINT "connection_toNodeId_node_id_fk" FOREIGN KEY ("toNodeId") REFERENCES "public"."node"("id") ON DELETE cascade ON UPDATE no action;