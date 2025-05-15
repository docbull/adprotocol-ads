import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

const Coupang = ({ category }) => {
    const [ items, setItems ] = useState([]);

    // 베스트 상품을 받아서 화면에 띄움
    useEffect(() => {
        const c =  category !== undefined ? category : 1001;

        fetch(`/.netlify/functions/coupang`, {
            method: "POST",
            body: JSON.stringify({ category: category }),
            // mode: "no-cors",
            // body: JSON.stringify({ category: '1002' }),
        })
        .then(res => res.json())
        .then(data => {
            setItems(data.items);
        })
        .catch(console.error);
    }, [category]);

    return (
        <AdWrapper>
            {items.map((item) => (
                <CoupangItemWrapper>
                    <CoupangImage src={item.productImage} />
                    <div> {item.productName} </div>
                 </CoupangItemWrapper>
            ))}
        </AdWrapper>
    );
};

export default Coupang;

const AdWrapper = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: white;
`;

const CoupangItemWrapper = styled.div`
    display: flex;
    flex-direction: column;

`;

const CoupangImage = styled.img`
    width: 50%;

`;