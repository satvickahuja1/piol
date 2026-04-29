"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useWorkflowsParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

type entityHeaderProps = {
  title: string;
  description?: string;
  buttonLabel: string;
  disabled?: boolean;
  isActive?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { onNew?: never; newButtonHref?: never }
  | { onNew?: never; newButtonHref: string }
);

export function EntityHeader({
  title,
  description,
  buttonLabel,
  disabled,
  isActive,
  onNew,
  newButtonHref,
}: entityHeaderProps) {
  return (
    <div className=" flex flex-row items-center w-full justify-between space-x-4">
      <div className=" flex flex-col">
        <h1>{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && (
        <Button size={"sm"} onClick={onNew}>
          {buttonLabel}
        </Button>
      )}
      {newButtonHref && <Link href={newButtonHref}>{buttonLabel}</Link>}
    </div>
  );
}

type EntityContainerProps = {
  header: React.ReactNode;
  pagination: React.ReactNode;
  search: React.ReactNode;
  children: React.ReactNode;
};

export function EntityContainer({
  header,
  pagination,
  search,
  children,
}: EntityContainerProps) {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8  h-[10vh]">
        {header}
      </div>
      <div className=" flex flex-col  gap-y-4 h-[30vh] max-h-screen">
        {search}
        {children}
      </div>
      {pagination}
    </div>
  );
}

type EntitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export const EntitySearch = ({
  value,
  onChange,
  placeholder,
}: EntitySearchProps) => {
  const [param, setParam] = useWorkflowsParams();
  const { searchValue, changeSearchValue } = useEntitySearch({
    params: param,
    setParams: setParam,
    debounceMs: 500,
  });

  return (
    <div className="relative ml-auto ">
      <SearchIcon className="size-3.5 absolute left-3 top-1/4 text-muted-foreground" />
      <Input
        className="bg-background max-w-50 shadow-none border-border pl-8"
        value={searchValue}
        onChange={(e) => changeSearchValue(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
};

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const  EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex justify-between items-center gap-x-2 w-full ">
      <div className="flex-1 text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          disabled={page === 1 || disabled}
          variant={"outline"}
          size={"sm"}
          onClick={() => {onPageChange(Math.max(1,page-1))}}
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPages || totalPages == 0 || disabled}
          variant={"outline"}
          size={"sm"}
          onClick={() => {onPageChange(Math.min(totalPages,page+1))}}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
