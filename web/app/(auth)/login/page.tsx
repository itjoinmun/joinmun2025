import { buttonVariants } from "@/components/ui/button";
import AuthTemplate from "@/modules/auth/auth-template";
import LoginForm from "@/modules/auth/login-form";
import { cn } from "@/utils/cn";
import Link from "next/link";

const LoginPage = () => {
  return (
    <AuthTemplate
      src="/assets/auth/login.webp"
      caption="We must work closely together to make this year a year of global action, one that will be remembered as the dawn of a new era of sustainable development."
    >
      <section className=" flex flex-col items-center gap-0 *:text-center md:gap-2">
        <h1 className="text-gradient-gold text-xl md:text-2xl">Welcome Back</h1>
        <h1 className="text-gradient-gold text-xl font-bold md:text-2xl">Enter Your Acount</h1>
      </section>

      <LoginForm />

      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href={`/signup`}
          className={cn(
            buttonVariants({ variant: "link" }),
            "inline w-fit px-0 font-bold hover:underline hover:underline-offset-2",
          )}
        >
          Register
        </Link>
      </p>
    </AuthTemplate>
  );
};

export default LoginPage;
