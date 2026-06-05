"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { useWorkflowsParams } from "../hooks/use-workflow-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className=" flex flex-col  gap-y-4 max-h-screen">
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

export const EntityPagination = ({
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
          onClick={() => {
            onPageChange(Math.max(1, page - 1));
          }}
        >
          Previous
        </Button>
        <Button
          disabled={page === totalPages || totalPages == 0 || disabled}
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            onPageChange(Math.min(totalPages, page + 1));
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

interface stateViewProps {
  message?: string;
}

interface loadingViewProps extends stateViewProps {
  entity?: string;
}

export const LoadingView = ({
  message,
  entity = "items",
}: loadingViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <Loader2Icon className="size-6 animate-spin text-muted-foreground" />

      {message && (
        <p className="text-sm text-muted-foreground">
          {message || `Loading ${entity}...`}
        </p>
      )}
    </div>
  );
};
interface errorViewProps extends stateViewProps {
  entity?: string;
}

export const ErrorView = ({ message, entity = "items" }: errorViewProps) => {
  return (
    <div className="flex justify-center items-center h-full flex-1 flex-col gap-y-4">
      <AlertTriangleIcon className="size-6 text-muted-foreground" />

      {message && (
        <p className="text-sm text-muted-foreground">
          {message || `Loading ${entity}...`}
        </p>
      )}
    </div>
  );
};

interface emptyViewProps extends stateViewProps {
  onNew?: () => void;
}

export const EmptyView = ({ onNew, message }: emptyViewProps) => {
  return (
    <Empty className="border border-dashed bg-white">
      <EmptyHeader>
        <EmptyMedia>
          <PackageOpenIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>No items</EmptyTitle>
      {message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onNew && (
        <EmptyContent>
          <Button onClick={onNew}>Add Items</Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface entityListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: entityListProps<T>) {
  if (items.length == 0 && emptyView) {
    return (
      <div className="flex flex-1 justify-center items-center">
        <div className="max-w-sm mx-auto">{emptyView}</div>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col  gap-y-4", className)}>
      {items.map((res, index) => {
        return (
          <div key={getKey ? getKey(res, index) : index}>
            {renderItem(res, index)}
          </div>
        );
      })}
    </div>
  );
}

interface entityItemsProps {
  href: string;
  title: string | null;
  subtitle?: React.ReactNode;
  image?: React.ReactNode;
  action?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving: boolean;
  className?: string;
}

export const EntityItems = ({
  action,
  isRemoving,
  image,
  title,
  href,
  subtitle,
  className,
  onRemove,
}: entityItemsProps) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemove) {
      await onRemove();
    }
    if (isRemoving) {
      return;
    }
  };
  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 shadow-none hover:shadow cursor-pointer",
          isRemoving && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <CardContent className="flex flex-row items-center justify-between p-0">
          <div className=" flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              {!!subtitle && (
                <CardDescription className="text-xs">
                  {subtitle}
                </CardDescription>
              )}
            </div>
          </div>
          {(action || onRemove) && (
            <div className=" flex gap-x-4 items-center">
              {action}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end">
                  <DropdownMenuItem onClick={(e)=>{e.stopPropagation(), handleRemove(e)}}>
                      <TrashIcon className="size-4" /> Delete
                  </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
