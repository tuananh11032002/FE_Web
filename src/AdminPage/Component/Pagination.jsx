import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

function Pagination({ obj, setPageNow }) {
   const { pageNow, size } = obj;
   useEffect(() => {
      setCurrentPage(pageNow);
   }, [pageNow]);
   const [currentPage, setCurrentPage] = useState(pageNow);
   const totalPage = size;
   const onPageChange = useCallback((pageNumber) => {
      setCurrentPage(pageNumber);
      setPageNow(pageNumber);
   }, []);

   const renderPaginationButtons = () => {
      const buttons = [];
      let startPage = Math.max(currentPage - 2, 1);
      const endPage = Math.min(currentPage + 2, totalPage);

      buttons.push(
         <button onClick={() => onPageChange(1)} className={''}>
            {'<<'}
         </button>
      );

      buttons.push(
         <button
            onClick={() =>
               onPageChange(currentPage === 1 ? 1 : currentPage - 1)
            }
            className={''}
         >
            {'<'}
         </button>
      );

      for (let i = startPage; i <= endPage; i++) {
         buttons.push(
            <button
               key={i}
               onClick={() => onPageChange(i)}
               className={i === currentPage ? 'active-paging' : ''}
            >
               {i}
            </button>
         );
      }

      buttons.push(
         <button
            onClick={() =>
               onPageChange(
                  currentPage === totalPage ? totalPage : currentPage + 1
               )
            }
            className={''}
         >
            {'>'}
         </button>
      );

      buttons.push(
         <button onClick={() => onPageChange(totalPage)} className={''}>
            {'>>'}
         </button>
      );

      return buttons;
   };

   return (
      <Container>
         <div>
            {/* Displaying {Math.max(1, (currentPage - 1) * size + 1)} to{' '}
            {Math.min(currentPage * size, totalProduct)} of {totalProduct}{' '}
            entries */}
            Page {currentPage} / {totalPage}
         </div>
         <div>{totalPage >= 1 && renderPaginationButtons()}</div>
      </Container>
   );
}
const Container = styled.div`
   display: flex;
   justify-content: space-between;
   align-items: center;

   button {
      margin: 2px;
      padding: 5px 10px;
      background-color: #fff;
      cursor: pointer;
      transition: background-color 0.3s, border 0.3s;
      border: none;
      border-radius: 50%;
   }

   button:hover {
      background-color: #f0f0f0;
   }

   button.active-paging {
      background-color: #9055fd;
      color: #fff;
      border: 2px solid #9055fd;
   }

   .ellipsis {
      padding: 5px 0;
      margin: 0 5px;
      font-weight: bold;
   }
`;
export default Pagination;
