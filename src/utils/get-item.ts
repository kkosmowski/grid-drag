import type { Rectangle } from '~/types/item';
import { isDefined } from '~/utils/is-defined';

export const getItem = (items: Rectangle[], itemId: Rectangle['id'] | null): Rectangle | undefined => {
  if (!isDefined(itemId)) return undefined;

  const possibleItem = items.find((item) => item.id === itemId);

  if (possibleItem) return possibleItem;

  return items.flatMap(({ children }) => children).find((item) => item.id === itemId) ?? undefined;
};
