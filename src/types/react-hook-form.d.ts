declare module "react-hook-form" {
  import * as React from "react";

  export type FieldValues = Record<string, any>;
  export type FieldPath<T extends FieldValues> = keyof T & string;
  export type FieldError = { message?: string; type?: string };

  export interface UseFormReturn<T extends FieldValues = FieldValues> {
    register: (name: FieldPath<T>) => any;
    handleSubmit: (onValid: any) => any;
    formState: { errors: Record<string, FieldError> };
    control: Control<T>;
  }

  export interface Control<T extends FieldValues = FieldValues> {}
  export interface ControllerProps<
    T extends FieldValues = FieldValues,
    N extends FieldPath<T> = FieldPath<T>
  > {
    name: N;
    control?: Control<T>;
    render: (props: { field: any; fieldState: { error?: FieldError } }) => React.ReactNode;
  }

  export const Controller: <
    T extends FieldValues = FieldValues,
    N extends FieldPath<T> = FieldPath<T>
  >(props: ControllerProps<T, N>) => React.ReactNode;

  export const FormProvider: React.FC<{
    children: React.ReactNode;
    [key: string]: any;
  }>;

  export function useFormContext<T extends FieldValues = FieldValues>(): {
    control: Control<T>;
    getFieldState: (name: FieldPath<T>, formState: any) => any;
    formState: { errors: Record<string, FieldError> };
  };

  export function useForm<T extends FieldValues = FieldValues>(props?: any): UseFormReturn<T>;
}
