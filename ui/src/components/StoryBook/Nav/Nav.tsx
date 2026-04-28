import Menu from '../../StoryBook/Menu/Menu';
import { useNavigate } from 'react-router-dom';
import { HeaderContainer, MenuContainer } from './NavStyled';



export const Nav = () => {
  const navigate = useNavigate();
  return (
    <>
      <HeaderContainer>
        <MenuContainer style={{ display: 'flex' }}>
          <Menu
            title="Dashboard"
            onClick={() => {
              navigate('/home');
            }}
          />
          <Menu
            title="Tarefas"
            onClick={() => {
              navigate('/tarefas');
            }}
          />
          <Menu
            title="Agenda"
            onClick={() => {
              navigate('/agenda');
            }}
          />
          <Menu
            title="Relatórios"
            onClick={() => {
              navigate('/relatorios');
            }}
          />
          <Menu
            title="Perfil"
            onClick={() => {
              navigate('/meu-perfil');
            }}
          />
        </MenuContainer>
      </HeaderContainer>
    </>
  );
};
