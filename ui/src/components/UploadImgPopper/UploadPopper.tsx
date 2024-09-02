import React from 'react';
import { ImgInput, UploadPopper } from './UploadPopperStyle';
import { UploadImgPopperProps } from '../../types/UpoloadPopperTypes/UploadPopperTypes';
import { onChange } from 'react-toastify/dist/core/store';

const UploadImgPopper = ({ isOpen, onChange }: UploadImgPopperProps) => {
  return (
    <UploadPopper isOpen={isOpen}>
      <ImgInput
        type="file"
        accept="image/png, image/jpeg"
        onChange={onChange}
      />
    </UploadPopper>
  );
};

export default UploadImgPopper;
