import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

const Coupang = () => {
    const query = new URLSearchParams(window.location.search);
    const items = JSON.parse(decodeURIComponent(query.get("items") || "[]"));

    // 베스트 상품을 받아서 화면에 띄움 
    useEffect(() => {
        console.log(items);
    }, []);

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