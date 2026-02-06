"use client";

import * as React from "react";
import { Field } from "@base-ui/react/field";
import {
  Controller,
  FormProvider,
  useFormContext,
  useFormState,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { cn } from "@/lib/cn";
import { Label } from "@/components/ui/label";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  return {
    name: fieldContext.name,
    ...fieldState,
  };
};

function FormItem({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Field.Root>, "className"> & { className?: string }) {
  const { error } = useFormField();

  return (
    <Field.Root
      data-slot="form-item"
      invalid={!!error}
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

function FormLabel({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Field.Label>, "className"> & { className?: string }) {
  return (
    <Field.Label
      render={<Label />}
      data-slot="form-label"
      className={cn("data-[invalid]:text-destructive", className)}
      {...props}
    />
  );
}

function FormControl({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Field.Control>, "className"> & { className?: string }) {
  return (
    <Field.Control
      render={children as React.ReactElement}
      data-slot="form-control"
      className={className}
      {...props}
    />
  );
}

function FormDescription({
  className,
  ...props
}: Omit<React.ComponentProps<typeof Field.Description>, "className"> & { className?: string }) {
  return (
    <Field.Description
      data-slot="form-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Field.Error>, "className"> & { className?: string }) {
  const { error } = useFormField();
  const body = error ? String(error?.message ?? "") : children;

  if (!body) {
    return null;
  }

  return (
    <Field.Error
      data-slot="form-message"
      className={cn("text-destructive text-sm", className)}
      {...props}
    >
      {body}
    </Field.Error>
  );
}

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
};
