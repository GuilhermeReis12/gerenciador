import React from 'react';
import { Content } from './RowStyled';

export type RowProps = {
  children: React.ReactNode;
  lg?: string;
  xs?: string;
  md?: string;
  justifyContent?:
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'initial'
    | 'inherit';
  alignItems?:
    | 'stretch'
    | 'center'
    | 'flex-start'
    | 'flex-end'
    | 'baseline'
    | 'initial'
    | 'inherit';
  direction?: 'column' | 'row';
  gap?: string;
  style?: any;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Um "row flexbox" é um tipo de layout flexível utilizado para organizar elementos dentro de um contêiner flexível, alinhando-os em uma linha horizontal.
 */

const Row = ({
  children,
  justifyContent = 'flex-start',
  alignItems = 'flex-start',
  lg,
  xs,
  md,
  direction,
  gap,
  style
}: RowProps) => {
  return (
    <Content
      gap={gap}
      direction={direction}
      xs={xs}
      md={md}
      lg={lg}
      alignItems={alignItems}
      justifyContent={justifyContent}
      style={style}
    >
      {children}
    </Content>
  );
};

export default Row;
