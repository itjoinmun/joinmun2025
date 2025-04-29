import { buttonVariants } from "@/components/ui/button";
import AuthTemplate from "@/modules/auth/auth-template";
import RegisterForm from "@/modules/auth/register-form";
import { cn } from "@/utils/cn";
import Link from "next/link";

const SignupPage = () => {
  return (
    <AuthTemplate
      src="/lebron.webp"
      caption="Today’s real borders are not between nations, but between powerful and powerless, free and fettered, privileged and humiliated."
    >
      <section className="flex flex-col items-center gap-0 *:text-center md:mt-24 md:gap-2">
        <h1 className="text-gradient-gold text-xl md:text-2xl">Enter JOINMUN.</h1>
        <h1 className="text-gradient-gold text-xl font-bold md:text-2xl">Create an Account</h1>
      </section>

      <RegisterForm />

      <p className="text-sm mb-12">
        Already have an account?{" "}
        <Link
          href={`/login`}
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

export default SignupPage;
