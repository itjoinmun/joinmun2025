"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import RegistrationNav from "@/modules/dashboard/delegates/registration/registration-nav";
import { cn } from "@/utils/helpers/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// 👏 Defining our form field metadata.
export interface FormFieldConfig {
  id: number;
  name: string;
  type?: "text" | "file" ;
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
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
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

  // 5. Render the form.
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("grid auto-rows-min grid-cols-1 gap-8 md:grid-cols-2 md:gap-12", className)}
      >
        {fields.map((field) => {
          if (field.type === "file")
            return (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: fieldProps }) => (
                  <FormItem>
                    <FormLabel className="h-fit">{field.label}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={field.placeholder}
                        type={"file"}
                        accept="image/png, image/jpeg, image/jpg, application/pdf"
                        name={fieldProps.name}
                        ref={fieldProps.ref}
                        onBlur={fieldProps.onBlur}
                        onChange={(e) => fieldProps.onChange(e.target.files?.[0] || null)}
                        // value is intentionally not set from fieldProps.value for type="file"
                      />
                    </FormControl>
                    <FormDescription>
                      {field.description ? field.description : <>&nbsp;</>}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          return (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: fieldProps }) => (
                <FormItem>
                  <FormLabel className="">{field.label}</FormLabel>
                  <FormControl className="">
                    <Input placeholder={field.placeholder} {...fieldProps} className="" />
                  </FormControl>
                  <FormDescription className="">
                    {field.description ? field.description : <>&nbsp;</>}
                  </FormDescription>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
          );
        })}
        <RegistrationNav />
      </form>
    </Form>
  );
};

export { FormContent, FormHeader, RegistrationFormModule };

