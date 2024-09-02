import React from 'react';
import Container from '@mui/material/Container';
import { Navigate, Outlet } from 'react-router-dom';
import { Nav } from '../components/StoryBook/Nav/Nav';
// import { Footer } from '../components/StoryBook/Footer/Footer';
import styled from 'styled-components';
import { Header } from '../components/StoryBook/Header/Header';

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? (
    <>
      <Header />
      <Container>
        <Nav />
        <Outlet />
      </Container>
      {/* <Footer /> */}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default styled(PrivateRoute)`
  position: relative;
  height: 100vh;
  padding-bottom: 2rem;
`;
