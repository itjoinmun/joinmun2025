import ThemeHero from "@/modules/theme/theme-hero";
import ThemePhilosophy from "@/modules/theme/theme-philosophy";
import ThemeTeaser from "@/modules/theme/theme-teaser";
import ThemeUnesco from "@/modules/theme/theme-unesco";

const ThemePage = () => {
  return (
    <>
      <ThemeHero />
      <ThemePhilosophy />
      <ThemeUnesco />
      <ThemeTeaser />
    </>
  );
};

export default ThemePage;
