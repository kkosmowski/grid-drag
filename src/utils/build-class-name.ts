export const buildClassName = (...args: (string | undefined)[]): string => {
  // eslint-disable-next-line
  // @ts-ignore
  return args.filter(Boolean).join(' ');
};
