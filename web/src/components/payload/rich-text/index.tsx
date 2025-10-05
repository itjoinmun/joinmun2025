import { RichText as RichTextConverter } from "@payloadcms/richtext-lexical/react";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { jsxConverter } from "./converters";
import "@/styles/rich.css"

type Props = {
  data: SerializedEditorState;
} & React.HTMLAttributes<HTMLDivElement>;

export function RichText(props: Props) {
  const { className, ...rest } = props;

  return (

    <RichTextConverter className={'rich'} {...rest} converters={jsxConverter} />
  )

>>>>>>> 415dd0f (fix: move to css file for rich text styling)
}
