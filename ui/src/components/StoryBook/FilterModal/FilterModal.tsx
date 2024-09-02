import { useState, useEffect } from 'react';
import { FilterModalProps } from './FilterModalTypes';
import { createPortal } from 'react-dom';
import {
  ModalOverlay,
  ModalContainer,
  ModalContent
} from './FilterModalStyled';

const FilterModal = ({ isOpen, onClose, children }: FilterModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
    }
  }, [isOpen]);

  const handleOutsideClick = (e: any) => {
    if (e.target === e.currentTarget) {
      onClose && onClose(false);
    }
  };

  return isMounted
    ? createPortal(
        <ModalOverlay isOpen={isOpen} onClick={handleOutsideClick}>
          <ModalContainer>
            <ModalContent>{children}</ModalContent>
          </ModalContainer>
        </ModalOverlay>,
        document.body
      )
    : null;
};

export default FilterModal;
