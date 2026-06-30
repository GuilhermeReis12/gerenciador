import React, { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { SidebarToggle } from 'components/layout/Sidebar';
import EmpresaSwitcher from 'components/Empresa/EmpresaSwitcher';
import NotificationBell from 'components/Notifications/NotificationBell';
import { useCurrentUser } from 'hooks/useCurrentUser';
import { clearToken } from 'utils/auth';
import { layoutTokens } from 'styles/theme';

type TopBarProps = {
  onMenuClick: () => void;
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    clearToken();
    localStorage.clear();
    navigate('/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: '100%',
        bgcolor: '#fff',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: (theme) => theme.zIndex.drawer + 1
      }}
    >
      <Toolbar
        sx={{
          minHeight: `${layoutTokens.topBarHeight}px !important`,
          gap: 1,
          width: '100%',
          maxWidth: layoutTokens.contentMaxWidth,
          mx: 'auto',
          px: { xs: 2, md: 3 }
        }}
      >
        <SidebarToggle onClick={onMenuClick} />

        <Box sx={{ flex: 1 }} />

        <EmpresaSwitcher />

        <NotificationBell />

        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ ml: 0.5, p: 0.5 }}
          aria-label="Menu do usuário"
        >
          <Avatar
            src={user?.link_img}
            alt={user?.name || user?.username}
            sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.9rem' }}
          >
            {(user?.name || user?.username || '?').charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{ sx: { minWidth: 200, mt: 0.5 } }}
        >
          {user && (
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {user.name || user.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          )}
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate('/meu-perfil');
            }}
          >
            <PersonOutlineOutlinedIcon fontSize="small" sx={{ mr: 1.5, opacity: 0.7 }} />
            Meu perfil
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
            <LogoutOutlinedIcon fontSize="small" sx={{ mr: 1.5, opacity: 0.7 }} />
            Sair
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
