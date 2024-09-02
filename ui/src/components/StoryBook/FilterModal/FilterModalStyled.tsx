import styled from '@emotion/styled/macro';

interface ModalFilterProps {
  isOpen?: boolean;
}

export const ModalOverlay = styled.div<ModalFilterProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  overflow: hidden;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  pointer-events: ${({ isOpen }) => (isOpen ? 'auto' : 'none')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
`;

export const ModalContainer = styled.div`
  width: 100%;
  background-color: #fff;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow: hidden;
`;

export const ModalContent = styled.div`
  padding: 20px;
`;
