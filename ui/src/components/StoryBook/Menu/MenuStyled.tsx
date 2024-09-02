import styled from '@emotion/styled/macro';

export const MenuItemStyled = styled.button`
  padding: 8px;
  gap: 8px;
  background: none;
  border: none;
  color: ${(props) => props.color};

  &:hover {
    cursor: pointer;
    color: #040e6a;
  }
`;
