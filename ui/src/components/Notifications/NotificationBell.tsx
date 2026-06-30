import React, { useCallback, useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Menu,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/pro-light-svg-icons';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { api } from '../../utils/axios';
import { Notificacao, Paginated } from '../../types/tarefas';
import { parseApiError } from '../../utils/apiError';

const NotificationBell: React.FC = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const loadNotifications = useCallback(async () => {
    try {
      const [listRes, countRes] = await Promise.all([
        api.get<Paginated<Notificacao>>('/notificacoes', { params: { page_size: 10 } }),
        api.get<{ count: number }>('/notificacoes/unread_count')
      ]);
      setNotifications(listRes.data.results || []);
      setUnreadCount(countRes.data.count || 0);
    } catch (error) {
      const parsed = parseApiError(error);
      if (parsed.status !== 404) {
        toast.error(parsed.message);
      }
    }
  }, []);

  useEffect(() => {
    loadNotifications();
    const interval = window.setInterval(loadNotifications, 60000);
    return () => window.clearInterval(interval);
  }, [loadNotifications]);

  const openMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    loadNotifications();
  };

  const closeMenu = () => setAnchorEl(null);

  const markAsRead = async (notification: Notificacao) => {
    try {
      if (!notification.lida) {
        await api.patch(`/notificacoes/${notification.id}`, { lida: true });
        setUnreadCount((prev) => Math.max(0, prev - 1));
        setNotifications((prev) =>
          prev.map((item) => (item.id === notification.id ? { ...item, lida: true } : item))
        );
      }
      if (notification.tarefa) {
        navigate('/minhas-tarefas');
      }
      closeMenu();
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  const markAllRead = async () => {
    try {
      await api.post('/notificacoes/mark_all_read');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((item) => ({ ...item, lida: true })));
    } catch (error) {
      toast.error(parseApiError(error).message);
    }
  };

  return (
    <Box sx={{ mr: 1 }}>
      <IconButton color="inherit" onClick={openMenu} aria-label="notificações">
        <Badge badgeContent={unreadCount} color="error">
          <FontAwesomeIcon icon={faBell} style={{ color: 'white', width: 18, height: 18 }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        PaperProps={{ sx: { width: 360, maxHeight: 420 } }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontWeight: 700 }}>Notificações</Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllRead}>
              Marcar todas
            </Button>
          )}
        </Box>
        <Divider />
        {!notifications.length && (
          <Box sx={{ px: 2, py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Nenhuma notificação.
            </Typography>
          </Box>
        )}
        <List dense sx={{ py: 0 }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              button
              onClick={() => markAsRead(notification)}
              sx={{
                bgcolor: notification.lida ? 'transparent' : 'action.hover',
                alignItems: 'flex-start'
              }}
            >
              <ListItemText
                primary={notification.titulo}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {notification.mensagem}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(notification.created_at).toLocaleString('pt-BR')}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Menu>
    </Box>
  );
};

export default NotificationBell;
