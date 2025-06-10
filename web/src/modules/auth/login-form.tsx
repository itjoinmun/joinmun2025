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
import { cn } from "@/utils/helpers/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeClosed, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address").nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

const LoginForm = () => {
  const [pending, setPending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loadingReset, setLoadingReset] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);
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
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        credentials: "include",
      });

      if (!res.ok) {
        setPending(false);
        setError("Invalid credentials. Please check your email and password again.");
        return;
      }

      router.push("/dashboard/home");
    } catch (error) {
      console.error(error);
      setError("An error occurred while logging in. Please try again later.");
      setPending(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = form.getValues("email");
    if (!email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    try {
      setLoadingReset(true);
      setResetMessage(null);
      setError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/request-password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) throw new Error("Failed to send password reset email.");

      setResetMessage("A password reset email has been sent to your email address.");
    } catch {
      setError("Failed to send reset email");
    } finally {
      setLoadingReset(false);
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
                <Input placeholder="Enter your email" autoFocus autoComplete="email" {...field} />
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
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="off"
                    {...field}
                  />
                  <Button
                    type="button"
                    size={`icon`}
                    variant={`ghost`}
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer hover:bg-transparent"
                  >
                    {showPassword ? <Eye /> : <EyeClosed />}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <div className="text-center text-sm text-red-500 md:text-start">{error}</div>}
        {resetMessage && <div className="text-center text-sm text-green-500">{resetMessage}</div>}

        <Button
          disabled={pending}
          type="submit"
          variant="primary"
          className="w-full cursor-pointer"
        >
          {pending ? (
            <>
              <Loader className="animate-spin" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>

        <hr className="border-gray mb-6 border-b-2" />

        <Button
          variant="gray"
          className={cn("w-full")}
          onClick={handlePasswordReset}
          disabled={loadingReset}
        >
          {loadingReset ? (
            <>
              <Loader className="animate-spin" /> Sending...
            </>
          ) : (
            "Forgot Password"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
