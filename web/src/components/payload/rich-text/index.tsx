import { RichText as RichTextConverter } from "@payloadcms/richtext-lexical/react";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { jsxConverter } from "./converters";
import "@/styles/rich.css";
import { cn } from "@/utils/helpers/cn";

type Props = {
  data: SerializedEditorState;
} & React.HTMLAttributes<HTMLDivElement>;

export function RichText(props: Props) {
  const { className, ...rest } = props;
  return <RichTextConverter className={`rich ${className}`} {...rest} converters={jsxConverter} />;
}
