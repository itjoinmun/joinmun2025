import ComingSoon from "@/modules/coming-soon";
// import { isThemeReveal } from "@/modules/home/home-theme";
import ThemeHero from "@/modules/theme/theme-hero";
import ThemeInspired from "@/modules/theme/theme-inspired";
import ThemePhilosophy from "@/modules/theme/theme-philosophy";
import ThemeTeaser from "@/modules/theme/theme-teaser";
import ThemeUnesco from "@/modules/theme/theme-unesco";

export const isThemeReveal = process.env.NEXT_PUBLIC_THEME_REVEAL === "true";

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
        </>
      ) : (
        <ComingSoon />
      )}
    </>
  );
};

export default ThemePage;
