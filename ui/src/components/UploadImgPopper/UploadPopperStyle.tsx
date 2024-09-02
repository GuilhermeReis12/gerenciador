import styled from '@emotion/styled/macro';
import { UploadImgPopperStyleProps } from '../../types/UpoloadPopperTypes/UploadPopperTypes';

export const UploadPopper = styled('div')<UploadImgPopperStyleProps>`
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  background-color: #fff;
  height: 70px;
  width: 320px;
  border-radius: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 186px;
  transform: translateX(1400px);
  z-index: 100;
  box-shadow: 0px 16px 48px 0px #00000014;
`;

export const ImgInput = styled('input')``;
