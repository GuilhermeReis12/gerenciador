import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.message}>Ops! Parece que você se perdeu...</p>
      <p style={styles.subMessage}>A página que você está tentando acessar não existe.</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    fontSize: '72px',
    color: '#e74c3c',
    marginBottom: '10px',
  },
  message: {
    fontSize: '24px',
    color: '#34495e',
    marginBottom: '20px',
  },
  subMessage: {
    fontSize: '18px',
    color: '#7f8c8d',
  },
};

export default NotFound;
