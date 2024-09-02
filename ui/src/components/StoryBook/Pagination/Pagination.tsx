import { useEffect, useState } from 'react';
import { PaginationProps } from './PaginationTypes';
import { Container, ContainerButton } from './PaginationStyled';
import Button from '../Button/Button';

export const Pagination = ({
  backgroundColor,
  totalPages = 12,
  setPage,
  page = 1,
  disabled = false,
  onClick,
  clicked,
  ...props
}: PaginationProps) => {
  const [startPage, setStartPage] = useState(1);
  const [pages, setPages] = useState(page);

  const handleClickArrow = (direction: string) => {
    if (direction === 'right') {
      if (startPage + 8 <= totalPages) {
        setStartPage(startPage + 8);
      }
    } else if (direction === 'left') {
      if (startPage - 8 >= 1) {
        setStartPage(startPage - 8);
      }
    }
  };

  useEffect(() => {
    setPage && setPage(pages);
  }, [pages, setPage]);

  useEffect(() => {
    onClick && onClick();
  }, [page, onClick]);

  const handlePage = (index: number) => {
    setPages(index + 1);
  };

  return (
    <Container>
      <ContainerButton>
        <Button
          onClick={() => {
            handleClickArrow('left');
          }}
          disabled={startPage === 1}
          variant="icon"
        >
          &lt;
        </Button>
      </ContainerButton>
      {Array.from({ length: Math.min(totalPages - startPage + 1, 8) }).map(
        (_, index) => (
          <ContainerButton key={index}>
            <Button
              variant="page"
              clicked={pages === startPage + index}
              onClick={() => {
                handlePage(startPage + index - 1);
              }}
            >
              {startPage + index}
            </Button>
          </ContainerButton>
        )
      )}
      {totalPages > startPage + 8 && (
        <ContainerButton>
          <span>...</span>
        </ContainerButton>
      )}
      <ContainerButton>
        <Button
          onClick={() => {
            handleClickArrow('right');
          }}
          disabled={startPage + 8 > totalPages}
          variant="icon"
        >
          &gt;
        </Button>
      </ContainerButton>
    </Container>
  );
};
