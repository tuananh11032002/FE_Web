import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
   addProduct,
   getListCategory,
   getProduct,
   updateProduct,
   addFile,
   deleteFile,
} from '../../Axios/web';
import { useStateProvider } from '../../StateProvider/StateProvider';
import { reducerCases } from '../../StateProvider/reducer';
import { IoRemoveCircleOutline } from 'react-icons/io5';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import processApiImagePath from '../../Helper/EditLinkImage';
import ProcessDate from '../../Helper/ProcessDate';
import { add } from 'date-fns';
export const AddProduct = () => {
   const [{ category }, dispatch] = useStateProvider();
   const imageInputRef = useRef(null);
   const [selectedImage, setSelectedImage] = useState([]);
   const [selectedCategory, setSelectedCategory] = useState();
   const { id } = useParams();
   const [dataCategory, setDataCategory] = useState([
      'Electric',
      'Household',
      'Shoes',
   ]);
   const [options, setOptions] = useState([{ type: '', value: '' }]);
   const [price, setPrice] = useState(0);
   const [discountPrice, setDiscountPrice] = useState(0);
   const [productEdit, setProductEdit] = useState();
   const [inputName, setInputName] = useState('');
   const [description, setDescription] = useState('');
   const [calcTax, setCalcTax] = useState(false);
   const [imageLink, setImageLink] = useState([]);
   const [soLuongThem, setSoLuongThem] = useState(0);
   const [isLoading, setIsLoading] = useState(false);
   const [selectedStatus, setSelectedStatus] = useState(null);
   const navigate = useNavigate();
   console.log(selectedStatus, 'status');
   const handleAddOption = () => {
      setOptions([...options, { type: '', value: '' }]);
   };

   const hanldeRemoveImageLink = async (e, index) => {
      e.stopPropagation();
      const imageFilter = imageLink.filter((image, i) => i !== index);
      setImageLink(imageFilter);
      await deleteFile(imageLink[index]);
   };

   const handRemoveImageLocal = (e, index) => {
      e.stopPropagation();
      if (selectedImage) {
         const imageFilter = selectedImage.filter((image, i) => i !== index);
         setSelectedImage(imageFilter);
      }
   };
   const handleDelOption = (index) => {
      const newOption = options?.filter(
         (temp, indexTemp) => index !== indexTemp
      );
      if (newOption.length > 0) {
         setOptions(newOption);
      }
   };

   const handleTypeChange = (index, event) => {
      const updatedOptions = [...options];
      updatedOptions[index].type = event.target.value;
      setOptions(updatedOptions);
   };

   const handleValueChange = (index, event) => {
      const updatedOptions = [...options];
      updatedOptions[index].value = event.target.value;
      setOptions(updatedOptions);
   };

   const handleBrowseImageClick = () => {
      if (imageInputRef.current) {
         imageInputRef.current.click();
      }
   };
   const handleImageChange = (event) => {
      const file = event.target.files[0];
      const test = event.target.files;
      console.log(file, 'fil');
      if (file) {
         setSelectedImage([...selectedImage, file]);
      }
   };
   const handleDrop = (event) => {
      event.preventDefault();

      const files = event.dataTransfer.files;
      if (files.length > 0) {
         const newImages = Array.from(files);
         setSelectedImage([...selectedImage, ...newImages]);
      }
   };

   const handleDragOver = (event) => {
      event.preventDefault();
   };
   const addFiles = async () => {
      let idFiles = [];
      if (selectedImage.length > 0) {
         await Promise.all(
            selectedImage.map(async (item) => {
               let fD = new FormData();
               fD.append('files', item);
               const res = await addFile(fD);
               console.log(res, 'res');
               const tem = res.result.data?.data.map((item) => item.id);
               idFiles = [...idFiles, ...tem];
            })
         );
      }
      return idFiles;
   };
   //function call update api
   const handleSubmit = async () => {
      const formData = {};
      formData.name = inputName;
      formData.category = [selectedCategory];
      formData.decription = description;
      formData.discount = discountPrice;
      formData.unitPrice = price;
      formData.totalItem = productEdit
         ? parseInt(productEdit.totalItem) + parseInt(soLuongThem)
         : parseInt(soLuongThem);
      formData.status = selectedStatus === 'Active' ? true : false;
      let idFiles = await addFiles();
      setIsLoading(true);
      let data;
      if (id !== 'add') {
         formData.files =
            imageLink.length > 0 ? [...imageLink, ...idFiles] : idFiles;
         formData.mainFile = formData?.files[0];
         formData.id = id;
         data = await updateProduct(formData);
         console.log('dataUP', data);

         if (data?.status) {
            setSelectedImage([]);
            setSoLuongThem(0);
         }
      } else {
         formData.files = idFiles;
         formData.mainFile = idFiles[0];
         data = await addProduct(formData);
      }
      setIsLoading(false);
      console.log(data);
      if (data?.status) {
         if (id !== 'add') {
            setProductEdit({});
         } else {
            navigate(`/admin/add-product/${data.result.id}`);
         }
      }
   };
   useEffect(() => {
      const fetchCategory = async () => {
         //console.log(category.length);
         const categoryTemp = await getListCategory({ index: 4, page: 1 });
         setSelectedCategory(category[0]?.id);

         if (categoryTemp?.status) {
            if (
               JSON.stringify(categoryTemp.result.productCategory) !==
               JSON.stringify(category)
            ) {
               console.log(categoryTemp, 'temps');
               setSelectedCategory(categoryTemp.result.productCategory[0]?.id);
               dispatch({
                  type: reducerCases.SET_CATEGORY,
                  category: categoryTemp.result.productCategory,
               });
            }
         }
      };
      fetchCategory();
   }, []);

   useEffect(() => {
      const fetchProduct = async () => {
         if (id !== 'add') {
            const productTemp = await getProduct(id);
            console.log('productTemp', productTemp);
            if (productTemp?.status === true) {
               setImageLink(productTemp.result.product.files);
               setInputName(productTemp.result.product.name);
               setPrice(productTemp.result.product.unitPrice);
               setDiscountPrice(productTemp.result.product.discount);
               setDescription(productTemp.result.product.decription);
               setSelectedCategory(productTemp.result.product?.category[0]?.id);
               setSelectedStatus(productTemp.result.product.status);
               if (
                  JSON.stringify(productTemp.result.product) !==
                  JSON.stringify(productEdit)
               ) {
                  setProductEdit(productTemp.result.product);
               }
            }
         }
      };
      fetchProduct();
   }, [productEdit]);
   return (
      <Container>
         {isLoading ? (
            <div className="loading">
               <AiOutlineLoading3Quarters />
            </div>
         ) : null}
         <div className="header-add">
            <div className="left-content">
               <div className="bold-text">Add a new Product</div>
               Orders placed across your store
            </div>
            <div className="right-content">
               <button
                  className="publish-button"
                  onClick={() => handleSubmit()}
               >
                  {id === 'add' ? 'PUBLISH' : 'UPDATE'} PRODUCT
               </button>
            </div>
         </div>
         <div className="content">
            <div className="card">
               <div className="product">
                  <div className="card-header">PRODUCT INFORMATION</div>
                  <div className="card-body">
                     <div>
                        <input
                           type="text"
                           placeholder="Name"
                           value={inputName}
                           onChange={(e) => setInputName(e.target.value)}
                        />
                     </div>
                     <div>
                        <input
                           type="text"
                           className="col"
                           placeholder="Description"
                           value={description}
                           onChange={(e) => setDescription(e.target.value)}
                        />
                        <select
                           className="col"
                           value={selectedCategory}
                           onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                           {category?.map((data, index) => (
                              <option key={index} value={data?.id}>
                                 {data.name}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>
               </div>
               <div className="media">
                  <div className="card-header">Media</div>
                  <div className="card-body">
                     <div>
                        <input
                           type="file"
                           id="imageInput"
                           ref={imageInputRef}
                           style={{ display: 'none' }}
                           accept="image/*"
                           onChange={(e) => handleImageChange(e)}
                        />
                        <form
                           action=""
                           className="dropzone"
                           onDrop={handleDrop}
                           onDragOver={handleDragOver}
                        >
                           <div
                              className="dropzone-div"
                              onClick={() => handleBrowseImageClick()}
                           >
                              <div className="image-list">
                                 Ảnh hiện tại: {imageLink.length}
                                 {imageLink?.map((im, index) => (
                                    <div className="image">
                                       <img
                                          src={processApiImagePath(im)}
                                          alt="Selected"
                                       />
                                       <div className="remove-image">
                                          <span style={{ fontSize: '10px' }}>
                                             Ảnh hiện tại
                                          </span>
                                          <IoRemoveCircleOutline
                                             onClick={(e) => {
                                                hanldeRemoveImageLink(e, index);
                                             }}
                                          />
                                       </div>
                                    </div>
                                 ))}
                              </div>
                              {selectedImage.length > 0 ? (
                                 <div className="image-list">
                                    Ảnh thêm: {selectedImage.length}
                                    {selectedImage?.map((image, index) => (
                                       <div className="image" key={index}>
                                          <img
                                             src={URL.createObjectURL(image)}
                                             alt="Selected"
                                          />
                                          <div className="remove-image">
                                             <span style={{ fontSize: '10px' }}>
                                                Ảnh thêm
                                             </span>
                                             <IoRemoveCircleOutline
                                                onClick={(e) =>
                                                   handRemoveImageLocal(
                                                      e,
                                                      index
                                                   )
                                                }
                                             />
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              ) : (
                                 <>
                                    <div
                                       style={{
                                          fontSize: '24px',
                                          textAlign: 'center',
                                       }}
                                    >
                                       Drag and drop your image here
                                    </div>
                                    <small className="">or</small>
                                    <span className="btn" id="btnBrowse">
                                       Browse image
                                    </span>
                                 </>
                              )}
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
               {/* <div className="option">
                  <div className="card-header">Option</div>
                  <div className="card-body">
                     {options.map((option, index) => (
                        <div key={index} className="input-row">
                           <select
                              value={option.type}
                              onChange={(e) => handleTypeChange(index, e)}
                           >
                              <option value="">Chọn loại</option>
                              <option value="size">Size</option>
                              <option value="color">Color</option>
                           </select>
                           <input
                              type="text"
                              placeholder="Value"
                              value={option.value}
                              onChange={(e) => handleValueChange(index, e)}
                           />
                           <span
                              className="custom-span"
                              onClick={() => handleDelOption(index)}
                           >
                              Xóa
                           </span>
                        </div>
                     ))}
                     <button
                        className="add-option-button"
                        onClick={() => handleAddOption()}
                     >
                        Thêm Option
                     </button>
                  </div>
               </div> */}

               <div className="status">
                  <div className="card-header">Status</div>
                  <div className="card-body">
                     <div className="input-row">
                        <select
                           value={selectedStatus}
                           onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                           <option value="">Chọn trạng thái</option>
                           <option value="Active">Active</option>
                           <option value="Inactive">Inactive</option>
                        </select>
                     </div>
                  </div>
               </div>
               <div className="quantity">
                  <div className="card-header">QUANTITY</div>
                  <div className="card-body">
                     <div className="input-row ">
                        <label htmlFor="">Nhập số lượng cần thêm : </label>
                        <input
                           type="number"
                           placeholder="Nhập số lượng cần thêm"
                           value={soLuongThem}
                           onChange={(e) => setSoLuongThem(e.target.value)}
                        />
                     </div>
                     {console.log('pe', productEdit)}
                     <div className="product-info">
                        <p>Sản phẩm đang có: {productEdit?.totalItem}</p>
                        {/* <p>
                           Thời gian cập nhật cuối:
                           {ProcessDate(productEdit?.createAt)}
                        </p> */}
                        <p>Tổng sản phẩm đã bán: {productEdit?.totalSold}</p>
                     </div>
                  </div>
               </div>
            </div>
            <div className="card price">
               <div className="card-header">PRICE INFORMATION</div>
               <div className="card-body">
                  <div className="input-container">
                     <label>Price</label>
                     <input
                        type="text"
                        placeholder="Best Price"
                        className="price-input"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                     />
                  </div>
                  <div className="input-container">
                     <label>Discount Price</label>

                     <input
                        type="text"
                        placeholder="Discounted Price"
                        className="price-input"
                        value={discountPrice}
                        onChange={(e) => setDiscountPrice(e.target.value)}
                     />
                  </div>
                  <div className="">
                     <div>
                        <input
                           type="checkbox"
                           className="calculate-button"
                           onChange={(e) => setCalcTax(e.target.checked)}
                        />
                        &nbsp;Tính thuế cho sản phẩm này
                     </div>
                     {calcTax ? (
                        <div>
                           Thuế của sản phẩm tính ra là:{' '}
                           {((price * 8) / 100).toLocaleString()}đ
                        </div>
                     ) : null}
                  </div>
               </div>
            </div>
         </div>
      </Container>
   );
};
const Container = styled.div`
   .header-add {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: white;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

      .left-content {
         display: flex;
         flex-direction: column;
      }

      .bold-text {
         font-size: 24px;
         font-weight: bold;
      }

      .publish-button {
         background-color: #3399ff;
         color: white;
         border: none;
         padding: 10px 20px;
         border-radius: 5px;
      }
   }
   .content {
      display: flex;
      flex-wrap: wrap;
      .card {
         flex: 2;
         box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
      }
      .card-header {
         font-weight: bold;
         width: 100%;
      }
      .card-body {
         padding: 0 20px 20px 20px;
         margin: 10px 0;
         width: 100%;
      }

      .product {
         display: flex;
         flex-direction: column;

         .card-body {
            display: flex;
            flex-direction: column;
            gap: 10px;
         }

         .card-body > div {
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
         }

         .card-body input[type='text'] {
            padding: 5px;
            width: 100%;
         }
         .col {
            width: 50%;
         }
         .card-body select {
            padding: 5px;
         }

         .col {
            margin-right: 10px; /* Khoảng cách giữa input và select */
         }
      }

      .price {
         background-color: white;
         display: flex;
         flex-direction: column;
         align-items: flex-start;
         justify-content: flex-start;
         border-radius: 5px;
         flex: 1;
         box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

         .card-body {
            background-color: white;
            display: flex;
            flex-direction: column;
            gap: 10px;
         }
         .input-container {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
            margin-bottom: 10px;
         }
         .input-container input {
            width: 100%;
         }
         .input-container label {
            font-weight: bold;
            color: blue;
         }
      }

      .dropzone {
         border: 2px dashed #e7e7e8;
         border-radius: 0.375rem;
         .dropzone-div {
            font-size: 2.25rem;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            padding: 1.25rem;
         }
         .dropzone-div .image-list {
            display: flex;
         }
         .dropzone-div .image-list {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
         }
         .dropzone-div .image-list .remove-image {
            position: absolute;
            top: -2px;
            right: 5px;
            transform: scale(1.25);
         }
         .dropzone-div .image {
            max-width: 25%;
            max-height: 25%;
         }

         .dropzone-div .image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border: 1px solid #ccc;
            border-radius: 5px;
         }
         .btn {
            color: #9055fd;
            border-color: #c8aafe;
            cursor: hover;
            font-weight: 500;
         }
      }
      .option,
      .status {
         display: flex;
         flex-direction: column;
         align-items: flex-start;

         .input-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            margin-bottom: 10px;
            .custom-span {
               font-weight: bold;
               font-size: 16px;
               color: #ff0000;
               text-decoration: underline;
               cursor: pointer;
            }

            .custom-span:hover {
               color: #cc0000;
            }
            select,
            input {
               width: 40%;
            }
         }

         .add-option-button {
            max-width: 200px;
            width: 100%;
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #3498db;
            color: #fff;
            border: none;
            border-radius: 15px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
         }

         .add-option-button:hover {
            background-color: #2980b9;
            transform: scale(1.025);
         }
      }
      .quantity {
         display: flex;
         flex-direction: column;
         align-items: flex-start;

         .input-row {
            display: flex;
            flex-direction: row;
            width: 100%;
            margin-bottom: 10px;
            align-items: center;
            flex-wrap: wrap;
         }
         label {
            margin-right: 10px;
         }
         input {
            width: 45%;
         }

         .button-container {
            text-align: center;
            width: 50%;
         }

         button {
            background-color: #2ecc71;
            color: #ffffff;
            padding: 10px;
            border: none;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: background-color 0.3s;
         }

         button:hover {
            background-color: #27ae60;
         }

         .product-info {
            margin-top: 20px;
         }

         .product-info p {
            margin: 5px 0;
         }
      }

      @media screen and (max-width: 1000px) {
         .card {
            min-width: 95%;
            margin-bottom: 20px;
         }
         .quantity .input-row {
            label {
               min-width: 100%;
            }
            input {
               width: 100%;
            }
         }
      }
   }

   button {
      border-radius: 5px;
   }
   input {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f8f8f8;
      color: #333;
      font-size: 16px;
   }
   select {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 5px;
      background-color: #f8f8f8;
      color: #333;
      font-size: 16px;
      appearance: none;
   }

   select:focus {
      background-color: #fff;
      outline: none;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
   }
   select:hover {
      background-color: #f0f0f0;
   }
`;
