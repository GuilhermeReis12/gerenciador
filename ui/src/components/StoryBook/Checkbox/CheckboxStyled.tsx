import styled from '@emotion/styled/macro';
import { IconName } from '@fortawesome/fontawesome-common-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck } from '@fortawesome/pro-light-svg-icons';

interface IconCheckProps {
  isChecked: boolean;
  color: string;
  iconSolid?: IconName;
  iconRegular?: IconName;
}

interface Checkbox {
  fontSize?: string;
}

export const ContainerCheckBox = styled.div<Checkbox>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: ${(props) => (props.fontSize ? props.fontSize : 'medium')};
`;

export const CheckBox = styled.input`
  display: none;
`;

export const IconCheck = styled(({ isChecked, ...props }: IconCheckProps) => (
  <FontAwesomeIcon
    icon={isChecked ? faSquareCheck : faSquareCheck}
    color={isChecked ? props.color : '#C0C0C0'}
  />
))`
  width: 24px;
  height: 24px;
  background-color: ${({ isChecked }) => (isChecked ? 'white' : 'transparent')};
  cursor: pointer;
`;

export const IconCheckCustom = styled(
  ({
    isChecked,
    iconSolid = 'check-square',
    iconRegular = 'square',
    ...props
  }: IconCheckProps) => (
    <FontAwesomeIcon
      icon={isChecked ? faSquareCheck : faSquareCheck}
      color={isChecked ? props.color : '#C0C0C0'}
    />
  )
)`
  width: 24px;
  height: 24px;
  background-color: ${({ isChecked }) => (isChecked ? 'white' : 'transparent')};
  cursor: pointer;
`;
