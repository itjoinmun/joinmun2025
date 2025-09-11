import Container from "@/components/ui/container";
import config from "@payload-config";
import { getPayload } from "payload";
import ArticleFiltersClient from "./article-filters.client";

const ArticleFilters = async () => {
  const payload = await getPayload({ config });
  const { docs: publishers } = await payload.find({
    collection: "media-publishers",
  });

  return (
    <>
      <Container className="flex-row gap-2">
        <ArticleFiltersClient publishers={publishers} />
      </Container>
    </>
  );
};

export default ArticleFilters;
