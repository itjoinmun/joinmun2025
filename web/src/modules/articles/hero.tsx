import BatikPattern from "@/components/Element/batik-pattern";
import NavbarResolver from "@/components/Layout/navbar-resolver";
import Container from "@/components/ui/container";
import { Input } from "@/components/ui/input";

const ArticlesHero = () => (
  <div className="to-background relative overflow-clip bg-gradient-to-b from-transparent">
    <NavbarResolver />

    <Container className="items-center gap-2 text-center">
      <h1 className="">Articles</h1>

      <h2 className="text-gradient-gold text-2xl">
        Progressive <strong>Writing</strong> by Joinmun <strong>Delegates</strong>
      </h2>

      <Input placeholder="Find Articles" className="w-full max-w-xs mt-4" />
    </Container>

    <BatikPattern className="" />
  </div>
);

export default ArticlesHero;
