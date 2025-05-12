import { cn } from "@/utils/helpers/cn";

/** 
 * Example usage of DashboardPage components
 * 
const Example = () => (
    <DashboardPage>
        <DashboardPageHeader>
            <DashboardPageTitle>Dashboard Title</DashboardPageTitle>
            <DashboardPageDescription>Description if needed</DashboardPageDescription>
        </DashboardPageHeader>

        other content goes here
    </DashboardPage>
)
*/

const DashboardPage = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <main className={cn(`flex flex-col gap-8`, className)}>{children}</main>;
};

const DashboardPageHeader = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <header className={cn(className, "space-y-1 leading-snug")}>{children}</header>;
};

const DashboardPageTitle = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <h1 className={cn(className, "text-gold text-lg font-medium")}>{children}</h1>;
};

const DashboardPageDescription = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return <p className={cn(className, "text-base")}>{children}</p>;
};

export { DashboardPage, DashboardPageDescription, DashboardPageHeader, DashboardPageTitle };
