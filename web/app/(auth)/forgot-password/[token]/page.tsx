"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/helpers/cn";
import Link from "next/link";
import AuthTemplate from "@/modules/auth/auth-template";
import ForgotPasswordForm from "@/modules/auth/forgot-password-form";
import { use } from "react";

type PassresetPageProps = {
  params: Promise<{
    token: string;
  }>;
};

const ResetPasswordPage = ({ params }: PassresetPageProps) => {
  const { token } = use(params);

  return (
    <AuthTemplate
      src="/assets/auth/register.webp"
      caption="Today's real borders are not between nations, but between powerful and powerless, free and fettered, privileged and humiliated."
    >
      <section className="flex flex-col items-center gap-0 *:text-center md:gap-2">
        <h1 className="text-gradient-gold text-xl md:text-2xl">Reset Your Password</h1>
        <h1 className="text-gradient-gold text-xl font-bold md:text-2xl">Create a New Password</h1>
      </section>

      <ForgotPasswordForm token={token} />

      <p className="text-sm">
        Remember your password?{" "}
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "link" }),
            "inline w-fit px-0 font-bold hover:underline hover:underline-offset-2",
          )}
        >
          Login
        </Link>
      </p>
    </AuthTemplate>
  );
};

export default ResetPasswordPage;
