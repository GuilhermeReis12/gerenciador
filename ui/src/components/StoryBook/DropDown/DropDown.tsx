import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Button from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/pro-light-svg-icons';
import {
  DropdownContainer,
  DropdownMenu,
  DropdownMenuItem,
  ContainerRelative,
  DropDownPerfil,
  PerfilInformation,
  PerfilImage,
  NamesInformation,
  NameInformation,
  Information,
  Line,
  FooterButtons,
  CamPerfil,
  ContainerPerfilImage,
  Backdrop
} from './DropdownStyle';
import { Label } from '../../Typography/Label';
import { useNavigate } from 'react-router-dom';

interface ThemeColorType {
  ThemeColor?:
  | 'main'
  | 'dark'
  | 'light'
  | 'disabled'
  | 'medium'
  | 'lighter'
  | 'lightest'
  | 'lightest2'
  | 'greenAlt'
  | 'ei'
  | 'ef1'
  | 'ef2'
  | 'em'
  | 'eja'
  | 'informative'
  | 'warning'
  | 'error'
  | 'sucess'
  | 'textColorBlack'
  | 'textColorDarkest'
  | 'textColorDark'
  | 'textColorLight'
  | 'textColorLighter'
  | 'textColorWhite'
  | React.CSSProperties['color'];
}

interface Dependentesitem {
  name: string;
  func: () => void;
}

export interface DropdownProps {
  type: string;
  options?: any;
  isOpen: boolean;
  onSelect?: (option: string) => void;
  customLabelColor?: ThemeColorType['ThemeColor'];
  accentColor?: ThemeColorType['ThemeColor'];
  disabled?: boolean;
  presentation?: boolean;
  setExit?: () => void;
  setOpen: (e: boolean) => void;
  myProfile?: () => void;
  clickCam?: () => void;
  perfil?: any;
  dependentes?: Dependentesitem[];
  image?: string;
  tab?: number;
  setTab?: Dispatch<SetStateAction<any>>;
}

const DropDown = ({
  type = 'simple',
  customLabelColor = 'main',
  accentColor = 'main',
  disabled = false,
  options,
  onSelect,
  isOpen,
  setExit,
  myProfile,
  setOpen,
  clickCam,
  perfil,
  dependentes,
  presentation = false,
  image,
  tab = 0,
  setTab,
  ...props
}: DropdownProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [openPopper, setOpenPopper] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleOpen = (e: boolean) => {
    setOpen && setOpen(e);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isOpen && type === 'perfil' ? (
        <DropDownPerfil midia={isMobile}>
          <PerfilInformation>
            <ContainerPerfilImage>
              <CamPerfil onClick={clickCam}>
                <FontAwesomeIcon
                  style={{ height: 16, width: 16 }}
                  icon={faCamera}
                  color="white"
                  onClick={() => setOpenPopper(!openPopper)}
                />
              </CamPerfil>
              <PerfilImage>
                <img
                  src={perfil?.link_img}
                  style={{ height: '100px' }}
                  alt=""
                />
              </PerfilImage>
            </ContainerPerfilImage>

            <NamesInformation>
              <NameInformation>{perfil?.username}</NameInformation>
              <Information>{perfil?.email}</Information>
            </NamesInformation>
          </PerfilInformation>

          <Button
            fullfullWidth={true}
            variant="alternative"
            onClick={() => {
              navigate('/meu-perfil');
            }}
          >
            Editar perfil
          </Button>

          {!isMobile && <Line />}

          <FooterButtons>
            {isMobile && (
              <Button
                variant="alternative"
                fullfullWidth={true}
                onClick={() => {
                  setOpen && setOpen(false);
                }}
              >
                Fechar
              </Button>
            )}
            <Button
              fullfullWidth={true}
              onClick={() => {
                setExit && setExit();
              }}
            >
              Sair
            </Button>
          </FooterButtons>
        </DropDownPerfil>
      ) : (
        <>
          {isOpen && type === 'simple' && (
            <DropdownContainer presentation={presentation}>
              <ContainerRelative>
                {isOpen && type === 'simple' && (
                  <>
                    {isMobile && (
                      <Backdrop
                        onClick={() => {
                          handleOpen(false);
                        }}
                        isOpen={isOpen}
                      />
                    )}
                    <DropdownMenu isOpen={isOpen} midia={isMobile}>
                      {options.map((option: any, index: number) => (
                        <DropdownMenuItem key={index} onClick={option.func}>
                          <Label label={option.name} variant="smallBold" />
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenu>
                  </>
                )}
              </ContainerRelative>
            </DropdownContainer>
          )}
        </>
      )}
    </>
  );
};

export default DropDown;
