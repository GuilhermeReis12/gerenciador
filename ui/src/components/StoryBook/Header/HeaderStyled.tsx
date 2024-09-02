import styled from '@emotion/styled/macro';

export const Container = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  max-height: 80px;
  background-color: ${(props) => props.theme.color.primary.dark};
  padding: 16px 0px;
`;

export const ContainerHeader = styled.div`
  max-width: 1216px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0px 10px;
  @media screen and (max-width: 768px) {
    max-width: 768px;
  }

  @media screen and (max-width: 600px) {
    max-width: 600px;
  }
`;

export const ContainerSesi = styled.div`
  display: flex;
  align-items: center;
  max-height: 41px; 
  gap: 0px; 
  opacity: 0px; 
  
  img {
    width: 109px; 
    height: 41px; 
  }
`;


export const Line = styled.div`
  height: 40px;
  width: 1px;
  background-color: #dfdfdf;
`;

export const ContainerPerfil = styled.div`
  max-height: 40px;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;

export const CirclePerfil = styled.div`
  border: 2.6px solid white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  text-align: center;
`;

export const ContainerText = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: space-around;
`;
