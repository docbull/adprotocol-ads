import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

const Coupang = ({ category }) => {
    const [ items, setItems ] = useState([]);

    // 베스트 상품을 받아서 화면에 띄움
    useEffect(() => {
        fetch(`https://cool-pony-c67e5b.netlify.app/.netlify/functions/coupang`, {
            method: "POST",
            body: JSON.stringify({ category: category }),
        })
        .then(res => res.json())
        .then(data => {
            setItems(data.items);
        })
        .catch(console.error);

        const sendHeight = () => {
            const height = document.body.scrollHeight;
            console.log(height);
            window.parent.postMessage({ type: "ladder-ad-height", height }, "*");
        }

        // window.addEventListener("message", (e) => {
        //     if (e.data?.type === "heightRequest") {
        //         sendHeight();
        //     }
        // });

        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);

        new ResizeObserver(sendHeight).observe(document.body);
    }, [category]);

    const coupangClickEvent = (url) => {
        // 어떤 상품을 클릭했는지 기록
        // 기록 데이터: 광고 위치, 광고 카테고리, 광고 ID, 

        window.open(url, "_blank");
    }

    return (
        // <div style={{width: "40%"}}>
        <AdWrapper>
            {items.map((item, idx) => (
                <CoupangItemWrapper key={idx}>
                    <CoupangImageWrapper> 
                        <CoupangImage src={item.productImage} />
                    </CoupangImageWrapper>
                    <CoupangDescription>
                        <CoupangItemName> {item.productName} </CoupangItemName>
                        <CoupangItemName>  ₩{item.productPrice.toLocaleString()} </CoupangItemName>
                        <CoupangShippingWrapper>
                            {item.isFreeShipping ? <CoupangFreeShipping> 무료배송 </CoupangFreeShipping> : <></>}
                            {item.isRocket ? <CoupangRocketShipping> 빠른배송 </CoupangRocketShipping> : <></>}
                        </CoupangShippingWrapper>
                        <CoupangSeeDetails onClick={() => coupangClickEvent(item.productUrl)}> 지금 보러가기 </CoupangSeeDetails>
                    </CoupangDescription>
                 </CoupangItemWrapper>
            ))}
        </AdWrapper>
        // </div>
    );
};

export default Coupang;

const AdWrapper = styled.div`
    display: flex;
    justify-content: center;

    background: #fefefe;
    border-radius: 10px;
    padding: 10px;

    font-weight: bold;
`;

const CoupangItemWrapper = styled.div`
    width: 250px;
    // width: 15rem;
    // height: 365px;

    display: flex;
    flex-direction: column;
    margin: 0 10px;

    border-radius: 10px;
    filter: drop-shadow(0 0 0.25em lightgray);
    background: white;

    overflow: hidden;
`;

const CoupangImageWrapper = styled.div`
    // width: 100%;
    // height: 100%;
    dispaly: flex;
    justify-content: center;
    align-items: center;

    overflow: hidden;
`;

const CoupangImage = styled.img`
    width: 100%;
    // height: 100%;
    fit-content: cover;
`;

const CoupangDescription = styled.div`
    display: flex;
    flex-direction: column;

    padding: 0.5rem 1.3rem;
`;

const CoupangItemName = styled.span`
    margin: 0.3rem 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    white-space: no-wrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 1.15rem;
`;

const CoupangShippingWrapper = styled.div`
    display: flex;

    margin: 0.3rem 0;
`;

const CoupangFreeShipping = styled.div`
    border-radius: 5px;
    
    padding: 0.2rem 0.6rem;

    background: #3878F2;
    color: white;
`;

const CoupangRocketShipping = styled.div`
    border-radius: 7px;
    background: #EAF3FE;
    padding: 0.2rem 0.6rem;

    display: flex;
    align-items: center;
    justify-content: center;

    color: #3A7AF4;
`;

const CoupangSeeDetails = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    margin: 0.3rem 0;

    border-radius: 10px;
    padding: 0.7rem;
    background: #3878F2;
    color: white;

    &:hover {
        cursor: pointer;
    }
`;