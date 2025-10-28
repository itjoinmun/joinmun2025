"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { Input } from "@/components/ui/input";

type ArticleSearchContextType = {
  query: string;
  setQuery: (val: string) => void;
};

const ArticleSearchContext = createContext<ArticleSearchContextType | undefined>(undefined);

export const ArticleSearchProvider = ({ children }: { children: ReactNode }) => {
  const [query, setQuery] = useState("");

  return (
    <ArticleSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </ArticleSearchContext.Provider>
  );
};

export const useArticleSearch = () => {
  const ctx = useContext(ArticleSearchContext);
  if (!ctx) {
    throw new Error("useArticleSearch must be used inside an ArticleSearchProvider");
  }
  return ctx;
};

export const ArticleSearchBar = () => {
  const { query, setQuery } = useArticleSearch();

  return (
    <Input
      placeholder="Find Articles"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className="mt-4 w-full md:max-w-xs"
    />
  );
};
