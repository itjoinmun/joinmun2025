import { cn } from "@/utils/helpers/cn";
import Image from "next/image";

const BatikPattern = ({ className, square }: { className?: string; square?: boolean }) => {
  const batikClass = "pointer-events-none -z-10 absolute";

  if (square) {
    return (
      <Image
        src={`/assets/batik-square.svg`}
        alt="Batik Pattern"
        width={500}
        height={500}
        className={cn(batikClass, "-top-12 left-0 -z-10", className)}
      />
    );
  }

  return (
    <Image
      src={`/assets/batik.svg`}
      alt="Batik Pattern"
      height={465}
      width={1451}
      className={cn(batikClass, "inset-x-0 top-0 w-full", className)}
    />
  );
};

export default BatikPattern;
