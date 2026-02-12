const normalizeCookieDomain = (rawDomain) => {
  if (!rawDomain) return undefined;

  const cleaned = rawDomain
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./i, "")
    .replace(/:\d+$/, "");

  if (!cleaned || cleaned.includes("localhost") || cleaned.includes("127.0.0.1")) {
    return undefined;
  }

  return cleaned.startsWith(".") ? cleaned : `.${cleaned}`;
};

export const getSharedCookieDomain = () =>
  normalizeCookieDomain(
    process.env.COOKIE_DOMAIN || process.env.APP_COOKIE_DOMAIN || process.env.APP_URL || process.env.CLIENT_URL
  );

export const getTokenCookieOptions = (maxAgeMs = 24 * 60 * 60 * 1000) => {
  const isProd = process.env.NODE_ENV === "production";
  const configuredSameSite = (process.env.COOKIE_SAME_SITE || "").toLowerCase();
  const sameSite =
    configuredSameSite === "none" || configuredSameSite === "strict" || configuredSameSite === "lax"
      ? configuredSameSite
      : isProd
      ? "lax"
      : "lax";
  const options = {
    httpOnly: true,
    secure: isProd,
    sameSite,
    path: "/",
    maxAge: maxAgeMs,
  };

  if (options.sameSite === "none") {
    options.secure = true;
  }

  const domain = getSharedCookieDomain();
  if (domain) {
    options.domain = domain;
  }

  return options;
};

export const getTokenCookieClearOptions = () => ({
  ...getTokenCookieOptions(0),
  expires: new Date(0),
});
