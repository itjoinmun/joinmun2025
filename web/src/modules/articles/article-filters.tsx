import Container from "@/components/ui/container";
import config from "@payload-config";
import { getPayload } from "payload";
import ArticleFiltersClient from "./article-filters.client";

const ArticleFilters = async () => {
  const payload = await getPayload({ config });
  const { docs: publishers } = await payload.find({
    collection: "media-publishers",
    limit: 100,
  });

  return (
    <>
      <Container className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-auto">
        <ArticleFiltersClient publishers={publishers} />
      </Container>
    </>
  );
};

export default ArticleFilters;
