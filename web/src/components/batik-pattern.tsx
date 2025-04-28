import { cn } from "@/utils/cn";
import Image from "next/image";

const BatikPattern = ({ className }: { className?: string}) => {
  return (
    <Image
      src={`/assets/batik.svg`}
      alt="Batik Pattern"
      height={465}
      width={1451}
      className={cn("pointer-events-none absolute inset-x-0 top-0 -z-10 w-full", className)}
    />
  );
};

export default BatikPattern;
