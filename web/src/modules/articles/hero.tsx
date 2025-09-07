import BatikPattern from "@/components/Element/batik-pattern";
import NavbarResolver from "@/components/Layout/navbar-resolver";
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";

const ArticlesHero = () => (
  <div className="relative bg-gradient-to-b overflow-clip from-transparent to-background">
    <NavbarResolver />

    <Container className="text-center gap-2 items-center">
      <h1 className="">Articles</h1>

      <h2 className="text-xl text-gradient-gold">
        Progressive <strong>Writing</strong> by Joinmun <strong>Delegates</strong>
      </h2>

      <Input placeholder="Find Articles" className="max-w-xs w-full mt-4" />
    </Container>

    <BatikPattern className="" />
  </div>
);

export default ArticlesHero;
