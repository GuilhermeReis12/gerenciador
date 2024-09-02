import styled from '@emotion/styled/macro';
interface DropdownStyle {
  presentation?: boolean;
  midia?: boolean;
  isOpen?: boolean;
}

export const DropdownContainer = styled.div<DropdownStyle>`
  min-height: ${(props) => (props.presentation ? '200px' : 'auto')};
`;

export const ContainerRelative = styled.div`
  position: relative;
  box-sizing: border-box;
`;

export const Backdrop = styled.div<DropdownStyle>`
  display: ${(props) => (props.isOpen ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
  opacity: 0.6;
  z-index: 1;
`;

export const DropdownMenu = styled.div<DropdownStyle>`
  min-width: 176px;
  background-color: #fff;
  border-radius: 8px;
  margin-top: 0.75rem;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  z-index: 1000 !important;

  @media (max-width: 600px) {
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    transition: height 0.3s ease-in-out;
    overflow: hidden;
    height: 300px;
    border-radius: 40px 40px 0px 0px;
  }
`;

export const DropDownPerfil = styled.div<DropdownStyle>`
  min-width: 350px;
  z-index: 100;
  background-color: white;
  border-radius: 16px;
  padding: 1rem;
  box-sizing: border-box;
  position: absolute;
  height: auto;
  right: 50px;
  width: auto;
  top: 70px;
  box-shadow: 0px 16px 48px 0px #00000014;

  @media (min-width: 1945px) {
    right: 350px !important;
  }

  @media (min-width: 1715px) {
    right: 150px;
  }

  @media (max-width: 1392px) {
    right: 0;
  }

  @media (max-width: 600px) {
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
`;

export const PerfilInformation = styled.div`
  margin: 0px 47px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export const ContainerPerfilImage = styled.div`
  position: relative;
`;

export const FileInput = styled.input`
  display: none;
`;
export const PerfilImage = styled.div`
  border: 2.6px solid;
  border-color: #4759ff;
  width: 104.04px;
  height: 104.04px;
  border-radius: 50%;
  margin-bottom: 16px;
  overflow: hidden;
  text-align: center;
`;

export const CamPerfil = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.color.primary.dark};
  position: absolute;
  color: white;
  right: 5px;
  bottom: 20px;
  cursor: pointer;
`;

export const NamesInformation = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin-bottom: 16px;
`;
export const SetorInformation = styled.div`
  display: flex;
  justify-content: center;
  font-family: Inter;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  color: ${(props) => props.theme.color.secondary.lightest};
`;

export const NameInformation = styled.div`
  display: flex;
  justify-content: center;
  font-family: Inter;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  color: ${(props) => props.theme.color.primary.dark};
`;

export const Information = styled.div`
  display: flex;
  justify-content: center;
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${(props) => props.theme.color.primary.dark};
`;

export const ContainerButton = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
`;

export const ContainerTab = styled.div`
  margin: 16px 0px;
  @media (max-width: 600px) {
    margin: 32px 0px;
  }
`;

export const CardsTab = styled.div`
  width: 100%;
  border-radius: 6px;
  margin-bottom: 8px;
  background: #e5f4e5;
  display: flex;
  justify-content: space-between;
  @media (max-width: 600px) {
    padding: 4px 9px;
  }
`;

export const InfoCardTab = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
`;

export const ButtonCardTab = styled.div`
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
`;

export const CirclePerfil = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff9800;
  margin-right: 8px;
`;
export const Line = styled.div`
  border: 1px solid #c0c0c0;
  margin-top: 16px;
  margin-bottom: 24px;
`;

export const FooterButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
`;

export const DropdownMenuItem = styled.div`
  padding: 8px;
  display: flex;
  color: #505050;
  width: 100%;
  border-radius: 8px;
`;
