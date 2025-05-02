import Image from "next/image";

export default function WelcomingRemarks() {
  return (
    <main
      className={
        "bg-red-coming-soon relative flex min-h-[100dvhx] w-screen items-center overflow-hidden *:text-center"
      }
    >
      {/* Background Batik */}
      <Image
        src={"/assets/coming-soon/batik-2.webp"}
        alt={""}
        className={"absolute top-0 min-h-[85vhx] object-cover lg:h-auto lg:w-full"}
        width={1469}
        height={537}
      />

      <div className="z-10 flex gap-[38px] bg-transparent px-12 py-24">
        <Image
          src={"/assets/welcoming-remarks/KKM07434.jpg"}
          alt="KKM07434"
          className=""
          width={546}
          height={345}
        />

        <div className="flex flex-col gap-7 text-left">
          <div className="flex flex-col gap-4">
            <p className="from-gold w-fit bg-gradient-to-r to-white bg-clip-text text-[18px] leading-[24px] font-[500] text-transparent">
              Hear From Our Leaders
            </p>
            <p className="from-gold w-fit bg-gradient-to-r to-white bg-clip-text text-[38px] leading-[51px] font-[700] text-transparent">
              Welcoming Remarks
            </p>
          </div>

          <p className="w-[755] text-[18px] leading-[24px] font-[500]">
            Welcome to JOINMUN, where ideas converge, collaboration thrives, and connections are
            made. We are truly honored to welcome all our esteemed guests, delegates, and
            participants who have taken the time to be here with us today.
          </p>
          <p className="w-[755px] text-[18px] leading-[24px] font-[500]">
            Your presence is a testament to the shared commitment we hold toward global dialogue,
            etc. This gathering would not be the same without the valuable perspectives, expertise,
            and energy each of you brings. Thank you for being part of this special occasion. We
            look forward to a meaningful and inspiring time together.
          </p>
        </div>
      </div>
    </main>
  );
}
