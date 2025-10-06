import { cn } from "@/utils/helpers/cn";

const Container = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <main
      className={cn(
        `4xl:max-w-[1600px] mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-10 sm:px-8`,
        className,
      )}
    >
      {children}
    </main>
  );
};

export default Container;
