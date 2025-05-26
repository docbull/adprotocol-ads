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
                                {item.isFreeShipping ? <CoupangFreeShipping> 무료<br></br>배송 </CoupangFreeShipping> : <></>}
                                {item.isRocket ? <CoupangRocketShipping> 로켓<br></br>배송 </CoupangRocketShipping> : <></>}
                            </CoupangShippingWrapper>
                        </CoupangImageWrapper>
                        <CoupangDescription>
                            <CoupangItemName> {item.productName} </CoupangItemName>
                            <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                                <div style={{display: "flex", alignItems: "center"}}> <CoupangItemName>  ₩{item.productPrice.toLocaleString()} </CoupangItemName> </div>
                                {/* <CoupangSeeDetails2 onClick={() => coupangClickEvent(item.productUrl)}> 자세히 → </CoupangSeeDetails2> */}
                            </div>
                            {/* <CoupangItemName>  ₩{item.productPrice.toLocaleString()} </CoupangItemName> */}
                            <CoupangSeeDetails onClick={() => coupangClickEvent(item.productUrl)}> 지금 보러가기 </CoupangSeeDetails>
                        </CoupangDescription>
                    </CoupangItemWrapper>
                :
                    // show item lists with slides
                    <CoupangItemWrapperMobile key={idx}>
                        모바일 슬라이드 형식; 아이템은 하나씩 자동 슬라이드 설정
                    </CoupangItemWrapperMobile>
            ))}

            {/* <div>
                Coupang...
            </div> */}
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

    display: flex;
    flex-direction: column;
    margin: 0 20px;

    border-radius: 10px;
    filter: drop-shadow(0 0 0.25em lightgray);
    background: white;

    overflow: hidden;

    transition: ease-in-out 0.2s;

    &:hover {
        img {
            transform: scale(1.05);
            transition: ease-in-out 0.2s;
        }
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        transition: ease-in-out 0.2s;
    }
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

    transition: ease-in-out 0.2s;
`;

const CoupangDescription = styled.div`
    display: flex;
    flex-direction: column;

    padding: 0.5rem 1rem;
`;

const CoupangItemName = styled.span`
    margin: 0.2rem 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    white-space: no-wrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 0.9rem;
`;

const CoupangShippingWrapper = styled.div`
    position: absolute;
    top: 0;
    // bottom: 0;
    // right: 0;

    display: flex;

    margin: 0.3rem;
`;

const CoupangFreeShipping = styled.div`
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    padding: 0.5rem;

    font-size: 0.8rem;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #3878F2;
    color: white;
`;

const CoupangRocketShipping = styled.div`
    width: 1.8rem;
    height: 1.8rem;
    border-radius: 50%;
    padding: 0.5rem;

    font-size: 0.8rem;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #EAF3FE;
    color: #3A7AF4;
`;

const CoupangSeeDetails = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 0.9rem;

    margin-top: 0.3rem;

    border-radius: 10px;
    padding: 0.35rem;
    background: #3878F2;
    color: white;

    &:hover {
        cursor: pointer;
    }
`;

const CoupangSeeDetails2 = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 0.9rem;

    // margin-top: 0.3rem;

    border-radius: 10px;
    padding: 0.35rem;
    background: #3878F2;
    color: white;

    &:hover {
        cursor: pointer;
    }
`;

const CoupangItemWrapperMobile = styled.div`

`;