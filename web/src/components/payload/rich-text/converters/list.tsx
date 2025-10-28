import type { SerializedListNode } from "@payloadcms/richtext-lexical";
import type { JSXConverters } from "@payloadcms/richtext-lexical/react";

export const listConverter: JSXConverters<SerializedListNode> = {
  list: ({ node, nodesToJSX }) => {
    const Tag = node.tag;
    const listStyle = getListStyle(node.tag);
    const children = nodesToJSX({ nodes: node.children });
    return <Tag className={listStyle}>{children}</Tag>;
  },
  listItem: ({ node, nodesToJSX }) => {
    const text = nodesToJSX({ nodes: node.children });
    return <li className="list-item">{text}</li>;
  },
};

const getListStyle = (tag: string): string => {
  const classes = {
    ul: "list-disc pl-5",
    ol: "list-decimal pl-5",
  };
  return classes[tag as keyof typeof classes] || classes.ul;
};
