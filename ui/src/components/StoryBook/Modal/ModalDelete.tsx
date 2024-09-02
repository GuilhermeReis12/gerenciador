import styled from 'styled-components';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Label } from '../../Typography/Label';
import Row from '../Row/Row';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { api } from '../../../utils/axios';
import { toast } from 'react-toastify';

type ModalDeleteProps = {
  className?: string;
  isOpen: boolean;
  handleClose?: any;
  onClick?: () => void;
  deleteItem?: any;
  label?: any;
  fetchCategoria?: any;
};

const ModalDelete = ({
  className,
  isOpen,
  handleClose,
  deleteItem,
  label,
  fetchCategoria
}: ModalDeleteProps) => {
  const styleBox = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',

    maxWidth: '20%',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: 24,
    gap: '24px',
    padding: '19px 24px 19px 24px'
  };

  const DeleteItem = (id: any) => {
    try {
      api
        .post(`/urel para deletar o modal/${id}/delete_item`)
        .then((response: any) => {
          toast.success('Item deletado com sucesso');
          fetchCategoria();
          handleClose();
        });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={className}>
      <Modal
        open={isOpen}
        className={className}
        onClose={() => handleClose()}
        sx={{ boxShadow: 'none' }}
      >
        <Box sx={styleBox}>
          <Row direction="column" alignItems="center">
            <FontAwesomeIcon
              style={{
                fontSize: '64px',
                color: 'FF685E',
                marginBottom: '1rem'
              }}
              icon="circle-xmark"
            />
            <div style={{ marginBottom: '1rem' }}>
              <Label
                label={label}
                color="#040E6A"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: 400,
                  textAlign: 'left',
                  color: ' #646464'
                }}
              />
            </div>
          </Row>
          <hr style={{ width: '100%', border: '1px solid #dfdfdf' }} />
          {/* <Row
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '1rem'
            }}
          >
            <Button type="secondary" label="Cancelar" onClick={handleClose} />
            <Button
              type="primary"
              label="Confirmar"
              onClick={() => DeleteItem(deleteItem)}
            />
          </Row> */}
        </Box>
      </Modal>
    </div>
  );
};
export default styled(ModalDelete)``;
