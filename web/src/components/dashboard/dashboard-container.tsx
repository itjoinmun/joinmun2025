
import { cn } from "@/utils/cn";

const DashboardContainer = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <main
      className={cn(
        `mx-auto flex w-full flex-col gap-4 px-4 py-6`,
        className,
      )}
    >
      {children}
    </main>
  );
};

export default DashboardContainer;
