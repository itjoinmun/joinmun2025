import { Heading } from "@/components/Layout/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Council } from "@/utils/helpers/councils";

const CouncilData = (props: Council) => {
  return (
    <section className="bg-gray flex gap-6 p-4 md:items-center md:p-6">
      <Avatar className="hidden size-24 md:flex">
        <AvatarImage src={`/assets/councils/logo/${props.logo}`} />
        <AvatarFallback>{props.name}</AvatarFallback>
      </Avatar>
      <div className="flex w-full flex-col gap-2">
        <Heading className="text-gradient-gold flex items-center gap-3 text-2xl font-bold text-pretty">
          <Avatar className="size-16 md:hidden">
            <AvatarImage src={`/assets/councils/${props.src}`} />
            <AvatarFallback>{props.name}</AvatarFallback>
          </Avatar>

          {props.fullname}
        </Heading>

        <hr className="border-gray-light my-2 w-full border-b" />

        <div className="flex flex-col gap-3 *:text-pretty md:flex-row md:gap-6">
          <p className="w-full font-bold md:w-2/6 md:text-lg">&quot;{props.quote}&quot;</p>
          <p className="w-full text-sm md:w-4/6 md:text-base">{props.description}</p>
        </div>
      </div>
    </section>
  );
};

export default CouncilData;
