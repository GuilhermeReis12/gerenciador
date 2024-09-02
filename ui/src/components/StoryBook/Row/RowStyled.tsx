import styled from '@emotion/styled/macro';

interface RowProps {
  justifyContent?: string;
  alignItems?: string;
  lg?: string;
  xs?: string;
  md?: string;
  gap?: string;
  direction?: string;
}

export const Content = styled.div<RowProps>`
  display: flex;
  flex-wrap: wrap;
  align-items: ${(props) => props.alignItems};
  gap: ${(props) => props.gap};
  flex-direction: ${(props) => props.direction};
  width: ${(props) => (props.lg ? props.lg : props.xs ? props.xs : 'auto')};
  flex-wrap: wrap;
  justify-content: ${(props) => props.justifyContent};
  box-sizing: border-box;

  @media screen and (max-width: 768px) {
    width: ${(props) => (props.md ? props.md : props.xs ? props.xs : 'auto')};
  }

  @media (max-width: 600px) {
    width: ${(props) => (props.xs ? props.xs : props.xs ? props.xs : 'auto')};
  }
`;
