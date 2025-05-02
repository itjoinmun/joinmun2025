import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function () {
  return (
    <main className="flex gap-[38px] px-6 py-20">
      <div className="flex w-[754px] flex-col gap-7 text-left">
        <div className="flex flex-col gap-4">
          <p className="from-gold w-fit bg-gradient-to-r to-white bg-clip-text text-[18px] leading-[24px] font-[500] text-transparent">
            Contact Us
          </p>
          <p className="from-gold w-fit bg-gradient-to-r to-white bg-clip-text text-[38px] leading-[51px] font-[700] text-transparent">
            Get in Touch With Us
          </p>
          <p className="w-[642px] text-[18px] leading-[24px] font-[500]">
            Have questions or need assistance? Our team is here to help. Don’t hesitate to reach out
            — we’ll get back to you as soon as possible.
          </p>
        </div>

        {/* Button Contact Us */}
        <Link href={"/"} className={"mt-3 scale-75 sm:scale-90 md:mt-8 lg:scale-100"}>
          <Button variant={"primary"} size={"longer"} className="cursor-pointer">
            Contact Us
          </Button>
        </Link>
      </div>

      <Image
        src={"/assets/contact-us/LEF07703.jpg"}
        alt="LEF07703"
        className="h-[345] object-cover"
        width={607}
        height={345}
      />
    </main>
  );
}
