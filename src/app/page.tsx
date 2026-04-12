"use client";

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const page = () => {
  const trpc = useTRPC();
  const res = useMutation(
    trpc.testAi.mutationOptions({
      onSuccess: () => {
        toast("job queued successfully");
      },
      onError: () => {
        toast("unable to add job to queued");
      },
    }),
  );
  return (
    <div>
      <button
        onClick={() => {
          res.mutate();
        }}
      >
        <div></div>
        resthrt
      </button>
    </div>
  );
};

export default page;
