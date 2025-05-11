import ComingSoon from "@/modules/coming-soon";
import ThemeHero from "@/modules/theme/theme-hero";
import ThemeInspired from "@/modules/theme/theme-inspired";
import ThemePhilosophy from "@/modules/theme/theme-philosophy";
import ThemeTeaser from "@/modules/theme/theme-teaser";
import ThemeTrailer from "@/modules/theme/theme-trailer";
import ThemeUnesco from "@/modules/theme/theme-unesco";
import { isThemeReveal } from "@/utils/helpers/reveal";

const ThemePage = () => {
  return (
    <>
      {isThemeReveal ? (
        <>
          <ThemeHero />
          <ThemeInspired />
          <ThemePhilosophy />
          <ThemeUnesco />
          <ThemeTeaser />
          <ThemeTrailer />
        </>
      ) : (
        <ComingSoon />
      )}
    </>
  );
};

export default ThemePage;
