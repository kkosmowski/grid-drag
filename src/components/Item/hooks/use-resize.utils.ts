import { CornerCursor, Cursor, EdgeCursor, Rectangle, ResizeData } from '~/types/item';
import { MIN_SIZE } from '~/consts';

type CreateResizeMapArgs = {
  item: Rectangle;
  clientX: number;
  clientY: number;
  isSquare: boolean;
};

type ResizeMap = Record<Cursor, ResizeData>;

type HorizontalResizeData = Pick<ResizeData, 'x' | 'width'>;
type VerticalResizeData = Pick<ResizeData, 'y' | 'height'>;

const ltSquared = (data: ResizeData, isSquare: boolean): ResizeData => {
  if (!isSquare) return data;

  const min = Math.min(data.width, data.height);
  const maxXY = Math.max(data.x, data.y);

  return { x: maxXY, y: maxXY, width: min, height: min };
};

const rtSquared = (data: ResizeData, isSquare: boolean): ResizeData => {
  if (!isSquare) return data;

  const min = Math.min(data.width, data.height);
  const diff = Math.abs(data.width - data.height);
  const y = data.height > data.width ? data.y + diff : data.y;

  return { ...data, width: min, height: min, y };
};

const lbSquared = (data: ResizeData, isSquare: boolean): ResizeData => {
  if (!isSquare) return data;

  const min = Math.min(data.width, data.height);
  const diff = Math.abs(data.width - data.height);
  const x = data.width > data.height ? data.x + diff : data.x;

  return { ...data, width: min, height: min, x };
};

const rbSquared = (data: ResizeData, isSquare: boolean): ResizeData => {
  if (!isSquare) return data;

  const min = Math.min(data.width, data.height);
  return { ...data, width: min, height: min };
};

export const createResizeMap = ({ item, clientX, clientY, isSquare }: CreateResizeMapArgs): ResizeMap => {
  const leftX = Math.min(clientX - item.x, item.width - MIN_SIZE);
  const rightX = 0;

  const topY = Math.min(clientY - item.y, item.height - MIN_SIZE);
  const bottomY = 0;

  const leftWidth = Math.max(item.width - clientX + item.x, MIN_SIZE);
  const rightWidth = Math.max(clientX - item.x, MIN_SIZE);

  const topHeight = Math.max(item.height - clientY + item.y, MIN_SIZE);
  const bottomHeight = Math.max(clientY - item.y, MIN_SIZE);

  const defaultHorizontal: HorizontalResizeData = { x: 0, width: item.width };
  const defaultVertical: VerticalResizeData = { y: 0, height: item.height };

  const left: HorizontalResizeData = { x: leftX, width: leftWidth };
  const right: HorizontalResizeData = { x: rightX, width: rightWidth };
  const top: VerticalResizeData = { y: topY, height: topHeight };
  const bottom: VerticalResizeData = { y: bottomY, height: bottomHeight };

  return {
    [CornerCursor.LeftTop]: ltSquared({ ...left, ...top }, isSquare),
    [CornerCursor.LeftBottom]: lbSquared({ ...left, ...bottom }, isSquare),
    [CornerCursor.RightTop]: rtSquared({ ...right, ...top }, isSquare),
    [CornerCursor.RightBottom]: rbSquared({ ...right, ...bottom }, isSquare),
    [EdgeCursor.Left]: { ...left, ...defaultVertical },
    [EdgeCursor.Right]: { ...right, ...defaultVertical },
    [EdgeCursor.Top]: { ...defaultHorizontal, ...top },
    [EdgeCursor.Bottom]: { ...defaultHorizontal, ...bottom },
  };
};
