import React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import GroupWorkOutlinedIcon from '@mui/icons-material/GroupWorkOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { NAV_ITEMS } from 'constants/navigation';
import { useCapabilities } from 'hooks/useCapabilities';
import { layoutTokens } from 'styles/theme';

const ICON_MAP: Record<string, React.ReactElement> = {
  '/home': <DashboardOutlinedIcon />,
  '/minhas-tarefas': <AssignmentOutlinedIcon />,
  '/tarefas': <TaskAltOutlinedIcon />,
  '/equipe-tarefas': <GroupsOutlinedIcon />,
  '/equipes': <GroupWorkOutlinedIcon />,
  '/agenda': <CalendarMonthOutlinedIcon />,
  '/relatorios': <BarChartOutlinedIcon />,
  '/operacoes': <Inventory2OutlinedIcon />,
  '/auditoria': <HistoryOutlinedIcon />,
  '/permissoes-grupos': <SecurityOutlinedIcon />,
  '/meu-perfil': <PersonOutlineOutlinedIcon />
};

type SidebarProps = {
  mobileOpen: boolean;
  onMobileClose: () => void;
};

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { capabilities } = useCapabilities();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !item.visible || item.visible(capabilities)
  );

  const handleClick = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar
        sx={{
          minHeight: `${layoutTokens.topBarHeight}px !important`,
          px: 2.5,
          borderBottom: '1px solid rgba(255,255,255,0.08)'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Gerenciador
        </Typography>
      </Toolbar>

      <List sx={{ px: 1.5, py: 2, flex: 1 }}>
        {visibleItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.path}
              selected={active}
              onClick={() => handleClick(item.path)}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                color: 'rgba(255,255,255,0.75)',
                '&.Mui-selected': {
                  bgcolor: 'rgba(37, 99, 235, 0.2)',
                  color: '#fff',
                  '&:hover': { bgcolor: 'rgba(37, 99, 235, 0.28)' },
                  '& .MuiListItemIcon-root': { color: '#60a5fa' }
                },
                '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                {ICON_MAP[item.path]}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500 }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const drawerPaperSx = {
    width: layoutTokens.sidebarWidth,
    bgcolor: '#0f172a',
    borderRight: 'none',
    color: '#fff'
  };

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': drawerPaperSx }}
      >
        <SidebarContent onNavigate={onMobileClose} />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: layoutTokens.sidebarWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': drawerPaperSx
      }}
    >
      <SidebarContent />
    </Drawer>
  );
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <IconButton
      color="inherit"
      edge="start"
      onClick={onClick}
      sx={{ mr: 1, display: { md: 'none' } }}
      aria-label="Abrir menu"
    >
      <MenuIcon />
    </IconButton>
  );
}
