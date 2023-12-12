import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const DetailDiscount = ({ discount, closeForm, openFormEdit }) => {
   const formRef = useRef(null);
   const [formOpen, setFormOpen] = useState(false);

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            formRef.current &&
            !formRef.current.contains(event.target) &&
            formOpen
         ) {
            console.log('helloi');

            closeForm();
         }
         setFormOpen(true);
      };

      document.addEventListener('click', handleClickOutside);

      return () => {
         document.removeEventListener('click', handleClickOutside);
      };
   }, []);
   return (
      <Container>
         <div className="container-detail" ref={formRef}>
            <table>
               <tbody>
                  <tr>
                     <td>Mã của Discount</td>
                     <td>#{discount.id}</td>
                  </tr>
                  <tr>
                     <td>Giá trị của mã</td>
                     <td>{discount.discountCode}</td>
                  </tr>
                  <tr>
                     <td>Số tiền giảm</td>
                     <td>{discount.discountAmount}</td>
                  </tr>
                  <tr>
                     <td>Số lượng</td>
                     <td>{discount.quantity}</td>
                  </tr>
                  <tr>
                     <td>Hạn sử dụng</td>
                     <td>{discount.expirationDate}</td>
                  </tr>
                  <tr>
                     <td>Trạng thái</td>

                     <td className={`${discount.status}-ic`}>
                        <span>{discount.status}</span>
                     </td>
                  </tr>
               </tbody>
            </table>
            <div className="button-container">
               <button
                  onClick={() => {
                     openFormEdit();
                     closeForm();
                  }}
               >
                  Sửa{' '}
               </button>
               <button>Xóa </button>
               <button onClick={closeForm}>Thoát</button>
            </div>
         </div>
      </Container>
   );
};
const Container = styled.div`
   z-index: 1000 !important;
   position: fixed;
   display: flex;
   justify-content: center;
   width: 100vw;
   height: 100vh;
   top: 0;
   left: 0;
   background-color: rgba(0, 0, 0, 0.6);
   .container-detail {
      background-color: white;
      max-width: 300px;
      min-width: 300px;
      margin: 10px;
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      height: 400px;
      transform: translateY(10%);
   }
   table {
      width: 100%;
      margin-top: 10px;
   }

   table td {
      padding: 10px;
   }

   table td:first-child {
      font-weight: bold;
   }
   table td:first-child::after {
      content: ':';
   }
   .active-ic {
      font-weight: bold;
      color: #008000; /* Màu xanh dương cho trạng thái 'Active' */
      span {
         background-color: #e6f7d9 !important ;
         border-radius: 50rem !important;
         padding: 8px;
      }
   }

   .inactive-ic {
      color: #ff0000; /* Màu đỏ cho trạng thái không 'Active' */
      span {
         background-color: #ffe4e5 !important;
         border-radius: 50rem !important;
         padding: 8px;
      }
   }
   .button-container {
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
   }

   .button-container button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border: none;
      border-radius: 5px;
   }

   .button-container button:nth-child(1) {
      background-color: #3498db; /* Màu xanh dương */
      color: #fff;
   }

   .button-container button:nth-child(2) {
      background-color: #e74c3c; /* Màu đỏ */
      color: #fff;
   }

   .button-container button:nth-child(3) {
      background-color: #2ecc71; /* Màu xanh lá cây */
      color: #fff;
   }

   .button-container button:hover {
      opacity: 0.9;
   }
`;
export default DetailDiscount;
