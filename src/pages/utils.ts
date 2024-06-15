export const clsx = (...classnames: (string | false | undefined)[]) =>
  classnames.filter(Boolean).join(" ");
