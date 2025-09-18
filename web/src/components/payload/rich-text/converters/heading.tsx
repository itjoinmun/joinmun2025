import { JSXConverters } from "@payloadcms/richtext-lexical/react";
import { SerializedHeadingNode } from "@payloadcms/richtext-lexical";

export const headingConverter: JSXConverters<SerializedHeadingNode> = {
  heading: ({ node, nodesToJSX }) => {
    const text = nodesToJSX({ nodes: node.children });
    const Tag = node.tag 

    const sizeClass = {
      h1: "text-3xl",
      h2: "text-3xl",
      h3: "text-2xl",
      h4: "text-xl",
      h5: "text-lg",
      h6: "text-base",
    }

    return <Tag className={`font-bold ${sizeClass[node.tag]}`}>{text}</Tag>;
  },
};
