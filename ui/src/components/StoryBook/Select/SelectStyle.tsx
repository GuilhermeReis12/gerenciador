import styled from '@emotion/styled/macro';
import { SelectStylePropsKey } from './SelectTypes';

export const SelectWrapper = styled('div')<SelectStylePropsKey>`
  display: flex;
  /* width: 100%; */
  /* height: 56px; */
  padding: 1rem 0.88rem;
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;

  background: ${(props) => (props.disabled ? '#D4EBD1' : '#fff')};

  border: 2px solid
    ${(props) =>
      props.disabled
        ? '#D4EBD1'
        : props.value
          ? props.theme.color?.indicatorColor.ef1
          : '#C0C0C0'};

  &:focus-within {
    border: 2px solid ${(props) => '#262626'};
    background: ${(props) => '#fff'};
    outline: 'none';
    color: ${(props) => '#000'};
  }

  &:disabled {
    border: none;
    background: ${(props) => '#D4EBD1'};
    color: ${(props) => '#C6EBD1'};
  }

  &:hover {
    cursor: pointer;
  }
`;

export const SelectInput = styled('input')<SelectStylePropsKey>`
  display: flex;
  width: 100%;
  min-width: 150px;
  border: none;
  background: transparent;
  overflow: hidden;
  caret-color: transparent;

  align-items: center;
  align-self: stretch;

  text-overflow: ellipsis;
  padding: 0px 0.25rem;

  color: ${(props) => '#000'};
  text-overflow: ellipsis;

  &:focus {
    border: none;
    outline: none;

    color: ${(props) => '#000'};
  }
  &:disabled {
    border: none;
    background: ${(props) => '#D4EBD1'};
    color: ${(props) => '#C6EBD1'};
  }

  &:hover {
    cursor: pointer;
  }
`;

export const ArrowIcon = styled('div')<SelectStylePropsKey>`
  max-height: 30px;
  max-width: 30px;
  display: flex;
  align-items: center;
`;

export const SelectListDivContainer = styled('div')<SelectStylePropsKey>`
  position: relative;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  /* width: 100%; */
  padding: 12px 16px 12px 16px;
  border-radius: 4px;
  opacity: 0px;
  background-color: white;
  overflow: auto;
  z-index: 7;
  box-shadow: 0px 16px 48px 0px #00000014;
  gap: 8px;
  max-height: 300px;

  &:hover {
    cursor: pointer;
  }
`;

export const SelectList = styled('ul')<SelectStylePropsKey>`
  width: 100%;
  padding: 12px 16px 12px 16px;
  border-radius: 4px;
  opacity: 0px;
  background-color: white;
  list-style: none;
  margin-top: 0;
  overflow: auto;
  z-index: 7;
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  box-shadow: 0px 16px 48px 0px #00000014;
  gap: 8px;

  @media (max-width: 425px) {
    position: fixed;
    bottom: -5%;
    right: 0%;
    width: 100%;
    height: fixed (300px);
    border-radius: 40px 40px 0px 0px;
    overflow: auto;
    padding-top: 40px;
    box-shadow: 0px 16px 48px 0px #00000014;
    gap: 10px;
  }
`;

export const SelectListItem = styled('div')<SelectStylePropsKey>`
  margin: 4px 0px;
  border-radius: 5px;
  width: 95%;
  text-align: start;

  @media (max-width: 425px) {
    text-align: center;
    width: 95%;
  }

  &:hover {
    cursor: pointer;
    background-color: #1e984f;
  }
`;
