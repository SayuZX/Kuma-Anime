const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 99 };

function resolveLevel() {
  const fromEnv =
    (typeof process !== "undefined" &&
      process.env &&
      process.env.NEXT_PUBLIC_LOG_LEVEL) ||
    "";
  if (fromEnv && LEVELS[fromEnv] != null) return LEVELS[fromEnv];
  const isProd =
    typeof process !== "undefined" &&
    process.env &&
    process.env.NODE_ENV === "production";
  return isProd ? LEVELS.warn : LEVELS.debug;
}

const activeLevel = resolveLevel();
const isServer = typeof window === "undefined";
const scope = isServer ? "server" : "client";

function emit(level, args) {
  if (LEVELS[level] < activeLevel) return;
  const prefix = `[${scope}:${level}]`;
  const fn = console[level] || console.log;
  fn(prefix, ...args);
}

export const logger = {
  debug: (...a) => emit("debug", a),
  info: (...a) => emit("info", a),
  warn: (...a) => emit("warn", a),
  error: (...a) => emit("error", a),
};

export function reportError(error, context = {}) {
  const payload = {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  };
  emit("error", [context.where || "reportError", payload.message, context]);

  if (typeof window !== "undefined" && typeof window.__reportError === "function") {
    try {
      window.__reportError(error, context);
    } catch {

    }
  }
  return payload;
}

export default logger;
