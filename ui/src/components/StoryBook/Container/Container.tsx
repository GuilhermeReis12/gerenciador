import React from 'react';
import { StyledContainer, StyledPage } from './StyledContainer';

export type ContainerProps = {
  children: React.ReactNode;
  backgroundColor?: string;
} & React.HTMLAttributes<HTMLDivElement>;

/**
 * Um "container flexível" é configurado como um container para organizar e controlar a disposição de seus elementos filhos usando o modelo de layout flexbox.
 */

const Container = ({ children, backgroundColor }: ContainerProps) => {
  return (
    <StyledPage>
      <StyledContainer style={{ backgroundColor: backgroundColor }}>
        {children}
      </StyledContainer>
    </StyledPage>
  );
};

export default Container;
