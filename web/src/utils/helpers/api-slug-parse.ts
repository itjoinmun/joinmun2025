import { DelegateOptions } from "./delegates";

const parseSlug = (slug: DelegateOptions) => {
  let parseSlug;
  switch (slug as string) {
    case "delegate":
      parseSlug = "delegate";
      break;
    case "observer":
      parseSlug = "observer";
      break;
    case "advisor":
      parseSlug = "faculty_advisor";
      break;
    default:
      parseSlug = "delegate";
  }

  return parseSlug;
}

export default parseSlug;