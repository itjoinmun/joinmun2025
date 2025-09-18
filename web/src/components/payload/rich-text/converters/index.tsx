import { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { headingConverter } from "./heading";
import { listConverter } from "./list";

type NodeTypes = DefaultNodeTypes;

export const jsxConverter: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...headingConverter,
  ...listConverter,
});
