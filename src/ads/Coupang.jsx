import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef, useCallback } from "react";
import Slider from "react-slick";
import { useLocation } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";

const Coupang = ({ category }) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const content = params.get("content");
    const count = params.get("count");

    const [ isMobile, setIsMobile ] = useState(false);
    const [ items, setItems ] = useState([]);

    const slickRef = useRef(null);
    var settings = {
        initialSlide: 0,
        arrows: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 5000,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
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
                const iframeWidth = Number(document.body.scrollWidth);
                if (iframeWidth <= 500) {
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
        // console.log(document.body.scrollHeight);

    }

    return (
        <CoupangWrapper>
            <div style={{display: "flex", justifyContent: "center"}}>
                Category 추천 상품
            </div>

            <AdWrapper>
                    {!isMobile ? 
                        items.map((item, idx) => (
                            <CoupangItemWrapper key={idx}>
                                <CoupangImageWrapper> 
                                    <CoupangImage src={item.productImage} />
                                    <CoupangShippingWrapper2>
                                        {item.isFreeShipping ? <CoupangFreeShipping> 무료배송 </CoupangFreeShipping> : <></>}
                                        {item.isRocket ? <CoupangRocketShipping2> 로켓배송 </CoupangRocketShipping2> : <></>}
                                    </CoupangShippingWrapper2>
                                </CoupangImageWrapper>
                                <CoupangDescription>
                                    <CoupangItemName> {item.productName} </CoupangItemName>
                                    <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                                        <div style={{display: "flex", alignItems: "center"}}> <CoupangItemName>  ₩{item.productPrice.toLocaleString()} </CoupangItemName> </div>
                                        {/* <div style={{display: "flex", alignItems: "center"}}> <CoupangItemName>  ₩1,930,300 </CoupangItemName> </div> */}
                                        <CoupangSeeDetails2 onClick={() => coupangClickEvent(item)}> 자세히 → </CoupangSeeDetails2>
                                    </div>
                                </CoupangDescription>
                            </CoupangItemWrapper>
                        ))
                    :
                    // show item lists with slides
                    <Slider {...settings} ref={slickRef}>
                        {items.map((item, idx) => {
                            return (
                                <CoupangItemWrapperMobile key={idx} onClick={() => coupangClickEvent(item)}>
                                    <CoupangImageMobileWrapper>
                                        <CoupangImage src={item.productImage} />
                                        <CoupangShippingWrapper2>
                                            {item.isFreeShipping ? <CoupangFreeShipping> 무료배송 </CoupangFreeShipping> : <></>}
                                            {item.isRocket ? <CoupangRocketShipping2> 로켓배송 </CoupangRocketShipping2> : <></>}
                                        </CoupangShippingWrapper2>
                                    </CoupangImageMobileWrapper>
                                    <CoupangDescription>
                                        <CoupangItemName className="ladder-mobile-text"> {item.productName} </CoupangItemName>
                                        <div style={{width: "100%", display: "flex", justifyContent: "space-between", alignContent: "center"}}>
                                            <div style={{display: "flex", alignItems: "center"}}> <CoupangItemName className="ladder-mobile-text">  ₩{item.productPrice.toLocaleString()} </CoupangItemName> </div>
                                            {/* <div style={{display: "flex", alignItems: "center"}}> <CoupangItemName>  ₩993,000 </CoupangItemName> </div> */}
                                            <CoupangSeeDetails2 style={{fontSize: "0.7rem"}} onClick={() => coupangClickEvent(item)}> 자세히 → </CoupangSeeDetails2>
                                        </div>
                                    </CoupangDescription>
                                </CoupangItemWrapperMobile>
                            )
                        })}
                    </Slider>
                }
            </AdWrapper>

            <CoupangComment>
                {isMobile ? 
                    <div style={{width: "100%", textAlign: "right"}}>
                        * 해당 위젯은 쿠팡 파트너스 활동의 일환으로,<br></br>
                        이에 따른 일정액의 수수료를 제공받습니다.
                    </div>
                :
                    <>* 해당 위젯은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.</>
                }
            </CoupangComment>
            {/* <CoupangLogo style={{width: `${width}px`}}> <span style={{color: "#521110"}}>Cou</span><span style={{color: "#D83227"}}>p</span><span style={{color: "#EA9924"}}>a</span><span style={{color: "#92BA3F"}}>n</span><span style={{color: "#50A3DA"}}>g</span> </CoupangLogo> */}
        </CoupangWrapper>
    );
};

export default Coupang;

const CoupangWrapper = styled.div`
    // display: flex;
    flex-direction: column;
    height: 320px;
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
        // width: 100%;

        .slick-slide {
            // margin: 0 10px;
            padding: 0 10px;
        }

        .slick-list {
            .slick-track {
                width: 100%;

                display: flex;
            }
        }
    }
`;

const CoupangItemWrapper = styled.div`
    width: 180px;

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
    }
`;

const CoupangImageWrapper = styled.div`
    width: 100%;
    height: 180px;

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
    margin: 0.15rem 0;

    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    white-space: no-wrap;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 0.9rem;
`;

const CoupangShippingWrapper = styled.div`
    display: flex;

    // margin: 0.3rem 0;
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

    font-size: 0.8rem;

    margin-top: 0.3rem;

    border-radius: 10px;
    padding: 0.35rem;
    background: #3878F2;
    color: white;

    &:hover {
        cursor: pointer;
    }
`;

const CoupangShippingWrapper2 = styled.div`
    position: absolute;
    // top: 0;
    bottom: 0;
    right: 0;
    
    display: flex;

    margin: 0.3rem;
`;

const CoupangRocketShipping2 = styled.div`
    border-radius: 5px;
    padding: 0.1rem 0.3rem;

    font-size: 0.8rem;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #EAF3FE;
    color: #3A7AF4;
`;

const CoupangSeeDetails2 = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 0.8rem;

    border-radius: 10px;
    padding: 0.35rem;
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

const CoupangComment = styled.div`
    display: flex;
    // justify-content: center;

    font-size: 0.8rem;
    // color: gray;
    font-weight: normal;
    background: none;
`;