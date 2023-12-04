import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from './Image';
import { getListCategory } from '../../Axios/web';
import { useStateProvider } from '../../StateProvider/StateProvider';
import { reducerCases } from '../../StateProvider/reducer';
const Controller = () => {
   const [{ category }, dispatch] = useStateProvider();
   useEffect(() => {
      const fetchData = async () => {
         const data = await getListCategory({ index: 4, page: 1 });
         if (data?.status) {
            if (
               JSON.stringify(data.result.productCategory) !=
               JSON.stringify(category)
            ) {
               dispatch({
                  type: reducerCases.SET_CATEGORY,
                  category: data.result.productCategory,
               });
            }
         }
      };
      fetchData();
   }, [category]);

   return (
      <Container>
         {category?.map(({ icon, imageReplace, name, id }, index) => (
            <div className="image" key={index}>
               <Image
                  id_image={id}
                  src={icon}
                  message={name}
                  replace={imageReplace}
                  key={index}
                  key_name={index}
               ></Image>
            </div>
         ))}
      </Container>
   );
};
const Container = styled.div`
   display: flex;
   justify-content: center;
   align-items: center;
   flex-wrap: wrap;
   height: auto;
   border-top: 1px solid #cccccc;
   border-bottom: 1px solid #cccccc;
   * {
      user-select: none;
   }
   .image {
      height: 100px;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      &:not(:last-child) {
         border-right: 1px solid #eeeeee;
      }
   }

   @media screen and (max-width: 756px) {
      .image {
         border: none;
         margin: auto;
         min-width: 50%;
      }
      .image:not(:last-child) {
         border-right: none;
      }
   }
`;

export default Controller;
