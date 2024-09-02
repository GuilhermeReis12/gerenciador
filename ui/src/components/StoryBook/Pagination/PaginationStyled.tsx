import styled from '@emotion/styled/macro';

type PaginationProps = {
  clicked?: boolean;
};

export const Container = styled.div<PaginationProps>`
  max-width: 384px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const ContainerButton = styled.div<PaginationProps>`
  max-width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
