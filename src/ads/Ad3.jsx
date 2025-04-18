import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

import adImage from "./images/3.jpeg"

const Ad3 = () => {

    useEffect(() => {
        
    }, []);

    return (
        <AdWrapper>
            <img src={adImage} />
        </AdWrapper>
    );
};

export default Ad3;

const AdWrapper = styled.div`
    // width: 100%;
    // height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;