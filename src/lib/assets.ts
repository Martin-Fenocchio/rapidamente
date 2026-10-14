export const assetUrl = (name: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/images/${name}`;
