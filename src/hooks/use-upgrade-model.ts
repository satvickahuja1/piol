"use client";

import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { useQueries, useQuery } from "@tanstack/react-query";

export const useUpgradeModel = () => {
  const trpc = useTRPC();
  const result = useQuery(trpc.checkSubs.queryOptions());
  if (result.isError) {
    return { success: false, message: result.error };
  } else if (result.data) {
    return { success: true, data: result.data };
  }
};
