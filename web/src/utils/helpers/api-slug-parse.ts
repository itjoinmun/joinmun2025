import { DelegateOptions } from "./delegates";

const parseSlug = (slug: DelegateOptions) => {
  let parseSlug;
  switch (slug as string) {
    case "single":
      parseSlug = "single_delegate";
      break;
    case "observer":
      parseSlug = "observer";
      break;
    case "advisor":
      parseSlug = "faculty_advisor";
      break;
    case "team":
      parseSlug = "team_delegate";
      break;
    default:
      parseSlug = "no_slug";
  }

  return parseSlug;
};

export type apiSlugs =
  | "single_delegate"
  | "observer"
  | "faculty_advisor"
  | "team_delegate"
  | "no_slug";

export default parseSlug;
