"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, buttonVariants } from "@/components/ui/button";
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
import Link from "next/link";
import { cn } from "@/utils/cn";
import { useState } from "react";
import { Loader } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Email format is invalid").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

const LoginForm = () => {
  const [pending, setPending] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
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
        <Button disabled={pending} type="submit" variant={`primary`} className="w-full">
          {pending ? (
            <>
              <Loader className="animate-spin" /> Loading...
            </>
          ) : (
            "Login"
          )}
        </Button>

        <hr className="border-gray mb-6 border-b-2" />

        <Link
          href={`/forgot-password`}
          className={cn(buttonVariants({ variant: "gray" }), "w-full")}
        >
          Forgot Password
        </Link>
      </form>
    </Form>
  );
};

export default LoginForm;
