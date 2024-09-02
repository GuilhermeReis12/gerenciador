import { useState, useEffect } from 'react';
import Row from '../Row/Row';
import {
  ContainerFooter,
  UpFooter,
  DownFooter,
  ContentDown,
  EducatLogo
} from './FooterStyled';
// @ts-ignore
import LogoEducat from '../../../assets/images/logoEducatAzul.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpotify,
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faTiktok,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

export const Footer = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ContainerFooter>
      <UpFooter>
        <Row
          lg="100%"
          md="100%"
          xs="100%"
          alignItems="center"
          gap="20px"
          justifyContent="center"
          style={{ padding: '40px 0px' }}
        >
          <Row lg="10%" md="100%" xs="100%" gap="10px" justifyContent="center">
            <Row lg="100%" md="25%">
              <strong>Joel Jota</strong>
            </Row>
            <Row lg="100%" md="25%">
              <strong>Agenda</strong>
            </Row>
          </Row>
          <Row lg="25%" md="100%" xs="100%" direction="column">
            <Row>
              <strong>Contato</strong>
            </Row>
            <Row>Suporte</Row>
            <Row>Palestras</Row>
            <Row>Influência</Row>
          </Row>
          <Row lg="25%" md="100%" xs="100%" direction="column">
            <Row>
              {' '}
              <strong>Mais</strong>
            </Row>
            <Row>A trinca</Row>
            <Row>A Hora H</Row>
          </Row>
        </Row>
      </UpFooter>

      <DownFooter>
        <ContentDown>
          <Row lg="25%" md="100%" xs="100%" direction="row">
            <Row alignItems="center">
              <a
                href="https://www.facebook.com/joeljotaoficial/"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  icon={faFacebookF}
                  style={{ width: 30, height: 30, color: '#fff' }}
                />
              </a>
              <a
                href="https://www.instagram.com/joeljota/"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  icon={faInstagram}
                  style={{
                    width: 30,
                    height: 30,
                    color: '#fff'
                  }}
                />
              </a>
              <a
                href="https://www.linkedin.com/in/joeljota/?originalSubdomain=br"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  icon={faLinkedinIn}
                  style={{
                    marginLeft: '1rem',
                    width: 30,
                    height: 30,
                    color: '#fff',
                    borderRadius: '20px'
                  }}
                />
              </a>
              <a
                href="https://www.youtube.com/@JoelJota"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  icon={faYoutube}
                  style={{
                    marginLeft: '1rem',
                    width: 30,
                    height: 30,
                    color: '#fff',
                    borderRadius: '20px'
                  }}
                />
              </a>
              <a
                href="https://open.spotify.com/show/6wqBtC9OMq2mLvhDjZbqVM?si=6b0135cf3dd948ad&nd=1&dlsi=dec4cfe5c5544a10"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  icon={faSpotify}
                  style={{
                    marginLeft: '1rem',
                    width: 30,
                    height: 30,
                    color: '#fff',
                    borderRadius: '20px'
                  }}
                />
              </a>
              <a
                href="https://www.tiktok.com/@joel_jota"
                target="_blank"
                rel="noreferrer"
              >
                <FontAwesomeIcon
                  icon={faTiktok}
                  style={{
                    marginLeft: '1rem',
                    width: 30,
                    height: 30,
                    color: '#fff',
                    borderRadius: '20px'
                  }}
                />
              </a>
            </Row>
          </Row>
          <div>
            <a
              style={{ color: 'white' }}
              href="https://educat.com.br/wp-content/uploads/2021/12/Anexo-3-Politica-de-Privacidade-e-Politica-de-Cookies.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Política de Privacidade
            </a>
          </div>
          <Row>
            <EducatLogo style={{width:"10px", height:"10px"}}>
              <img src={LogoEducat} alt="" />
            </EducatLogo>
          </Row>
        </ContentDown>
      </DownFooter>
    </ContainerFooter>
  );
};
