"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import RegistrationNav from "@/modules/dashboard/delegates/registration/registration-nav";
import { cn } from "@/utils/helpers/cn";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { DEV_CLIENT_MIDDLEWARE_MANIFEST } from "next/dist/shared/lib/constants";

// 👏 Defining our form field metadata.
export interface FormFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  validation: z.ZodTypeAny;
  defaultValue: string;
}

/**
 * A container component for form sections
 *
 * @example
 * ```tsx
 * <FormWrapper className="my-4">
 *   <FormTitle>Personal Information</FormTitle>
 *   <FormContent>
 *     Your form fields here
 *   </FormContent>
 * </FormWrapper>
 * ```
 */
const RegistrationFormModule = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => <section className={cn("flex flex-col gap-8", className)}>{children}</section>;

/**
 * A component for form section titles
 *
 * @example
 * ```tsx
 * <FormTitle>Personal Information</FormTitle>
 * <FormTitle className="text-primary">Contact Details</FormTitle>
 * ```
 */
const FormHeader = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => <header className={cn("text-2xl font-bold text-white", className)}>{children}</header>;

/**
 * A container for form fields and content
 *
 * @example
 * ```tsx
 * <FormContent
 *   fields={formFields}
 *   onSubmit={(values) => {
 *     console.log('Form submitted with values:', values);
 *     // Handle form submission here
 *   }}
 * />
 * ```
 */
const FormContent = ({
  className,
  fields,
  onSubmit,
}: {
  className?: string;
  fields: FormFieldConfig[];
  onSubmit?: (values: any) => void;
}) => {
  // 1. Define the zod schema for validation.
  const schema = z.object(
    Object.fromEntries(fields.map((field) => [field.name, field.validation])),
  );

  // 2. Define our form.
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(fields.map((field) => [field.name, field.defaultValue])),
  });

  // 3. Submit handler.
  const handleSubmit = (values: z.infer<typeof schema>) => {
    // ✅ If a custom onSubmit is provided, use it. Otherwise, log to console.
    if (onSubmit) {
      onSubmit(values);
    } else {
      // ❎ Default behavior if no onSubmit handler is provided
      console.log(values);
    }
  };

  // 4. Render the form.
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          "grid auto-rows-min grid-cols-1 gap-8 md:auto-rows-fr md:grid-cols-2",
          className,
        )}
      >
        {fields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: fieldProps }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input placeholder={field.placeholder} {...fieldProps} />
                </FormControl>
                {field.description && <FormDescription>{field.description}</FormDescription>}
              </FormItem>
            )}
          />
        ))}
        <RegistrationNav />
      </form>
    </Form>
  );
};

export { FormContent, FormHeader, RegistrationFormModule };
