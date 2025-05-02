import Image from "next/image";

export default function AboutUs() {
  return (
    <main className="flex gap-[38px] px-6 py-20">
      <Image
        src={"/assets/about-us/NKO02971.jpg"}
        alt="NKO02971"
        className=""
        width={546}
        height={345}
      />

      <div className="flex w-[754px] flex-col gap-7 text-left">
        <div className="flex flex-col gap-4">
          <p className="from-gold w-fit bg-gradient-to-r to-white bg-clip-text text-[18px] leading-[24px] font-[500] text-transparent">
            About Us
          </p>
          <p className="from-gold w-fit bg-gradient-to-r to-white bg-clip-text text-[38px] leading-[51px] font-[700] text-transparent">
            JOINMUN :Where Youth Drive Impact
          </p>
          <p className="text-[18px] leading-[24px] font-[500]">
            Lorem ipsum dolor sit amet consectetur. Arcu scelerisque ultrices egestas ultrices
            aliquam arcu et egestas. Magnis ac parturient ac netus a eu. In risus tristique id
            consequat. Nibh pharetra gravida facilisis lacus faucibus scelerisque est luctus.
          </p>
        </div>
      </div>
    </main>
  );
}
