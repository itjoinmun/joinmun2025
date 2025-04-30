import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={`/`} className="flex select-none items-center gap-3">
      <Image src={`/LOGO.png`} alt="JOINMUN" width={100} height={100} priority className="size-6" />

      <h1 className="font-bold text-nowrap">
        JOINMUN <span className="hidden md:inline">2025</span>
      </h1>
    </Link>
  );
};

export default Logo;
