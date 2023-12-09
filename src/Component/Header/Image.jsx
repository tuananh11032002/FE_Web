import React, { useState } from 'react';
import styled from 'styled-components';
//import { useNavigate } from 'react-router-dom';
import processApiImagePath from '../../Helper/EditLinkImage';
const Image = ({ src, message, key_name, id_image }) => {
   const [IsOver, setIsOver] = useState(false);
   const handleMouseOver = () => {
      setIsOver(true);
   };
   //const navigator = useNavigate();
   const handleMouseOut = () => {
      setIsOver(false);
   };
   // const handlerClick = async (id) => {
   //    navigator(`/collections/${id}`);
   // };
   return (
      <Container>
         <img
            src={processApiImagePath(src)}
            id={`image${key_name}`}
            alt={message}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            // onClick={() => {
            //    handlerClick(id_image);
            // }}
            style={
               IsOver
                  ? { backgroundColor: '#D3D3D3' }
                  : { backgroundColor: 'rgba(255,255,255)' }
            }
         />
         <div>{message}</div>
      </Container>
   );
};

const Container = styled.div`
   max-height: 82px;
   max-width: 200px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-items: center;
   text-align: center;
   cursor: pointer;
   @media screen and (max-width: 756px) {
      height: 4rem;
   }
   span {
   }

   img {
      min-height: 60px;

      min-width: 60px;
   }
`;

export default Image;
