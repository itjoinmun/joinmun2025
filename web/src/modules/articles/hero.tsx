import BatikPattern from "@/components/Element/batik-pattern";
import NavbarResolver from "@/components/Layout/navbar-resolver";
import Container from "@/components/ui/container";
import { ArticleSearchBar } from "./article-search-bar";

const ArticlesHero = () => (
  <div className="to-background relative overflow-clip bg-gradient-to-b from-transparent">
    <NavbarResolver />

    <Container className="items-center gap-2 text-center">
      <h1 className="">Articles</h1>

      <h2 className="text-gradient-gold text-2xl">
        Progressive <strong>Writing</strong> by Joinmun <strong>Delegates</strong>
      </h2>

      <ArticleSearchBar />
    </Container>

    <BatikPattern className="" />
  </div>
);

export default ArticlesHero;
