import React from 'react';
// import { Label } from "../../DataDisplay/Typography/Label";
import {
  Container,
  SpacingStepLabel,
  Step,
  ContainerStep,
  Line,
  Column,
  LinePosition
} from './StepperStyled';

import { StepperProps } from './StepperTypes';
import { Dict } from 'styled-components/dist/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Label } from '../../Typography/Label';

const Stepper: React.FC<StepperProps> = ({
  steps,
  value,
  setValue,
  direction = 'row'
}) => {
  const handleStepClick = (e: number, option: Dict) => {
    if (!option.disabled) {
      setValue && setValue(e);
    }
  };

  return (
    <Container direction={direction}>
      {steps.map((option: any, index: number) => (
        <>
          <ContainerStep direction={direction}>
            <Column>
              <Label label={option.label} />
              <SpacingStepLabel />
              <Step
                onClick={() => {
                  handleStepClick(index + 1, option);
                }}
                active={index + 1 === value}
                disabled={option.disabled}
              >
                {option.done ? (
                  <FontAwesomeIcon icon="check" size="sm" />
                ) : (
                  <>{index + 1}</>
                )}
              </Step>
            </Column>
            {index < steps.length - 1 && (
              <LinePosition direction={direction}>
                <Line direction={direction} />
              </LinePosition>
            )}
          </ContainerStep>
        </>
      ))}
    </Container>
  );
};

export default Stepper;
