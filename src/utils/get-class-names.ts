export const getClassNames = (prefix: string, strings: string[]): string[] =>
  strings.filter(Boolean).map((string) => `${prefix}--${string}`);
