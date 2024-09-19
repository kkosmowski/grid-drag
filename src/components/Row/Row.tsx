import React from 'react';

import type { RowProps } from './Row.types';
import styles from './Row.module.css';

import { buildClassName } from '~/utils/build-class-name.ts';
import { getClassNames } from '~/utils/get-class-names.ts';
import { isDefined } from '~/utils/is-defined';
import { isNumber } from '~/utils/is-number';

export const Row = (props: RowProps) => {
  const {
    component: C = 'div',
    inline = false,
    reverse = false,
    justifyContent = 'flex-start',
    alignItems = 'stretch',
    gap,
    style,
    children,
  } = props;

  const classNames = getClassNames('stack', [
    inline ? 'inline' : '',
    reverse ? 'reverse' : '',
    `jc-${justifyContent}`,
    `ai-${alignItems}`,
  ]);
  const clN = buildClassName(styles.stack, ...classNames);

  const mergedStyle = {
    ...(isDefined(gap) ? { gap: isNumber(gap) ? `${gap}px` : gap } : {}),
    ...style,
  };

  return (
    <C className={clN} style={mergedStyle}>
      {children}
    </C>
  );
};
