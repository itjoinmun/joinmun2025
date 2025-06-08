"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .nonempty("Password is required"),
    confirm_password: z
      .string()
      .min(8, {
        message: "Password must be at least 8 characters.",
      })
      .nonempty("Confirm password is required"),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["confirm_password"],
      });
    }
  });

interface ForgotPasswordFormProps {
  token: string;
}

const ForgotPasswordForm = ({ token }: ForgotPasswordFormProps) => {
  const router = useRouter();
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof passwordSchema>) => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reset_token: token,
          new_password: values.password,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(responseData.error || "An error occurred");
      }
    } catch {
      setError("Failed to reset password");
    } finally {
      setPending(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                  {...field}
                />
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your new password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-center text-sm text-red-500 md:text-start">{error}</div>}

        <Button
          disabled={pending}
          type="submit"
          variant="primary"
          className="w-full cursor-pointer"
        >
          {pending ? (
            <>
              <Loader className="animate-spin" /> Loading...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;
