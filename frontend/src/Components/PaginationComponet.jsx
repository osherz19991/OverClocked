import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (page) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const maxPagesToShow = 10;
  const currentSet = Math.ceil(currentPage / maxPagesToShow);

  const startPage = (currentSet - 1) * maxPagesToShow + 1;
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <Pagination className="justify-content-center mt-3">
      {currentSet > 1 && (
        <Pagination.Prev onClick={() => handleClick(startPage - maxPagesToShow)}>
          &laquo; Prev 10
        </Pagination.Prev>
      )}
      {pageNumbers.map(page => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => handleClick(page)}
        >
          {page}
        </Pagination.Item>
      ))}
      {endPage < totalPages && (
        <Pagination.Next onClick={() => handleClick(startPage + maxPagesToShow)}>
          Next 10 &raquo;
        </Pagination.Next>
      )}
    </Pagination>
  );
};

export default PaginationComponent;
