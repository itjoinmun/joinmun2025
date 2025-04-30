import { cn } from "@/utils/cn";

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
  return <section className={cn(`flex flex-col gap-3 ${className}`)}>{children}</section>;
};

const DashboardModuleHeader = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <header className={cn(className, "leading-snug space-y-1")}>{children}</header>;
};

const DashboardModuleTitle = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <h1 className={cn(className, "font-bold")}>{children}</h1>;
};

const DashboardModuleDescription = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <header className={cn(className, "font-normal text-sm")}>{children}</header>;
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
