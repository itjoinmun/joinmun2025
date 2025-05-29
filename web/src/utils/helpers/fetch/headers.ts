/**
 * Parses the 'set-cookie' header from a Headers object to extract access and refresh tokens.
 * @param headers - The Headers object containing the 'set-cookie' header.
 * @returns An object containing parsed access and refresh tokens with their details.
 */

const parseTokensFromHeaders = (headers: Headers): ParsedCookies => {
  // Get the 'set-cookie' header
  const setCookieHeader = headers.get("set-cookie");
  if (!setCookieHeader) {
    return {};
  }

  const parsedCookies: ParsedCookies = {};
  const cookieStrings = setCookieHeader.split(", ");

  cookieStrings.forEach((cookieString) => {
    const parts = cookieString.split(";").map((part) => part.trim());
    const [nameValuePair, ...attributes] = parts;
    const [cookieName, cookieValue] = nameValuePair.split("=").map((part) => part.trim());

    if (cookieName === "access_token" || cookieName === "refresh_token") {
      const details: CookieDetails = { value: cookieValue };
      attributes.forEach((attr) => {
        const [attrName, attrValue] = attr.split("=").map((part) => part.trim());
        switch (attrName.toLowerCase()) {
          case "path":
            details.path = attrValue;
            break;
          case "domain":
            details.domain = attrValue;
            break;
          case "max-age":
            details.maxAge = parseInt(attrValue, 10);
            break;
          case "httponly":
            details.httpOnly = true;
            break;
          case "secure":
            details.secure = true;
            break;
          case "samesite":
            details.sameSite = attrValue;
            break;
        }
      });

      if (cookieName === "access_token") {
        parsedCookies.accessToken = details;
      } else if (cookieName === "refresh_token") {
        parsedCookies.refreshToken = details;
      }
    }
  });

  return parsedCookies;
};

interface CookieDetails {
  value: string;
  path?: string;
  domain?: string;
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: string;
}

interface ParsedCookies {
  accessToken?: CookieDetails;
  refreshToken?: CookieDetails;
}

export type { CookieDetails, ParsedCookies };
export { parseTokensFromHeaders };
