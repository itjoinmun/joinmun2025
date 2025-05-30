/**
 * Parses the 'set-cookie' header from a Headers object to extract access and refresh tokens.
 * @param headers - The Headers object containing the 'set-cookie' header.
 * @returns An object containing parsed access and refresh tokens with their details.
 */

const parseTokensFromHeaders = (headers: Headers): ParsedCookies => {
  // Get the 'set-cookie' header
  const setCookieHeader = headers.getSetCookie();
  if (!setCookieHeader || setCookieHeader.length === 0) {
    return {};
  }

  const parsedCookies: ParsedCookies = {};

  // Parse each cookie from the set-cookie header
  setCookieHeader.forEach((cookieString) => {
    const cookieParts = cookieString.split(";").map((part) => part.trim());
    const [nameValue] = cookieParts;
    const [name, value] = nameValue.split("=");

    if (!name || !value) return;

    // Only parse access and refresh tokens
    if (name === "access_token" || name === "refresh_token") {
      const cookieDetails: CookieDetails = { value };

      // Parse additional cookie attributes
      cookieParts.slice(1).forEach((attribute) => {
        const [key, val] = attribute.split("=");
        const lowerKey = key.toLowerCase();

        switch (lowerKey) {
          case "path":
            cookieDetails.path = val;
            break;
          case "domain":
            cookieDetails.domain = val;
            break;
          case "max-age":
            cookieDetails.maxAge = parseInt(val, 10);
            break;
          case "httponly":
            cookieDetails.httpOnly = true;
            break;
          case "secure":
            cookieDetails.secure = true;
            break;
          case "samesite":
            cookieDetails.sameSite = val;
            break;
        }
      });

      if (name === "access_token") {
        parsedCookies.accessToken = cookieDetails;
      } else if (name === "refresh_token") {
        parsedCookies.refreshToken = cookieDetails;
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
