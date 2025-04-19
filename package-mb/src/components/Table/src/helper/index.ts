export const setIndex = (
  reserveIndex: boolean,
  index: number,
  size: number,
  current: number,
) => {
  const newIndex = index + 1;
  return reserveIndex ? size * (current - 1) + newIndex : newIndex;
};
