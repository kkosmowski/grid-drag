import type { FlatRectangle, Rectangle } from '~/types/item';
import { convertToAbsolutePosition } from '~/utils/convert-to-absolute-position';

type FlattenItemsOptions = {
  absolutize?: boolean;
  parent?: FlatRectangle;
  withChildren?: boolean;
};

const defaultOptions: FlattenItemsOptions = {
  absolutize: false,
  parent: undefined,
  withChildren: false,
};

export const flattenItems = <T = Rectangle | FlatRectangle>(items: Rectangle[], options?: FlattenItemsOptions) => {
  const { absolutize, parent, withChildren } = options ?? defaultOptions;

  return items.reduce<T[]>((flat, item) => {
    const { children, ...restOfItem } = item;
    const finalItem = !!(absolutize && parent) ? convertToAbsolutePosition(restOfItem, parent) : restOfItem;
    const nextOptions = options ? { ...options, parent: finalItem } : undefined;

    // @ts-expect-error ts does not support dynamic types
    flat.push(withChildren ? { ...finalItem, children: [] } : finalItem, ...flattenItems(children, nextOptions));
    return flat;
  }, []);
};
