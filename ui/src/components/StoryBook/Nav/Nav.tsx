import Menu from '../../StoryBook/Menu/Menu';
import { useNavigate } from 'react-router-dom';
import { HeaderContainer, MenuContainer } from './NavStyled';
import { useCapabilities } from '../../../hooks/useCapabilities';

export const Nav = () => {
  const navigate = useNavigate();
  const { capabilities } = useCapabilities();

  return (
    <>
      <HeaderContainer>
        <MenuContainer style={{ display: 'flex', flexWrap: 'wrap' }}>
          <Menu title="Dashboard" onClick={() => navigate('/home')} />
          {capabilities.can_complete_assigned && (
            <Menu title="Minhas Tarefas" onClick={() => navigate('/minhas-tarefas')} />
          )}
          {capabilities.can_create_tasks && (
            <Menu title="Gerenciar Tarefas" onClick={() => navigate('/tarefas')} />
          )}
          {capabilities.can_manage_team && (
            <Menu title="Painel Equipe" onClick={() => navigate('/equipe-tarefas')} />
          )}
          {(capabilities.can_manage_equipes || capabilities.can_manage_team) && (
            <Menu title="Equipes" onClick={() => navigate('/equipes')} />
          )}
          <Menu title="Agenda" onClick={() => navigate('/agenda')} />
          <Menu title="Relatórios" onClick={() => navigate('/relatorios')} />
          <Menu title="Operações" onClick={() => navigate('/operacoes')} />
          {capabilities.can_manage_permissions && (
            <Menu title="Permissões de Acesso" onClick={() => navigate('/permissoes-grupos')} />
          )}
          <Menu title="Perfil" onClick={() => navigate('/meu-perfil')} />
        </MenuContainer>
      </HeaderContainer>
    </>
  );
};
