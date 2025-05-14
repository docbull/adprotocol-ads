import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

const Coupang = ({ category }) => {
    const [ items, setItems ] = useState([]);

    // 베스트 상품을 받아서 화면에 띄움
    useEffect(() => {
        fetch(`/.netlify/functions/coupang`, {
            method: "POST",
            body: JSON.stringify({ category: category }),
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            setItems(data.items);
        })
        .catch(console.error);
    }, [category]);

    return (
        <AdWrapper>
            {items.map((item) => (
                <>
                    <img src={item.productImage} />
                    <div> {item.productName} </div>
                 </>
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