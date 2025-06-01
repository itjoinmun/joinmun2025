"use client";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { login } from "@/utils/actions/auth-handler";
import { cn } from "@/utils/helpers/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email format is invalid").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

const LoginForm = () => {
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setPending(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(res);
      }

      router.push("/dashboard/delegates");
    } catch (error) {
      console.error(error);
      setPending(false);
    } finally {
      // TO DO: Toast
    }
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
                <Input placeholder="fatimah@badr.co.id" autoFocus autoComplete="off" {...field} />
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
                <Input
                  type="password"
                  placeholder="fatimah@badr.co.id"
                  autoComplete="off"
                  {...field}
                />
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
