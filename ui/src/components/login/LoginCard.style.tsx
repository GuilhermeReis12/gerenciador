import { CSSProperties } from 'react';

const loginCardStyle: CSSProperties = {
  width: '300px',
  height: '300px',
  position: 'absolute',
  top: '50%',
  left: '100px',
  transform: 'translate(0, -50%)',
  borderRadius: '10px',
  padding: '20px 36px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '24px',
  backgroundColor: '#ffffff',
  boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)'
};

const imageContainerStyle: CSSProperties = {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px'
};

const imageStyle: CSSProperties = {
  maxWidth: '100%',
  height: 'auto',
  maxHeight: '100px'
};

export { loginCardStyle, imageContainerStyle, imageStyle };
