import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { Sidebar } from 'components/layout/Sidebar';
import { TopBar } from 'components/layout/TopBar';
import { layoutTokens } from 'styles/theme';

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          width: { xs: '100%', md: `calc(100% - ${layoutTokens.sidebarWidth}px)` }
        }}
      >
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Box sx={{ width: '100%', maxWidth: layoutTokens.contentMaxWidth }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
