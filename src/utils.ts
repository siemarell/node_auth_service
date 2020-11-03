export function loadVar(name: string): string;
export function loadVar<T extends boolean>(
  name: string,
  optional: T
): T extends false ? string : string | undefined;
export function loadVar(name: string, optional?: unknown): string | undefined {
  const result = process.env[name];
  if (result == null && !optional) {
    throw new Error(`${name} is required`);
  }
  return result;
}

export const availableProviders = ["slack", "emailPassword"];

export function parseEnabledProviders(): Set<"slack" | "emailPassword"> {
  const result = new Set<"slack" | "emailPassword">();
  const enabledProviders = loadVar("ENABLED_PROVIDERS").split(",");
  for (const provider of enabledProviders) {
    if (!availableProviders.includes(provider)) {
      throw new Error(`Unknown auth provider: ${provider}`);
    }
    result.add(provider as "slack" | "emailPassword");
  }
  if (enabledProviders.length === 0) {
    throw new Error(`Should have at least one enabled provider`);
  }
  return result;
}
