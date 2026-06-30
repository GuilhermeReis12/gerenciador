import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from 'components/layout/PageContainer';
import { PageHeader } from 'components/layout/PageHeader';
import { EmptyState } from 'components/feedback/EmptyState';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErroPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader title="Ocorreu um erro" description="Algo inesperado aconteceu durante a operação." />
      <EmptyState
        icon={<ErrorOutlineIcon sx={{ fontSize: 48, opacity: 0.5, color: 'error.main' }} />}
        title="Não foi possível concluir a ação"
        description="Tente novamente ou volte ao dashboard. Se o problema persistir, contate o suporte."
        action={
          <Button variant="contained" onClick={() => navigate('/home')}>
            Voltar ao dashboard
          </Button>
        }
      />
    </PageContainer>
  );
};

export default ErroPage;
