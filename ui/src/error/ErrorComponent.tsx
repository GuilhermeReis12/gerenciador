import React from 'react';

interface ErrorComponentProps {
  message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Oops! Algo deu errado</h1>
      <p style={styles.message}>{message}</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    textAlign: 'center',
    margin: '20px auto',
    maxWidth: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#dc3545',
  },
  message: {
    fontSize: '18px',
  },
};

export default ErrorComponent;
