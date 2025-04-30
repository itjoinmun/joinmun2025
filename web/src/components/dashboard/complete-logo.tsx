import Image from "next/image";
import Link from "next/link";

const CompleteLogo = () => {
  return (
    <Link href={`/dashboard`} className="flex items-center gap-3 select-none">
      <Image src={`/LOGO.png`} alt="JOINMUN" width={100} height={100} priority className="size-9" />

      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-nowrap">JOINMUN 2025</h1>
        <h3 className="text-xs">Model United Nations UGM</h3>
      </div>
    </Link>
  );
};

export default CompleteLogo;
