import type { Rectangle } from '~/types/item';
import { isDefined } from '~/utils/is-defined';

export const getItem = (items: Rectangle[], itemId: Rectangle['id'] | null): Rectangle | undefined =>
  isDefined(itemId) ? items.find((item) => item.id === itemId) : undefined;
