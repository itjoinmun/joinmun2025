import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={`/`} className="flex gap-3 items-center">
      <Image src={`/LOGO.png`} alt="JOINMUN" width={100} height={100} className="size-6" />

      <h1 className="font-bold text-nowrap">JOINMUN 2025</h1>
    </Link>
  );
};

export default Logo;
