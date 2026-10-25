// Build-time validator for NEXT_PUBLIC_SITE_URL.
//
// Pure function — reads no globals, touches no filesystem. The build gate
// (`scripts/validate-build-env.mjs`) and the unit tests both import this
// module directly.
//
// Failure codes are stable strings so that tooling can react to them:
//   missing        — env var is undefined
//   empty          — env var is an empty or whitespace-only string
//   parse-error    — URL constructor rejected the input
//   not-absolute   — URL has a path, query, or fragment (must be bare origin)
//   bad-scheme     — not http(s) or not https in production mode
//   localhost      — host is localhost / 127.0.0.1 / [::1] / *.localhost
//   default-dev-port — port 3000, 3001, or 3002

export type ValidationCode =
  | "missing"
  | "empty"
  | "parse-error"
  | "not-absolute"
  | "bad-scheme"
  | "localhost"
  | "default-dev-port";

export interface ValidationResult {
  ok: boolean;
  code: ValidationCode | null;
  message: string;
}

const DEV_PORTS = new Set(["3000", "3001", "3002"]);

export function validateProductionSiteUrl(
  candidate: string | undefined
): ValidationResult {
  if (candidate === undefined) {
    return {
      ok: false,
      code: "missing",
      message:
        "NEXT_PUBLIC_SITE_URL is not set. A production build requires an explicit public origin (e.g. https://al-huda.app). Set it in the build environment before running `next build`.",
    };
  }
  if (candidate.trim() === "") {
    return {
      ok: false,
      code: "empty",
      message:
        "NEXT_PUBLIC_SITE_URL is set to an empty string. Provide a full absolute URL such as https://al-huda.app.",
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(candidate);
  } catch {
    return {
      ok: false,
      code: "parse-error",
      message: `NEXT_PUBLIC_SITE_URL is not a valid URL: "${candidate}". Expected an absolute URL like https://al-huda.app.`,
    };
  }

  if (parsed.pathname !== "/" || parsed.search !== "" || parsed.hash !== "") {
    return {
      ok: false,
      code: "not-absolute",
      message: `NEXT_PUBLIC_SITE_URL must be a bare origin (scheme + host + optional port), got "${candidate}". Paths, query strings, and fragments are not allowed.`,
    };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return {
      ok: false,
      code: "bad-scheme",
      message: `NEXT_PUBLIC_SITE_URL must use http or https, got "${parsed.protocol}".`,
    };
  }

  if (parsed.protocol !== "https:") {
    return {
      ok: false,
      code: "bad-scheme",
      message: `NEXT_PUBLIC_SITE_URL must use https for production builds, got "${parsed.protocol}//${parsed.host}". Use http only for non-production deployments.`,
    };
  }

  const host = parsed.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host === "[::1]" ||
    host.endsWith(".localhost")
  ) {
    return {
      ok: false,
      code: "localhost",
      message: `NEXT_PUBLIC_SITE_URL points at localhost ("${candidate}"). Production builds must use the public deployment origin.`,
    };
  }

  if (DEV_PORTS.has(parsed.port)) {
    return {
      ok: false,
      code: "default-dev-port",
      message: `NEXT_PUBLIC_SITE_URL uses a development port (:${parsed.port}). Production builds must use the public deployment origin (usually port 443, implicit in the URL).`,
    };
  }

  return {
    ok: true,
    code: null,
    message: `NEXT_PUBLIC_SITE_URL is valid for production: ${parsed.origin}`,
  };
}
