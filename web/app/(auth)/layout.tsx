import Image from "next/image";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="relative z-0">
      {children}
      <Image
        src={`/assets/batik.svg`}
        alt="Batik Pattern"
        height={465}
        width={1451}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 rotate-180 opacity-25"
      />
    </main>
  );
};

export default AuthLayout;
