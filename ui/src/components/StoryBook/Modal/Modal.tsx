import { ModalProps } from './ModalTypes';
import {
  Container,
  Header,
  ContentHeader,
  ContentSubtitle,
  LineFooter,
  ContainerButtons,
  ContainerFooter,
  Background
} from './ModalStyled';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Label } from '../../Typography/Label';
import Button from '../Button/Button';

const Modal = ({
  children,
  isOpen,
  onClose,
  onClick,
  header,
  subtitle,
  footer,
  maxWidth
}: ModalProps) => {
  return (
    <>
      {isOpen && (
        <Background onClick={onClose}>
          <Container maxWidth={maxWidth}>
            {header && (
              <Header>
                <ContentHeader>
                  <Label
                    color="#1E1E1E"
                    variant="bodyBold"
                    label={header}
                    style={{ fontSize: '20px' }}
                  />
                </ContentHeader>

                <ContentHeader>
                  <FontAwesomeIcon
                    onClick={onClose}
                    fontSize="20px"
                    icon="xmark"
                  />
                </ContentHeader>
              </Header>
            )}

            {subtitle && (
              <ContentSubtitle>
                <Label
                  color="#505050"
                  variant="bodyBold"
                  label={subtitle}
                  style={{ fontSize: '17px' }}
                />
              </ContentSubtitle>
            )}

            {children && <>{children}</>}

            {footer && (
              <ContainerFooter>
                <LineFooter />

                <ContainerButtons>
                  <Button
                    color="main"
                    variant='outlined'
                    onClick={onClose}
                  >
                    label="Cancelar"
                  </Button>

                  <Button
                    onClick={onClick}

                  >
                    label="Confirmar"
                  </Button>
                </ContainerButtons>
              </ContainerFooter>
            )}
          </Container>
        </Background>
      )}
    </>
  );
};

export default Modal;
