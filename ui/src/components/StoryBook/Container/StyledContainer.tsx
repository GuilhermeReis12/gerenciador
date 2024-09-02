import styled from '@emotion/styled/macro';

export const StyledPage = styled.div`
  width: 100vw;
  margin-bottom: 50px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;
`;

export const StyledContainer = styled.div`
  max-width: 1216px;
  width: 100%;
  min-height: 100vh;

  @media (max-width: 1216px) {
    max-width: calc(100vw - 16px);
  }
`;
