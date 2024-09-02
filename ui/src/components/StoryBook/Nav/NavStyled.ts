import styled from '@emotion/styled/macro';

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 32px 0;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

export const MenuContainer = styled.div`
  @media (max-width: 600px) {
    display: none;
  }
`;

export const InputContainer = styled.div`
  max-width: 384px;
  width: 100%;
`;

export const BreadcrumbContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;

  @media (max-width: 600px) {
    display: none;
  }
`;
