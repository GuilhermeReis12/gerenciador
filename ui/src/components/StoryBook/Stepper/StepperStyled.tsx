import styled from 'styled-components';
type StepperProps = {
  direction?: string;
  active?: boolean;
  disabled?: boolean;
};

export const Container = styled.div<StepperProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  flex-wrap: wrap;
  flex-direction: ${(props) => props.direction};
  width: 100%;
  /* gap: 10px; */
`;

export const Step = styled.div<StepperProps>`
  height: ${(props) => (props.active ? '40px' : '36px')};
  width: ${(props) => (props.active ? '40px' : '36px')};
  background-color: ${(props) =>
    props.active ? '#1E984F' : props.disabled ? '#D4EBD1' : '#fff'};
  border: ${(props) =>
    !props.active && !props.disabled ? `1px solid ${'#1E984F'}` : 'none'};
  color: ${(props) =>
    props.active ? 'white' : props.disabled ? '#C6EBD1' : '#1E984F'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};

  @media (max-width: 600px) {
    height: ${(props) => (props.active ? '30px' : '25px')};
    width: ${(props) => (props.active ? '30px' : '25px')};
  }
`;
export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) => '#646464'};
`;

export const SpacingStepLabel = styled.div`
  margin-top: 0.5rem;
`;

export const ContainerStep = styled.div<StepperProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  flex-direction: ${(props) => props.direction};
`;

export const Line = styled.div<StepperProps>`
  background-color: ${(props) => '#646464'};
  width: ${(props) => (props.direction === 'column' ? '1px' : '30px')};
  height: ${(props) => (props.direction === 'column' ? '30px' : '1px')};
`;

export const LinePosition = styled.div<StepperProps>`
  display: flex;
  padding: ${(props) =>
    props.direction === 'row' ? '10px 10px 0px 10px' : '10px 0px'};
`;
