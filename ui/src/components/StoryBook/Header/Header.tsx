import React, { useState, useEffect, useCallback } from 'react';
import { HeaderProps } from './HeaderTypes';
import {
  Container,
  ContainerHeader,
  ContainerSesi,
  ContainerText,
  ContainerPerfil,
  CirclePerfil
} from './HeaderStyled';
// @ts-ignore
import DropDown from '../DropDown/DropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp } from '@fortawesome/pro-light-svg-icons';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../../utils/auth';
import { useTheme } from '@mui/material/styles';
import { api } from '../../../utils/axios';

export const Header = ({ setPerfilModal }: HeaderProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<any>();

  const theme = useTheme<any>();

  const renderPerfil = useCallback(async () => {
    try {
      return await api.get(`/me`).then((res) => {
        setPerfil(res?.data[0]);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const toggleDrop = () => {
    setOpenModal(!openModal);
  };

  useEffect(() => {
    if (isAuthenticated()) renderPerfil();
  }, [renderPerfil]);

  const Exit = () => {
    localStorage.clear();
    navigate('/login');
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
      <Container>
        <ContainerHeader>
          <ContainerSesi>
            <img src={theme?.logos?.logo_header} alt="" />
          </ContainerSesi>
          {isAuthenticated() ? (
            <ContainerPerfil>
              <CirclePerfil>
                <img style={{ height: '35px' }} src={perfil?.link_img} alt="" />
              </CirclePerfil>
              {!isMobile && (
                <ContainerText>
                  <span>{perfil?.username}</span>
                  <span>{perfil?.email}</span>
                </ContainerText>
              )}
              <div
                style={{ width: '10px', cursor: 'pointer' }}
                onClick={() => {
                  toggleDrop();
                }}
              >
                <FontAwesomeIcon
                  style={{ height: 16, width: 16 }}
                  icon={openModal ? faCaretUp : faCaretDown}
                  color="white"
                />
              </div>
            </ContainerPerfil>
          ) : (
            <></>
          )}
        </ContainerHeader>
      </Container>
      <DropDown
        type="perfil"
        image={perfil?.foto_perfil}
        isOpen={openModal}
        perfil={perfil}
        setExit={() => {
          Exit();
        }}
        setOpen={() => {
          toggleDrop();
        }}
      />
    </>
  );
};
