import React, { useState, useEffect, useCallback } from 'react';
import Container from '../Container/Container';
import { api } from '../../../utils/axios';
import { Pagination } from '../Pagination/Pagination';
import Row from '../Row/Row';
import { Label } from '../../Typography/Label';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import ModalDelete from '../Modal/ModalDelete';

interface ListEditProps {
  filter?: any;
  filterBusca?: any;
}
const ListEditItem = ({ filter, filterBusca }: ListEditProps) => {
  const { id } = useParams();
  const [optionsCategory, setOptionsCategory] = useState<any>([]);
  const [pages, setPages] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [idItem, setIdItem] = useState({});
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchCategoria = useCallback(
    async (page: any) => {
      try {
        const params = {
          ...filter,
          Titulo__icontains: filterBusca,
          page: page
        };
        return await api
          .get(`/Biblioteca/Biblioteca_Item`, { params })
          .then((res) => {
            setPages(res.data.total_pages);
            setOptionsCategory(res.data.results);
          });
      } catch (error) {
        console.error(error);
      }
    },
    [filter, filterBusca]
  );

  useEffect(() => {
    fetchCategoria(page);
  }, [fetchCategoria, page, filter, id, filterBusca]);

  const editItem = (id: any) => {
    navigate(`/item-form/${id}`);
  };

  return (
    <Container>
      <Row justifyContent="space-between" gap="1rem">
        <ModalDelete
          isOpen={modalOpen}
          handleClose={() => setModalOpen(false)}
          fetchCategoria={fetchCategoria}
          deleteItem={idItem}
          label="Tem certeza que deseja excluir este item?"
        />
        {optionsCategory ? (
          optionsCategory.map((data: any) => (
            <>
              <div
                style={{
                  display: 'grid',
                  width: '100%',
                  gridTemplateColumns: '1fr 3fr',
                  borderRadius: '8px ',
                  boxShadow: '0px 16px 48px 0px #00000014'
                }}
              >
                <img
                  src={data?.Capa}
                  alt=""
                  width={250}
                  style={{ borderRadius: '8px 0 0 8px', height: 'auto' }}
                />
                <Row
                  direction="column"
                  justifyContent="space-between"
                  style={{
                    heigth: '100%'
                  }}
                >
                  <Row
                    direction="column"
                    style={{
                      heigth: '100%',
                      marginLeft: '1rem',
                      marginTop: '1rem'
                    }}
                  >
                    <Label
                      label={data?.Titulo}
                      style={{
                        color: theme.color?.primary.light,
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 500
                      }}
                    />
                    <Label
                      label={`Tipo de item: ${data?.Tipo_do_item?.Nome}`}
                      style={{
                        color: theme.color?.primary.dark,
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 500
                      }}
                    />

                    <Label
                      label={`Palavras chaves: ${data?.palavra_chave ? data?.palavra_chave : ''
                        }`}
                      style={{
                        color: theme.color?.primary.dark,
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 500
                      }}
                    />
                    <Label
                      label={`Categoria: ${data?.Categoria?.Nome ? data?.Categoria?.Nome : ''
                        }`}
                      style={{
                        color: theme.color?.primary.dark,
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: 500
                      }}
                    />
                  </Row>
                  <Row
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    style={{ padding: '0rem 1rem 1rem 1rem', width: '100%' }}
                  >
                    <button
                      style={{
                        width: '30px',
                        height: '30px',
                        gap: '10px',
                        borderRadius: '4px',
                        background: theme.color?.primary.main,
                        border: 'none',
                        marginRight: '1rem',
                        cursor: 'pointer'
                      }}
                      onClick={() => editItem(data?.id)}
                    >
                      <FontAwesomeIcon
                        style={{
                          width: '16px',
                          height: '20px',
                          color: theme.color?.textColor.white
                        }}
                        icon="pen"
                      />
                    </button>
                    <button
                      style={{ background: 'none', border: 'none' }}
                      onClick={() => {
                        setModalOpen(true);
                        setIdItem(data?.id);
                      }}
                    >
                      <FontAwesomeIcon
                        style={{
                          width: '16px',
                          height: '20px',
                          color: '#FF685E',
                          cursor: 'pointer'
                        }}
                        icon="trash"
                      />
                    </button>
                  </Row>
                </Row>
              </div>
            </>
          ))
        ) : (
          <></>
        )}
      </Row>
      <Row
        xs="100%"
        lg="100%"
        md="100%"
        justifyContent="flex-end"
        style={{ marginTop: '2rem' }}
      >
        <Pagination page={page} setPage={setPage} totalPages={pages} />
      </Row>
    </Container>
  );
};

export default ListEditItem;
