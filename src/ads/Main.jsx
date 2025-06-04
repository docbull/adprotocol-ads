import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

import Coupang from "./Coupang";

const Main = ({ category }) => {
    return (
        <MediaBoxWrapper>
            <Coupang />
        </MediaBoxWrapper>
    );
};

export default Main;

const MediaBoxWrapper = styled.div`
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    background-color: white;
`;