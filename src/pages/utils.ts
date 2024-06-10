export const clsx = (...classnames: (string | false | undefined)[]) =>
  classnames.filter(Boolean).join(" ");

interface PartyData {
  name: string;
  partyColor: string;
  partyGradient: string;
}

interface ColorVariants {
  [key: string]: string;
}

export const getPartyColorClass = (data: {
  [key: string]: PartyData;
}): ColorVariants => {
  return Object.entries(data).reduce((acc, [key, { partyColor }]) => {
    if (partyColor) {
      acc[key] = `text-${partyColor}`;
    }
    return acc;
  }, {} as ColorVariants);
};
