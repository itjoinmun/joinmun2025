import Container from "@/components/ui/container";

const ArticlesGridPostsSuspense = async () => {
  return (
    <Container className="grid grid-cols-1 py-2 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-50 animate-pulse rounded-sm border bg-neutral-800" />
      ))}
    </Container>
  );
};

export default ArticlesGridPostsSuspense;
