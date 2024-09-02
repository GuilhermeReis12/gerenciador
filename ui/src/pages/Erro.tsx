import React, { useState, useEffect } from 'react';
import ErrorComponent from '../error/ErrorComponent';

const ErroPage: React.FC = () => {
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Simulação de uma chamada que pode causar um erro
    try {
      throw new Error('Simulação de um erro');
    } catch (error) {
      if (error instanceof Error) {
        setHasError(true);
        setErrorMessage(error.message);
      }
    }
  }, []);

  if (hasError) {
    return <ErrorComponent message={errorMessage} />;
  }

  return (
    <div>
      <h1>Minha Aplicação</h1>
    </div>
  );
};

export default ErroPage;
