import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef, useCallback } from "react";
import Slider from "react-slick";
import { useLocation } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";

import { ReactComponent as NextSvg } from "../assets/next-button.svg";

const Coupang = ({ category }) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const content = params.get("content");
    const count = params.get("count");

    const [ categoryName, setCategoryName ] = useState("");

    const [ isMobile, setIsMobile ] = useState(false);
    const [ items, setItems ] = useState([]);

    const message = [
        "지금 확인하기 ✔️",
        "상품 보러 가기 👀",
        "바로 보러가기 →",
    ];

    const slickRef = useRef(null);
    const prev = useCallback(() => slickRef.current.slickPrev(), []);
    const next = useCallback(() => slickRef.current.slickNext(), []);

    var settings = {
        initialSlide: 0,
        arrows: false,
        // dots: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        appendDots: (dots) => (
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}
            >
                <ul> {dots} </ul>
            </div>
        )
    }

    useEffect(() => {
        if (category) {
            fetch(`https://cool-pony-c67e5b.netlify.app/.netlify/functions/coupang`, {
                method: "POST",
                body: JSON.stringify({
                    category: category,
                    content: content,
                    count: count,
                }),
            })
            .then(res => res.json())
            .then(data => {
                setItems(data.items);
            })
            .catch(console.error);
        }

        getCategoryName(category);

        const iframeWidth = Number(document.body.scrollWidth);
        if (iframeWidth <= 500) {
            setIsMobile(true);
        }

        const sendHeight = () => {
            const height = document.body.scrollHeight;

            // find parents til no more parent
            window.parent.parent.postMessage({ type: "ladder-ad-height", height }, "*");
        }

        window.addEventListener("load", sendHeight);
        window.addEventListener("resize", sendHeight);

        new ResizeObserver(sendHeight).observe(document.body);
    }, []);

    const getCategoryName = (category) => {
        if (category === 1001) {
            setCategoryName("요즘 가장 많이 찾는 스타일, 지금 바로 만나보세요 👗");
        } else if (category === 1002) {
            setCategoryName("매일 입는 옷, 지금 바꾸면 인상이 달라집니다 👕");
        } else if (category === 1010) {
            setCategoryName("리뷰 1위! 써본 사람만 아는 피부 변화 💄");
        } else if (category === 1011) {
            setCategoryName("엄마들이 먼저 고른 육아템, 하루가 달라져요");
        } else if (category === 1012) {
            setCategoryName("한 번 먹어본 사람은 꼭 재구매하는 식품들!");
        } else if (category === 1013) {
            setCategoryName("요리가 쉬워지는 마법, 주방 필수템 모음 🍳");
        } else if (category === 1014) {
            setCategoryName("사소한 생활템 하나로 하루가 훨씬 편해져요");
        } else if (category === 1015) {
            setCategoryName("공간 분위기를 바꾸는 한 가지 포인트 🛋️");
        } else if (category === 1016) {
            setCategoryName("성능·디자인 다 잡은 스마트템 모음 ⚡️");
        } else if (category === 1017) {
            setCategoryName("날씨 좋은 날, 이거 하나면 준비 끝 🏕️");
        } else if (category === 1018) {
            setCategoryName("드라이브를 바꿔줄 필수 차량 아이템");
        } else if (category === 1019) {
            setCategoryName("요즘 사람들이 가장 많이 찾는 콘텐츠는?");
        } else if (category === 1020) {
            setCategoryName("취미 생활에 필요한 용품 추천드려요!");
        } else if (category === 1021) {
            setCategoryName("일잘러가 몰래 쓰는 사무용품 리스트 ✍️");
        } else if (category === 1024) {
            setCategoryName("지금 가장 잘 나가는 건강템! 💪");
        } else if (category === 1025) {
            setCategoryName("떠나기 전에 꼭 챙겨야 할 국내여행 준비물 🧳");
        } else if (category === 1026) {
            setCategoryName("여행 고수들이 미리 챙기는 해외여행 필수템 ✈️");
        } else if (category === 1029) {
            setCategoryName("반려인이 인정한 리얼 꿀템 🐾");
        } else if (category === 1030) {
            setCategoryName("부모들이 먼저 사는 유아동 인기 패션 아이템 🧒👧");
        }
    }

    const coupangClickEvent = async (item) => {
        window.open(item.productUrl, "_blank");

        saveAdEffectiveness(item);
    }

    const saveAdEffectiveness = (item) => {
        try {
            const app = initializeApp({
                apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
                authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
                storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
                messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
                appId: process.env.REACT_APP_FIREBASE_APPID,
                measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
            });
            
            const firestore = getFirestore(app);

            addDoc(collection(firestore, "effectiveness"), {
                ad_id: content,
                location: count,
                category: category,
                product_id: item.productId,
            });
        } catch (err) {
            console.log(err);
        }
    }

    const clickScreenSize = () => {
        console.log(document.body.scrollHeight);

    }

    return (
        <CoupangWrapper>
            <CoupangCategoryComment>
                {categoryName}
            </CoupangCategoryComment>

            <AdWrapper>
                    {!isMobile ? 
                        items.map((item, idx) => (
                            <CoupangItemWrapper key={idx} onClick={() => coupangClickEvent(item)}>
                                <CoupangImageWrapper> 
                                    <CoupangImage src={item.productImage} />
                                    <CoupangShippingWrapper>
                                        {item.isFreeShipping ? <CoupangFreeShipping> 🎁 무료배송 </CoupangFreeShipping> : item.isRocket ? <CoupangRocketShipping2> 🚀 로켓배송 </CoupangRocketShipping2> : <></>}
                                    </CoupangShippingWrapper>
                                </CoupangImageWrapper>
                                <CoupangDescription>
                                    <CoupangItemName> {item.productName} </CoupangItemName>
                                    <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                                        <div style={{display: "flex", alignItems: "center"}}>
                                            <CoupangItemPrice>  ₩{item.productPrice.toLocaleString()} </CoupangItemPrice>
                                        </div>
                                    </div>
                                </CoupangDescription>
                                <CoupangSeeDetails> {message[idx]} </CoupangSeeDetails>
                            </CoupangItemWrapper>
                        ))
                    :
                    // show item lists with slides
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Slider {...settings} ref={slickRef}>
                            {items.map((item, idx) => {
                                return (
                                    <CoupangItemWrapperMobile key={idx} onClick={() => coupangClickEvent(item)}>
                                        <CoupangImageWrapper>
                                            <CoupangImage src={item.productImage} />
                                            <CoupangShippingWrapper>
                                                {item.isFreeShipping ? <CoupangFreeShipping> 🚚 무료배송 </CoupangFreeShipping> : item.isRocket ? <CoupangRocketShipping2> 🚀 로켓배송 </CoupangRocketShipping2> : <></>}
                                            </CoupangShippingWrapper>
                                        </CoupangImageWrapper>
                                        <CoupangDescription>
                                            <CoupangItemName className="ladder-mobile-text"> {item.productName} </CoupangItemName>
                                            <div style={{width: "100%", display: "flex", alignContent: "center"}}>
                                                <div style={{display: "flex", alignItems: "center"}}>
                                                    <CoupangItemPrice className="ladder-mobile-text">  {item.productPrice.toLocaleString()}<span>원</span> </CoupangItemPrice>
                                                </div>
                                            </div>
                                        </CoupangDescription>
                                        <CoupangSeeDetails onClick={() => coupangClickEvent(item)}> {message[idx]} </CoupangSeeDetails>
                                    </CoupangItemWrapperMobile>
                                )
                            })}
                        </Slider>
                        <PrevNextWrapper>
                            <NextSvg onClick={prev} className="slide-btn prev"/>
                            <NextSvg onClick={next} className="slide-btn" />
                        </PrevNextWrapper>
                    </div>
                }
            </AdWrapper>

            <CoupangComment>
                <div>해당 위젯은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</div>
            </CoupangComment>
            {/* <CoupangLogo onClick={clickScreenSize}> <span style={{color: "#521110"}}>Cou</span><span style={{color: "#D83227"}}>p</span><span style={{color: "#EA9924"}}>a</span><span style={{color: "#92BA3F"}}>n</span><span style={{color: "#50A3DA"}}>g</span> </CoupangLogo> */}
        </CoupangWrapper>
    );
};

export default Coupang;

const CoupangWrapper = styled.div`
    // display: flex;
    flex-direction: column;
    height: 410px;
`;

const CoupangCategoryComment = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 0.5rem 0;
    font-size: 18px;
`;

const CoupangLogo = styled.div`
    width: 100%;
    font-weight: bold;
    margin-left: auto;

    font-size: 0.8rem;
`;

const AdWrapper = styled.div`
    display: flex;
    justify-content: center;

    background: #fefefe;
    padding: 10px;

    font-weight: bold;
    
    overflow: hidden;

    .slick-slider {
        width: 200px;

        ul {
            padding: 0;
            margin: 0;
        }
        
        li {
            style-list: none;
            cursor: pointer;
            display: inline-block;
            margin: 0 0.5rem;
            padding: 0;
        }

        li button {
            width: 0.6rem;
            height: 0.6rem;
            border: none;
            border-radius: 50%;
            background:rgb(231, 231, 231);
            color: transparent;
            cursor: pointer;
            display: block;
            padding: 0;
        }

        li.slick-active button {
            background-color: lightgray;
        }

        .slick-slide {
            margin: 0 20px;
            // padding: 0 10px;

            transform: scale(0.9);
            transition: transform 0.3s ease-in-out;
        }

        .slick-list {
            margin: 0 -20px;
            .slick-track {
                width: 100%;
                display: flex;
            }
        }

        .slick-current {
            transform: scale(1);
            // transition: transform 0.3s ease-in-out;
        }
    }
`;

const CoupangItemWrapper = styled.div`
    width: 200px;

    display: flex;
    flex-direction: column;
    margin: 0 1vw;

    will-change: filter;
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

        cursor: pointer;
    }
`;

const CoupangImageWrapper = styled.div`
    position: relative;

    dispaly: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 200px;

    overflow: hidden;
`;

const CoupangImage = styled.img`
    width: 100%;
    height: 200px;
    fit-content: cover;

    transition: ease-in-out 0.2s;
`;

const CoupangDescription = styled.div`
    display: flex;
    flex-direction: column;

    padding: 0.35rem 1rem;
`;

const CoupangItemName = styled.span`
    margin: 0.05rem 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    white-space: no-wrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 0.9rem;
`;

const CoupangItemPrice = styled.span`
    margin: 0.05rem 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    white-space: no-wrap;
    overflow: hidden;
    text-overflow: ellipsis;

    color: #d9230f;

    // font-size: rem;
`;

const CoupangFreeShipping = styled.div`
    border-radius: 0 0 5px 0;
    padding: 0.2rem 0.4rem;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #3878F2;
    color: white;
`;

const CoupangShippingWrapper = styled.div`
    position: absolute;
    top: 0;
    left: 0;

    display: flex;

    font-size: 0.9rem;
`;

const CoupangRocketShipping2 = styled.div`
    border-radius: 0 0 5px 0;
    padding: 0.25rem 0.45rem;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #3A7AF4;
    color: white;
    // background: #EAF3FE;
    // color: #3A7AF4;
`;

const CoupangSeeDetails = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 0.9rem;

    padding: 0.3rem;
    background: #3878F2;
    color: white;

    &:hover {
        cursor: pointer;
    }
`;

const CoupangItemWrapperMobile = styled.div`
    overflow: hidden;

    will-change: filter;
    border-radius: 10px;
    filter: drop-shadow(0 0 0.25em lightgray);
    background: white;
`;

const CoupangShippingMobileWrapper = styled.div`   
    display: flex;

    margin: 0.3rem 0;
`;

const CoupangImageMobileWrapper = styled.div`
    position: relative;

    dispaly: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 200px;

    overflow: hidden;
`;

const CoupangItemNameMobile = styled.span`
    margin: 0.15rem 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    white-space: no-wrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 0.9rem;
`;

const PrevNextWrapper = styled.div`
    position: absolute;
    left: 0;
    right: 0;

    display: flex;
    justify-content: space-between;
    // align-items: center;

    .slide-btn {
        z-index: 1;

        width: 4rem;
        height: 4rem;
        border-radius: 50%;
        background: lightgray;
        fill: white;
        opacity: 75%;
    }

    .prev {
        transform: rotate(180deg);
    }
`;

const CoupangComment = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;

    font-size: 0.8rem;
    // color: gray;
    font-weight: normal;
    background: none;
`;