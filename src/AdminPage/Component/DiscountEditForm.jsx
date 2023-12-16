import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { addDiscount } from '../../Axios/web';
import { ToastContainer, toast } from 'react-toastify';

const DiscountEditForm = ({ closeForm }) => {
   const formRef = useRef(null);
   const [formOpen, setFormOpen] = useState(false);
   const [submitData, setSubmitData] = useState({
      stopDate: null,
      value: 0,
   });

   const handleSubmit = async () => {
      if (submitData?.stopDate !== null && submitData?.value > 0) {
         await addDiscount(submitData);
         closeForm();
      } else {
         toast.error('Dữ liệu không hợp lệ', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
         });
      }
   };

   useEffect(() => {
      const handleClickOutside = (event) => {
         if (
            formRef.current &&
            !formRef.current.contains(event.target) &&
            formOpen
         ) {
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
         <ToastContainer />
         <div className="discount-form" ref={formRef}>
            <label>Thêm mã giảm giá</label>
            {/* <label>
               <span>Giá trị của mã</span>
               <input type="text" name="codeValue" />
            </label> */}

            <label>
               <span>Số tiền giảm</span>
               <input
                  type="number"
                  name="discountAmount"
                  value={submitData?.value}
                  onChange={(e) => {
                     setSubmitData({
                        ...submitData,
                        value: e.target.value < 0 ? 0 : e.target.value,
                     });
                  }}
               />
            </label>

            {/* <label>
               <span>Số lượng</span>
               <input type="number" name="quantity" />
            </label> */}

            <label>
               <span>Hạn sử dụng</span>
               <input
                  type="date"
                  name="expirationDate"
                  value={submitData?.stopDate}
                  onChange={(e) => {
                     setSubmitData({
                        ...submitData,
                        stopDate: e.target.value === '' ? null : e.target.value,
                     });
                  }}
               />
            </label>

            {/* <label>
               <span>Trạng thái</span>
               <select name="status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
               </select>
            </label> */}
            <div className="button-container">
               <button onClick={handleSubmit}>Submit</button>
               <button onClick={closeForm}>Cancel</button>
            </div>
         </div>
      </Container>
   );
};
export default DiscountEditForm;
const Container = styled.div`
   z-index: 1000 !important;
   position: fixed;
   display: flex;
   justify-content: right;
   width: 100vw;
   height: 100vh;
   top: 0;
   left: 0;
   background-color: rgba(0, 0, 0, 0.6);
   .discount-form {
      display: flex;
      flex-direction: column;
      max-width: 300px;
      min-width: 300px;
      margin: 10px;
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      height: 500px;
   }

   label {
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
   }

   span {
      margin-bottom: 5px;
   }

   input,
   select {
      padding: 8px;
      font-size: 14px;
      width: 100%;
      box-sizing: border-box;
      border-radius: 5px;
   }

   select {
      cursor: pointer;
   }

   input:focus,
   select:focus {
      outline: 2px solid #2d9ae1;
   }

   input[type='submit']:hover {
      background-color: #2d9ae1;
      color: white;
   }

   input[type='submit'] {
      margin-top: 10px;
      padding: 10px;
      cursor: pointer;
      background-color: #2d9ae1;
      color: white;
      border: none;
   }
   .button-container {
      display: flex;
      justify-content: flex-start;
      margin-top: 10px;
   }

   .button-container button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border: none;
      border-radius: 5px;
   }

   .button-container button:nth-child(1) {
      margin: 10px;
      background-color: #3498db;
      color: #fff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
   }

   .button-container button:nth-child(2) {
      margin: 10px;

      background-color: #e74c3c;
      color: #fff;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
   }

   .button-container button:hover {
      opacity: 0.9;
   }
`;
