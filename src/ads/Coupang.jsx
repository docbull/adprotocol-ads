import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";


// 반응형
// 기본 3개, 600px 이하일 때 2개, 
// 모바일(400px 이하)에서 디자인 2 적용

const Coupang = ({ category }) => {
    const [ isMobile, setIsMobile ] = useState(false);
    const [ items, setItems ] = useState([]);

    // 베스트 상품을 받아서 화면에 띄움
    useEffect(() => {
        var start = Date.now();
        fetch(`https://cool-pony-c67e5b.netlify.app/.netlify/functions/coupang`, {
            method: "POST",
            body: JSON.stringify({ category: category }),
        })
        .then(res => res.json())
        .then(data => {
            const iframeWidth = Number(document.body.scrollWidth);
            console.log(iframeWidth <= 400);

            console.log("Netlify latency:", Date.now() - start);

            if (iframeWidth <= 400) {
                setIsMobile(true);
                setItems(data.items);
            } else if (iframeWidth <= 600) {
                // show only 2 items...
                setItems(data.items);
            } else {
                setItems(data.items);
            }
        })
        .catch(console.error);

        const sendHeight = () => {
            const height = document.body.scrollHeight;

            // find parents til no more parent
            window.parent.parent.postMessage({ type: "ladder-ad-height", height }, "*");
            // window.parent.postMessage({ type: "ladder-ad-height", height }, "*");
        }

        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);

        new ResizeObserver(sendHeight).observe(document.body);
    }, [category]);

    const coupangClickEvent = (url) => {
        // 어떤 상품을 클릭했는지 기록
        // 기록 데이터: 광고 위치, 광고 카테고리, 광고 ID, 

        window.open(url, "_blank");
    }

    const testClick = () => {
        console.log(document.body.scrollWidth);
    }

    return (
        // <div style={{width: "40%"}}>
        <AdWrapper>
            {items.map((item, idx) => (
                !isMobile ? 
                    <CoupangItemWrapper key={idx}>
                        <CoupangImageWrapper> 
                            <CoupangImage src={item.productImage} />
                            <CoupangShippingWrapper>
                                {item.isFreeShipping ? <CoupangFreeShipping> 무료배송 </CoupangFreeShipping> : <></>}
                                {item.isRocket ? <CoupangRocketShipping> 빠른배송 </CoupangRocketShipping> : <></>}
                            </CoupangShippingWrapper>
                        </CoupangImageWrapper>
                        <CoupangDescription>
                            <CoupangItemName> {item.productName} </CoupangItemName>
                            <CoupangItemName>  ₩{item.productPrice.toLocaleString()} </CoupangItemName>
                            {/* <CoupangShippingWrapper>
                                {item.isFreeShipping ? <CoupangFreeShipping> 무료배송 </CoupangFreeShipping> : <></>}
                                {item.isRocket ? <CoupangRocketShipping> 빠른배송 </CoupangRocketShipping> : <></>}
                            </CoupangShippingWrapper> */}
                            <CoupangSeeDetails onClick={() => coupangClickEvent(item.productUrl)}> 지금 보러가기 </CoupangSeeDetails>
                        </CoupangDescription>
                    </CoupangItemWrapper>
                :
                    <CoupangItemWrapperMobile key={idx}>
                        asfasdf
                    </CoupangItemWrapperMobile>
            ))}
            <div onClick={testClick} style={{position: "absolute", bottom: "0"}}>BUTTON</div>
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
    width: 200px;
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
    position: relative;

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
    margin: 0.2rem 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    white-space: no-wrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 1.1rem;
`;

const CoupangShippingWrapper = styled.div`
    position: absolute;
    top: 0;
    // bottom: 0;
    // right: 0;

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

    font-size: 0.9rem;

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
    padding: 0.5rem;
    background: #3878F2;
    color: white;

    &:hover {
        cursor: pointer;
    }
`;

const CoupangItemWrapperMobile = styled.div`

`;