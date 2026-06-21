"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import z from "zod";
import { useReactFlow } from "@xyflow/react";

const formSchema = z.object({
  endpoint: z.url({ message: "please enter valid url" }),
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  body: z.string().optional(),
});

interface props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultEndpoint?: string;
  defaultMethod?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
}

export type FormType = z.infer<typeof formSchema>;

export const ExecutionNodeDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultEndpoint,
  defaultMethod,
}: props) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: defaultEndpoint,
      method: "GET",
      body: "",
    },
  });


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Http</DialogTitle>
          <DialogDescription>
            Configure setting to change http
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values: z.infer<typeof formSchema>) => {
            onSubmit({
              endpoint: values.endpoint,
              method: values.method,
              body: values.method,
            });
            onOpenChange(!open);
            
          })}
        >
          <FieldGroup>
            <Controller
              control={form.control}
              name="method"
              render={({ field, formState, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel>METHOD</FieldLabel>
                    <Select
                      {...field}
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="METHOD" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                      </SelectContent>
                      <FieldDescription className="text-muted-foreground">
                        Enter method
                      </FieldDescription>
                      {fieldState.error && (
                        <div className="text-red-400 text-xs">
                          {fieldState.error.message}
                        </div>
                      )}
                    </Select>
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              control={form.control}
              name="endpoint"
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel>Endpoint</FieldLabel>
                    <input
                      value={field.value}
                      onChange={field.onChange}
                      id=""
                      placeholder="Enter URL"
                    />
                    <FieldDescription className="text-muted-foreground">
                      Please enter url https://res/admin:3000/dfg
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              control={form.control}
              name="body"
              render={({ field, fieldState }) => {
                return (
                  <Field>
                    <FieldLabel>Body</FieldLabel>
                    <Textarea
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="enter body"
                    />
                    <FieldDescription className="text-muted-foreground text-xs">
                      please enter in a correct json body syntax
                    </FieldDescription>
                    {fieldState.error && (
                      <FieldError>{fieldState.error.message}</FieldError>
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <Button type="submit">Submit</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
