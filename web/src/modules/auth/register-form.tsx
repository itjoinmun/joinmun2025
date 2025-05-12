"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Loader } from "lucide-react";

const loginSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    email: z.string().email("Email format is invalid").nonempty("Email is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .nonempty("Password is required"),
    confirm_password: z
      .string()
      .min(8, {
        message: "Password password must be at least 8 characters.", // Password must be at least 8 characters.
      })
      .nonempty("Confirm password is required"),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match.", // Passwords do not match
        path: ["confirm_password"],
      });
    }
  });

const RegisterForm = () => {
  const [pending, setPending] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = () =>
    // values: z.infer<typeof loginSchema>
    {
      setPending(true);
      try {
        // post to backend api
      } catch (error) {
        console.error(error);
      } finally {
        setPending(false);
      }
      // do something
    };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="fatimah@badr.co.id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="fatimah@badr.co.id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fill Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="fatimah@badr.co.id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Refill Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="fatimah@badr.co.id" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={pending} type="submit" variant={`primary`} className="w-full">
          {pending ? (
            <>
              <Loader className="animate-spin" /> Loading...
            </>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
