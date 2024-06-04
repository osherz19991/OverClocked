import React from 'react';
import { Button } from 'react-bootstrap';

const Pagination = ({ productsPerPage, totalProducts, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalProducts / productsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div>
      {pageNumbers.map((number) => (
        <Button key={number} onClick={() => paginate(number)}>
          {number}
        </Button>
      ))}
    </div>
  );
};

export default Pagination;
