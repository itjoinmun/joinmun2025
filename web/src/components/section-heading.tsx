import { cn } from "@/utils/cn";

const Heading = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <h1
      className={cn(
        "text-gradient-gold shrink-0 text-3xl/snug font-bold md:text-4xl/snug",
        className,
      )}
    >
      {children}
    </h1>
  );
};

const SubHeading = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <h3 className={cn("text-gradient-gold", className)}>{children}</h3>;
};

export { Heading, SubHeading }; 
