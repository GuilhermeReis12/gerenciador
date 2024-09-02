import styled from '@emotion/styled/macro';
import { SelectStylePropsKey } from './SelectTypes';

export const SelectListItem = styled('div')<SelectStylePropsKey>`
  padding: 8px;
  border-radius: 8px;
  width: 100%;
  text-align: start;

  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  color: #262626;

  &:hover {
    cursor: pointer;
    background-color: ${(props) => '#F6F6F6'};
  }

  @media (max-width: 425px) {
    width: 100%;
    &:hover {
      background-color: white;
    }
  }
`;
