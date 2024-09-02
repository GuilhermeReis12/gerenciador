import styled from '@emotion/styled/macro';
import { SelectStylePropsKey } from './SelectTypes';

export const SearchInput = styled('input')<SelectStylePropsKey>`
  border: none;
  border-bottom: solid 1px black;
  margin-bottom: 10px;
  width: 95%;
  outline: none;
  display: ${(props) => (props.isVisible ? 'block' : 'none')};
`;
