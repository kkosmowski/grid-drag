import type { FlatRectangle, Rectangle } from '~/types/item';
import { convertToAbsolutePosition } from '~/utils/convert-to-absolute-position';

type FlattenItemsOptions = {
  absolutize?: boolean;
  parent?: FlatRectangle;
  withContained?: boolean;
};

const defaultOptions: FlattenItemsOptions = {
  absolutize: false,
  parent: undefined,
  withContained: false,
};

export const flattenItems = <T = Rectangle | FlatRectangle>(items: Rectangle[], options?: FlattenItemsOptions) => {
  if (!items.length) return [];

  const { absolutize, parent, withContained } = options ?? defaultOptions;

  return items.reduce<T[]>((flat, item) => {
    const { contained, ...restOfItem } = item;
    const finalItem = !!(absolutize && parent) ? convertToAbsolutePosition(restOfItem, parent) : restOfItem;
    const nextOptions = options ? { ...options, parent: finalItem } : undefined;

    // @ts-expect-error ts does not support dynamic types
    flat.push(withContained ? { ...finalItem, contained: [] } : finalItem, ...flattenItems(contained, nextOptions));
    return flat;
  }, []);
};
