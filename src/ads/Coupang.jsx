import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

const Coupang = ({ category }) => {
    const [ items, setItems ] = useState([]);

    // 베스트 상품을 받아서 화면에 띄움
    useEffect(() => {
        const c =  category !== undefined ? category : 1001;

        fetch(`https://cool-pony-c67e5b.netlify.app/.netlify/functions/coupang`, {
            method: "POST",
            // body: JSON.stringify({ category: category }),
            // mode: "no-cors",
            body: JSON.stringify({ category: '1002' }),
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.items);
            setItems(data.items);
        })
        .catch(console.error);
    }, [category]);

    const coupangClickEvent = (url) => {
        console.log(url);
    }

    return (
        <AdWrapper>
            {items.map((item, idx) => (
                <CoupangItemWrapper key={idx}>
                    <CoupangImage src={item.productImage} />
                    <CoupangDescription>
                        <CoupangItemName> {item.productName} </CoupangItemName>
                        <CoupangItemName>  {item.productPrice} </CoupangItemName>
                        <div style={{margin: "5px 0"}}>
                            {item.isFreeShipping ? <CoupangFreeShipping> 무료배송 </CoupangFreeShipping> : <></>}
                            {item.isRocket ? <CoupangRocketShipping> 빠른배송 </CoupangRocketShipping> : <></>}
                        </div>
                        {/* {item.isFreeShipping ? <CoupangFreeShipping> 무료배송 </CoupangFreeShipping> : <></>}
                        {item.isRocket ? <CoupangRocketShipping> 빠른배송 </CoupangRocketShipping> : <></>} */}
                        <CoupangSeeDetails onClick={() => coupangClickEvent(item.productUrl)}> 지금 보러가기 </CoupangSeeDetails>
                    </CoupangDescription>
                 </CoupangItemWrapper>
            ))}
        </AdWrapper>
    );
};

export default Coupang;

const AdWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    background: #fefefe;
    border-radius: 10px;
    padding: 10px;

    font-weight: bold;
`;

const CoupangItemWrapper = styled.div`
    width: 200px;

    display: flex;
    flex-direction: column;

    border-radius: 10px;
    filter: drop-shadow(0 0 0.25em lightgray);
    background: white;

    overflow: hidden;
`;

const CoupangImage = styled.img`
    fit-content: contain;
`;

const CoupangDescription = styled.div`
    display: flex;
    flex-direction: column;

    padding: 10px;
`;

const CoupangItemName = styled.span`
    margin: 5px 0;
`;

const CoupangFreeShipping = styled.div`
    border-radius: 5px;
    
`;

const CoupangRocketShipping = styled.div`
    border-radius: 7px;
    background: #EAF3FE;
    padding: 2px;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #3A7AF4;
`;

const CoupangSeeDetails = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 5px 0;

    border-radius: 10px;
    padding: 10px;
    background: #3878F2;
    color: white;

    &:hover {
        cursor: pointer;
    }
`;