import Menu from '../../StoryBook/Menu/Menu';
import { useNavigate } from 'react-router-dom';
import { HeaderContainer, MenuContainer } from './NavStyled';



export const Nav = () => {
  const navigate = useNavigate();
  // const handleSupportMenuClick = () => {
  //   navigate('/item-form/new');
  // };
  return (
    <>
      <HeaderContainer>
        <MenuContainer style={{ display: 'flex' }}>
          <Menu
            title="Início"
            onClick={() => {
              navigate('/home');
            }}
          />     
          <Menu
          title="Clientes"
          onClick={() => {
            navigate('/todosclientes');
          }}
        />
          {/* <Menu onClick={handleSupportMenuClick} title="Clientes" /> */}
          <Menu
            title="Tarefas"
            onClick={() => {
              navigate('/tarefas');
            }}
          />
        </MenuContainer>
      </HeaderContainer>
    </>
  );
};
