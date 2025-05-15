import { Heading } from "@/components/Layout/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Council } from "@/utils/helpers/councils";
import ReadMoreCouncil from "./read-more";
import { cn } from "@/utils/helpers/cn";

const CouncilData = (props: Council) => {
  return (
    <section className="bg-gray flex gap-6 rounded-lg p-4 md:items-center md:p-6">
      <div className="flex w-full flex-col gap-2">
        <Heading className="text-gradient-gold flex items-center gap-3 text-2xl font-bold text-pretty">
          <Avatar className="size-16 md:size-24">
            <AvatarImage src={`/assets/councils/logo/${props.logo}`} />
            <AvatarFallback>{props.name}</AvatarFallback>
          </Avatar>
          <span className="ml-2 md:text-4xl/snug xl:ml-5">{props.fullname}</span>
        </Heading>

        <hr className="border-gray-light my-2 w-full border-b" />

        <div className={cn(props.topic && "flex flex-col gap-3 *:text-pretty md:gap-6")}>
          {props.topic && (
            <div className="space-y-4">
              <p className="font-bold">Topic:</p>
              <ReadMoreCouncil
                html={props.topic}
                limit={300}
                className="w-full text-sm md:text-base"
              />
            </div>
          )}

          {props.topic && <hr className="border-gray-light my-2 w-full border-b" />}

          <div className="space-y-4">
            <p className="font-bold">Council Explanation:</p>
            <ReadMoreCouncil
              html={props.explanation}
              limit={300}
              className="w-full text-sm font-medium md:text-base"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CouncilData;
