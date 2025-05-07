import Image from "next/image";
import Link from "next/link";

const CompleteLogo = () => {
  return (
    <Link href={`/dashboard`} className="flex w-full items-center gap-3 select-none">
      <Image
        src={`/LOGO.png`}
        alt="JOINMUN"
        width={846}
        height={701}
        priority
        className="aspect-[846/701] size-9 w-full"
      />

      <div className="mr-1 flex flex-col gap-1">
        <h1 className="font-bold text-nowrap">JOINMUN 2025</h1>
        <h3 className="text-xs text-nowrap">Model United Nations UGM</h3>
      </div>
    </Link>
  );
};

export default CompleteLogo;
