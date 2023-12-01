import React, { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';
import {
   addCategory,
   updateCategory,
   getCategory,
   addFile
} from '../../Axios/web';
import processApiImagePath from '../../Helper/EditLinkImage';
import { VscLoading } from 'react-icons/vsc';
import { ToastContainer, toast } from 'react-toastify';

///Phân biệt Update và Create bằng : nếu có categoryId thì là Update
export const AddCategory = ({
   setIsOpenAddCategory,
   setCategoryId,
   categoryId,
}) => {
   const [category, setCategory] = useState({ name: ''});
   const [loading, setLoading] = useState(false);
   const [file, setFile] = useState();
   const [url, setUrl] = useState();
   const handleChange = (e) => {
      const { name, value } = e.target;
      setCategory({ ...category, [name]: value });
   };
   useEffect(() => {
      if (categoryId !== null) {
         console.log("fetch");
         fetchCategoryById();
      }
   }, []);
   const handleChangeImage = (e) => {
      const file = e.target.files[0];
      console.log("icon", file);
      setFile(file);
      setUrl(URL.createObjectURL(file));
   };
   const fetchCategoryById = async () => {
      const data = await getCategory(categoryId);
      if (data?.status) {
         if (JSON.stringify(data.result.productCategory) !== JSON.stringify(category)) {
            setCategory(data.result.productCategory);
         }
      }
      
   };
   const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = {};
      formData.name = category.name;
      formData.icon = category.icon;
      formData.active = category.active;
      if(file){
         let fD = new FormData();
         fD.append('files', file);
         const res = await addFile(fD);
         console.log("idFile:",res);
         formData.icon = res.result.data?.data[0].id;
      }
      console.log("fD",formData);
      setLoading(true);
      let data;
      if (categoryId === null) {
         formData.active = true;
         data = await addCategory(formData);
         console.log('data', data);
      } else {
         console.log('idCate', category.id);
         console.log('idCate1', categoryId);
         formData.id= category.id;
         data = await updateCategory(formData);
         console.log('data', data);
      }

      if (data?.status) {
         toast.info('Thao tác thành công', {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 1000,
         });
      } else {
         toast.error(`${data.result}`, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
         });
      }

      setLoading(false);
   };
   return (
      <Container>
         <ToastContainer />
         <form>
            <span
               className="close-button"
               onClick={() => {
                  setIsOpenAddCategory(false);
                  setCategoryId(null);
               }}
            >
               <MdClose />
            </span>
            <input
               type="text"
               placeholder="Name Category"
               name="name"
               value={category?.name}
               onChange={handleChange}
            />
            <div className="input-container">
               <input type="file" name="image" onChange={handleChangeImage} />
               {file?<img src={url}/>
               :<img
                  src={processApiImagePath(category.icon) || category.icon}
                  alt=""
               />}
            </div>

            <div className="select-wrapper">
               <label>Status</label>
               <select>
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
               </select>
            </div>
            <button onClick={(e) => handleSubmit(e)}>
               <span>{categoryId === null ? 'Create' : 'Update'}</span>
               {loading ? (
                  <span className="loading-icons">
                     <VscLoading />
                  </span>
               ) : null}
            </button>
         </form>
      </Container>
   );
};

const Container = styled.div`
   display: flex;
   justify-content: flex-end;
   position: fixed;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   z-index: 2;
   background-color: rgba(204, 204, 204, 0.5);

   form {
      background-color: white;
      padding: 20px;
      border-radius: 5px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      width: 80%;
      max-width: 400px;
      display: flex;
      flex-direction: column;
      animation: slide 0.2s linear;
      position: relative;
      @keyframes slide {
         from {
            transform: translate(100%);
         }
         to {
            transform: translate(0%);
         }
      }
      .close-button {
         position: absolute;
         top: 0;
         right: 0;
         padding: 5px;
         color: red;
      }

      input {
         margin-bottom: 10px;
         padding: 10px;
         border: 1px solid #ccc;
         border-radius: 5px;
      }
      .input-container {
         display: flex;
         flex-direction: row;
      }
      .input-container img {
         width: 50px;
         height: 50px;
         object-fit: contain;
         max-width: 100%;
         max-height: 100%;
      }
      .input-container input {
         flex: 1;
         margin-right: 10px;
      }

      label {
         margin-bottom: 5px;
      }

      .select-wrapper {
         margin-bottom: 10px;

         select {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            width: 100%;
         }
      }

      button {
         background-color: #007bff;
         color: white;
         border: none;
         padding: 10px;
         border-radius: 5px;
         cursor: pointer;
      }
      .loading-icons {
         margin-left: 10px;
      }
      .loading-icons svg {
         animation: spin 2s linear infinite;
      }
   }
`;

export default AddCategory;
