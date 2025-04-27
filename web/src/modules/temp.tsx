import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/button";

export const Test = () => {
  return (
    <div
      className={cn("bg-background flex min-h-screen flex-col items-center justify-center gap-10")}
    >
      <h1 className={"text-gradient-gold relative z-10 text-5xl leading-[1.5] font-bold"}>
        Example of style usage
      </h1>
      <div>
        <Button variant="default" className={cn("mr-4")}>
          dsadsa
        </Button>
        <Button variant="outline" className={cn("mr-4")}>
          dsadsa
        </Button>
        <Button variant="primary" className={cn("mr-4")}>
          dsadsa
        </Button>
        <Button variant="gray" className={cn("mr-4")}>
          dsadsa
        </Button>
        <div className={"bg-white"}>
          <Button variant="insideCard" className={cn("mr-4")}>
            dsadsa
          </Button>
          <Button variant="outline" className={cn("mr-4")}>
            dsadsa
          </Button>
        </div>
        <div className={"bg-foreground"}>
          <Button variant="gradient" className={cn("mr-4")}>
            dsadsa
          </Button>
        </div>
        <br />
        <h1 className={"text-gradient-gold"}>dsadansmdna</h1>
      </div>
    </div>
  );
};
