import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import React from "react";

type entityHeaderProps = {
  title: string;
  description?: string;
  isActive?: boolean;
  newButtonLabel: string;
  isWriting?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { onNew?: never; newButtonHref: string }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  title,
  description,
  isActive,
  isWriting,
  newButtonHref,
  newButtonLabel,
  onNew,
}: entityHeaderProps) => {
  return (
    <div className="flex flex-row justify-between items-center gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl lg:text-2xl font-semibold">
          {title}
        </h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button
          size={"sm"}
          // disabled={isWriting || isActive || true}
          onClick={onNew}
        >
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {!onNew && newButtonHref && (
        <Link className="flex" href={newButtonHref} prefetch>
        <Button
          size={"sm"}
          disabled={isWriting || isActive || true}
          onClick={onNew}
          
        >
            <PlusIcon className="size-4" />
            {newButtonLabel}
        </Button>
          </Link>
      )}
    </div>
  );
};

type entityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: entityContainerProps) => {

  return(
    <div className="p-4 md:px-10 md:py-4 h-full">
      <div className="mx-auto max-w-7xl w-full flex flex-col gap-y-8 h-full">
        {header}
      <div className="flex flex-col gap-y-6 h-full">
        {search}
        {children}
      </div>
      {pagination}
      </div>
    </div>
  )

};
