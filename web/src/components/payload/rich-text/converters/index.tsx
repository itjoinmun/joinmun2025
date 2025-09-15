import { DefaultNodeTypes } from "@payloadcms/richtext-lexical";
import { JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import { headingConverter } from "./heading";

type NodeTypes = DefaultNodeTypes;

export const jsxConverter: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...headingConverter,
});
