import React, { useEffect, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import { api } from '../../utils/axios';
import {
  getActiveEmpresaId,
  setActiveEmpresaId,
  setStoredEmpresas,
  StoredEmpresa
} from '../../utils/auth';

const EmpresaSwitcher: React.FC = () => {
  const [empresas, setEmpresas] = useState<StoredEmpresa[]>([]);
  const [activeId, setActiveId] = useState<number | ''>(getActiveEmpresaId() || '');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get<{ empresas: StoredEmpresa[]; active_empresa_id: number | null }>(
          '/empresas/minhas'
        );
        const list = response.data.empresas || [];
        setEmpresas(list);
        setStoredEmpresas(list);
        const resolved = response.data.active_empresa_id || list[0]?.id || '';
        if (resolved) {
          setActiveEmpresaId(resolved);
          setActiveId(resolved);
        }
      } catch {
        // keep silent; user may not have empresa yet
      }
    };
    load();
  }, []);

  if (!empresas.length) {
    return null;
  }

  const handleChange = async (value: number | '') => {
    if (!value) return;
    setActiveId(value);
    setActiveEmpresaId(value);
    try {
      await api.post('/user-empresas/set_default', { empresa_id: value });
    } catch {
      // local context still updated
    }
    window.location.reload();
  };

  return (
    <FormControl size="small" sx={{ minWidth: 180, mr: 1 }}>
      <InputLabel sx={{ color: 'white' }}>Empresa</InputLabel>
      <Select
        value={activeId}
        label="Empresa"
        onChange={(e) => handleChange(e.target.value === '' ? '' : Number(e.target.value))}
        sx={{
          color: 'white',
          '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.4)' },
          '.MuiSvgIcon-root': { color: 'white' }
        }}
      >
        {empresas.map((empresa) => (
          <MenuItem key={empresa.id} value={empresa.id}>
            {empresa.nome}
          </MenuItem>
        ))}
      </Select>
      {!activeId && (
        <Typography variant="caption" sx={{ color: '#ffeb3b', mt: 0.5 }}>
          Selecione uma empresa
        </Typography>
      )}
    </FormControl>
  );
};

export default EmpresaSwitcher;
