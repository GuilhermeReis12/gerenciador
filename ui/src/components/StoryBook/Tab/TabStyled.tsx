import styled from '@emotion/styled/macro';

interface TabProps {
  disabled?: boolean;
  active?: boolean;
}

export const Container = styled.div<TabProps>`
  display: flex;
  width: 100%;
  cursor: pointer;
  overflow: auto;
  white-space: nowrap;
  margin: 0;
  box-sizing: border-box;
  padding: 0;
  ${(props) => props.disabled && 'pointer-events: none;'}
`;
export const Tabs = styled.div<TabProps>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  justify-content: center;
  border-bottom: ${(props) =>
    props.active ? '4px solid green' : '1px solid #D4EBD1'};
  font-family: Inter;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? 700 : 500)};
  color: ${(props) => (props.active ? '#0F6D47' : '#646464')};
  display: inline-flex;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;
