"use client";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BackLink = ({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
}) => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  if (href)
    return (
      <Link href={href} className={cn(className)}>
        {children}
      </Link>
    );

  return (
    <div onClick={handleBack} className={cn(className)}>
      {children}
    </div>
  );
};

export default BackLink;
