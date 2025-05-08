import { Heading, SubHeading } from "@/components/section-heading";
import Container from "@/components/ui/container";
import Image from "next/image";

const RECOGNIZED_VALUE = [
  {
    icon: "https://img.icons8.com/ios-glyphs/120/ffffff/natural-food.png",
    title: "Living cultural traditions",
    subtitle:
      "The axis connects Mount Merapi, the Yogyakarta Palace, and the Indian Ocean — reflecting Javanese cosmology and the concept of harmony between nature, human life, and the spiritual realm.",
  },
  {
    icon: "https://img.icons8.com/ios-glyphs/120/ffffff/triskelion.png",
    title: "Philosophical Value",
    subtitle:
      "Embodies the Tri Mandala principle, a spatial and philosophical concept emphasizing balance between microcosm (individual), mesocosm (society), and macrocosm (universe).",
  },
  {
    icon: "https://img.icons8.com/ios-glyphs/120/ffffff/french-canadian-fleur-de-lys.png",
    title: "Cultural and Spiritual Heritage",
    subtitle:
      "The alignment hosts significant cultural and spiritual sites, integrating rituals, traditions, and daily life into a unified sacred landscape.",
  },
];

const ThemeUnesco = () => {
  return (
    <main className="bg-background relative -z-10 overflow-hidden">
      <Container className="gap-2">
        <SubHeading>Why The Sumbu Filosofi of Yogyakarta</SubHeading>
        <section className="grid grid-cols-1 gap-y-2">
          <Heading>Recognized by UNESCO</Heading>
          <div className="mt-7 flex flex-col gap-x-11 gap-y-8 lg:flex-row">
            <Image
              src="/assets/theme/recognized.webp"
              // placeholder="blur"
              // blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDUwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNkZGQiIC8+PC9zdmc+"
              alt="The Sumbu Filosofi of Yogyakarta"
              width={650}
              height={714}
              loading="lazy"
              className="aspect-[354/219] w-full shadow-lg lg:aspect-auto lg:h-full lg:max-w-[32%]"
            />
            <div className="flex h-fit flex-col gap-y-2 self-center">
              {RECOGNIZED_VALUE.map((item, index) => (
                <div key={index} className="mb-4 flex items-center gap-x-3 lg:gap-x-7">
                  <Image
                    width="90"
                    height="90"
                    src={item.icon}
                    alt="Icon"
                    className="w-11 text-white lg:w-14"
                  />
                  <div className="flex flex-col">
                    <h3 className="mb-1 text-lg font-semibold lg:mb-3">{item.title}</h3>
                    <p className="text-primary-foreground text-xs md:text-sm xl:text-base">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
};

export default ThemeUnesco;
