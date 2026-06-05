import { PAGINATION } from "@/config/pagination";
import { useEffect, useState } from "react";

interface UseEntitySearchProps<T extends { search: string; page: number }> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}
export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs,
}: UseEntitySearchProps<T>) {
  const [localsearch, setLocalsearch] = useState(params.search);
  useEffect(() => {
    if (localsearch === "" && params.search != "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });
      return;
    }
    if (localsearch !== params.search) {
      const timer = setTimeout(() => {
        setParams({
          ...params,
          search: localsearch,
          page : PAGINATION.DEFAULT_PAGE
        });
      }, debounceMs);
      return () => clearTimeout(timer);
    }
  }, [localsearch, debounceMs, params, setParams]);
  useEffect(() => {
    setLocalsearch(params.search);
  },[params.search]);
  return {
    searchValue : localsearch,
    changeSearchValue : setLocalsearch
  }
}
