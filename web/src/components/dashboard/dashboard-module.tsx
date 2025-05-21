import { cn } from "@/utils/helpers/cn";

/**
 * Example usage of DashboardModule components
 *
 * import {
 * DashboardModule,
 * DashboardModuleHeader,
 * DashboardModuleCard } from "./dashboard-module";
 *
 * const Example = () => (
 *
 *     <DashboardModule>
 *       <DashboardModuleHeader>
 *          <DashboardModuleTitle>Title</DashboardModuleTitle>
 *          <DashboardModuleDescription>Description</DashboardModuleDescription>
 *       </DashboardModuleHeader>
 *       <DashboardModuleCard >
 *           Your content
 *       </DashboardModuleCard>
 *     </DashboardModule>
 * )
 */

const DashboardModule = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <section className={cn(`flex flex-col gap-3`, className)}>{children}</section>;
};

const DashboardModuleHeader = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <header className={cn("space-y-1 leading-snug", className)}>{children}</header>;
};

const DashboardModuleTitle = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <h1 className={cn("font-bold", className)}>{children}</h1>;
};

const DashboardModuleDescription = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <p className={cn("text-sm font-normal", className)}>{children}</p>;
};

const DashboardModuleContent = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <section className={cn(`bg-gray flex flex-col gap-2 rounded-lg p-4 md:p-6`, className)}>
      {children}
    </section>
  );
};

export {
  DashboardModule,
  DashboardModuleHeader,
  DashboardModuleTitle,
  DashboardModuleDescription,
  DashboardModuleContent,
};
