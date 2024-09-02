import styled from '@emotion/styled/macro';

type ModalProps = {
  maxWidth?: boolean;
};

export const Background = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  z-index: 999;
`;

export const Container = styled.div<ModalProps>`
  position: relative;
  z-index: 1000;
  max-width: 950px;
  min-width: 302px;
  width: ${(props) => (props.maxWidth ? '950px' : 'auto')};
  padding: 1.2rem 1.5rem;
  box-shadow: 0 16px 48px 0 rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  background: #ffffff;
`;

export const Header = styled.div`
  display: flex;
  width: 100%;
  height: 43px;
  justify-content: space-between;
  border-bottom: 2px solid #c0c0c0;
  margin-bottom: 24px;
`;

export const ContentHeader = styled.div``;

export const ContentSubtitle = styled.div`
  margin-bottom: 20px;
`;

export const ContainerFooter = styled.div`
  width: 100%;
`;

export const LineFooter = styled.div`
  border-top: 2px solid #c0c0c0;
  width: '100%';
  margin-top: 24px;
  margin-bottom: 17px;
`;

export const ContainerButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 20px;
`;
