import React, { useState, useEffect, useCallback } from 'react';
import Container from '../StoryBook/Container/Container';
import { api } from '../../utils/axios';
import { Pagination } from '../StoryBook/Pagination/Pagination';
import Row from '../StoryBook/Row/Row';
import { Label } from '../Typography/Label';
import { useLocation, useParams } from 'react-router-dom';

interface ListaItensProps {
  filter?: any;
  filterBusca?: any;
}
const ListItens = ({ filter, filterBusca }: ListaItensProps) => {
  const { id } = useParams();
  const location = useLocation();
  const [optionsCategory, setOptionsCategory] = useState([]);
  const [pages, setPages] = useState<number>(0);
  const [page, setPage] = useState(1);
  const params = new URLSearchParams(location.search);
  const filterItens = params.get('tipo')
    ? { Tipo_do_item__Nome: id }
    : { Categoria__id__icontains: id };

  const fetchCategoria = useCallback(
    async (page: any) => {
      try {
        const params = {
          ...filter,
          page: page,
          Titulo__icontains: filterBusca,
          ...filterItens
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
    [filter, id, filterBusca]
  );

  useEffect(() => {
    fetchCategoria(page);
  }, [fetchCategoria, page, filter, id, filterBusca]);

  return (
    <Container>
      <Row justifyContent="space-between" gap="1rem">
        {optionsCategory ? (
          optionsCategory.map((data: any) => (
            <a
              style={{
                textDecoration: 'none',
                color: '#040E6A',
                textAlign: 'center',
                maxWidth: '260px',
                width: '100%'
              }}
              href={data.Link}
              target="_blank"
              rel="noreferrer"
            >
              <img src={data?.Capa} alt="" width={250} />
              <Label
                label={data?.Titulo}
                style={{
                  fontSize: '12px',
                  fontFamily: 'Inter',
                  fontWeight: 500
                }}
              />
            </a>
          ))
        ) : (
          <></>
        )}
      </Row>
      <Row
        xs="100%"
        lg="100%"
        md="100%"
        justifyContent="center"
        style={{ marginTop: '2rem' }}
      >
        <Pagination page={page} setPage={setPage} totalPages={pages} />
      </Row>
    </Container>
  );
};

export default ListItens;
