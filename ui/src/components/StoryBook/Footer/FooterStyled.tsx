import styled from '@emotion/styled/macro';

export const ContainerFooter = styled.footer`
  position: relative;
  bottom: 0;
  width: 100%;
  @media screen and (max-width: 768px) {
    max-width: 768px;
  }

  @media screen and (max-width: 600px) {
    max-width: 600px;
  }
`;

export const SuporteContent = styled.div``;

export const UpFooter = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.color.primary.dark};
  color: white;
`;

export const DownFooter = styled.div`
  min-height: 58px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  background-color: ${(props) => props.theme.color.primary.main};
  color: white;
`;

export const ContentDown = styled.div`
  max-width: 1216px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  z-index: 10;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
    justify-content: center;
    gap: 10px;
    max-width: 768px;
  }

  @media screen and (max-width: 600px) {
    justify-content: center;

    max-width: 600px;
  }
`;

export const EducatLogo = styled.div`
  position: absolute;
  right: 25px;
  bottom: 4px;
`;
