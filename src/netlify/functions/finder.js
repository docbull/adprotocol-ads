import { initializeApp } from "firebase/app";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import pako from 'pako';

// import embedding1 from "../../ads/embeddings/1001.json";
// import embedding2 from "../../ads/embeddings/1002.json";
// import embedding3 from "../../ads/embeddings/1010.json";
// import embedding4 from "../../ads/embeddings/1011.json";
// import embedding5 from "../../ads/embeddings/1012.json";
// import embedding6 from "../../ads/embeddings/1013.json";
// import embedding7 from "../../ads/embeddings/1014.json";
// import embedding8 from "../../ads/embeddings/1015.json";
// import embedding9 from "../../ads/embeddings/1016.json";
// import embedding10 from "../../ads/embeddings/1017.json";
// import embedding11 from "../../ads/embeddings/1018.json";
// import embedding12 from "../../ads/embeddings/1019.json";
// import embedding13 from "../../ads/embeddings/1020.json";
// import embedding14 from "../../ads/embeddings/1021.json";
// import embedding15 from "../../ads/embeddings/1024.json";
// import embedding16 from "../../ads/embeddings/1025.json";
// import embedding17 from "../../ads/embeddings/1026.json";
// import embedding18 from "../../ads/embeddings/1029.json";
// import embedding19 from "../../ads/embeddings/1030.json";

import embedding1 from "../../ads/embeddings/v2/1001_2.json";
import embedding2 from "../../ads/embeddings/v2/1002_2.json";
import embedding3 from "../../ads/embeddings/v1/1010_1.json";
import embedding4 from "../../ads/embeddings/v1/1011_1.json";
import embedding5 from "../../ads/embeddings/v1/1012_1.json";
import embedding6 from "../../ads/embeddings/v1/1013_1.json";
import embedding7 from "../../ads/embeddings/v1/1014_1.json";
import embedding8 from "../../ads/embeddings/v1/1015_1.json";
import embedding9 from "../../ads/embeddings/v1/1016_1.json";
import embedding10 from "../../ads/embeddings/v1/1017_1.json";
import embedding11 from "../../ads/embeddings/v1/1018_1.json";
import embedding12 from "../../ads/embeddings/v1/1019_1.json";
import embedding13 from "../../ads/embeddings/v1/1020_1.json";
import embedding14 from "../../ads/embeddings/v1/1021_1.json";
import embedding15 from "../../ads/embeddings/v1/1024_1.json";
import embedding16 from "../../ads/embeddings/v1/1025_1.json";
import embedding17 from "../../ads/embeddings/v1/1026_1.json";
import embedding18 from "../../ads/embeddings/v1/1029_1.json";
import embedding19 from "../../ads/embeddings/v1/1030_1.json";

async function getEmbedding(content) {
    try {
        const response = await fetch(process.env.REACT_APP_EMBEDDINGS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                    "Authorization": process.env.REACT_APP_AUTH,
            },
            body: JSON.stringify({
                "model": process.env.REACT_APP_MODEL,
                "input": content,
            })
        });
        const data = await response.json();
        return data.data[0].embedding;
    } catch (err) {
        console.log("ERROR WHILE GETTING CONTENT EMBEDDING >>", err);
    }
}

function dot(a, b) {
    if (a.length !== b.length) {
        throw new Error('The vectors must have the same length');
    }
  
    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result += a[i] * b[i];
    }
    return result;
}

function norm(vector) {
    if (vector.length === 0) {
      return 0;
    }
  
    let sumOfSquares = 0;
    for (let i = 0; i < vector.length; i++) {
      sumOfSquares += Math.pow(vector[i], 2);
    }
  
    return Math.sqrt(sumOfSquares);
}

function cosineSimilarity(embedding1, embedding2) {
    const dots = dot(embedding1, embedding2);
    const norm1 = norm(embedding1);
    const norm2 = norm(embedding2);
    const similarity = dots / (norm1 * norm2);

    return similarity;
}

const getRecomendedItems = async () => {
    try {
        const url = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/reco`;
        const authorization = await generateHmac("GET", url, process.env.REACT_APP_KEY, process.env.REACT_APP_AU);

        const res = await fetch(`https://api-gateway.coupang.com` + url, {
            method: "GET",
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json',
            }
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function storeContent(content) {
    return new Promise((resolve) => {
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
    
        addDoc(collection(firestore, "ladder"), {
            content: content,
        }).then((res) => {
            console.log(res.id);
            resolve(res.id);
        });
    });
}

exports.handler = async (event, context) => {
    const receivedData = JSON.parse(event.body);
    const compressedContent = receivedData.compressed_content;
    const content = pako.inflate(compressedContent, { to: "string" });

    const contentEmbedding = await getEmbedding(content);

    // compressed content: lowest size (Unit8Array)
    // base64 content: 2nd (Base64)
    // 현재로서는 크기가 가장 큰 decompressed content를 저장 ...
    const contentId = await storeContent(content);

    const ads = [
        { embedding: embedding1, name: "여성패션", number: 1001, url: `https://cool-pony-c67e5b.netlify.app/#/1001?content=${contentId}` },
        { embedding: embedding2, name: "남성패션", number: 1002, url: `https://cool-pony-c67e5b.netlify.app/#/1002?content=${contentId}` },
        { embedding: embedding3, name: "뷰티", number: 1010, url: `https://cool-pony-c67e5b.netlify.app/#/1010?content=${contentId}` },
        { embedding: embedding4, name: "출산/유아동", number: 1011, url: `https://cool-pony-c67e5b.netlify.app/#/1011?content=${contentId}` },
        { embedding: embedding5, name: "식품", number: 1012, url: `https://cool-pony-c67e5b.netlify.app/#/1012?content=${contentId}` },
        { embedding: embedding6, name: "주방용품", number: 1013, url: `https://cool-pony-c67e5b.netlify.app/#/1013?content=${contentId}` },
        { embedding: embedding7, name: "생활용품", number: 1014, url: `https://cool-pony-c67e5b.netlify.app/#/1014?content=${contentId}` },
        { embedding: embedding8, name: "홈인테리어", number: 1015, url: `https://cool-pony-c67e5b.netlify.app/#/1015?content=${contentId}` },
        { embedding: embedding9, name: "가전디지털", number: 1016, url: `https://cool-pony-c67e5b.netlify.app/#/1016?content=${contentId}` },
        { embedding: embedding10, name: "스포츠/레저", number: 1017, url: `https://cool-pony-c67e5b.netlify.app/#/1017?content=${contentId}` },
        { embedding: embedding11, name: "자동차용품", number: 1018, url: `https://cool-pony-c67e5b.netlify.app/#/1018?content=${contentId}` },
        { embedding: embedding12, name: "도서/음반/DVD", number: 1019, url: `https://cool-pony-c67e5b.netlify.app/#/1019?content=${contentId}` },
        { embedding: embedding13, name: "완구/취미", number: 1020, url: `https://cool-pony-c67e5b.netlify.app/#/1020?content=${contentId}` },
        { embedding: embedding14, name: "문구/오피스", number: 1021, url: `https://cool-pony-c67e5b.netlify.app/#/1021?content=${contentId}` },
        { embedding: embedding15, name: "헬스/건강식품", number: 1024, url: `https://cool-pony-c67e5b.netlify.app/#/1024?content=${contentId}` },
        { embedding: embedding16, name: "국내여행", number: 1025, url: `https://cool-pony-c67e5b.netlify.app/#/1025?content=${contentId}` },
        { embedding: embedding17, name: "해외여행", number: 1026, url: `https://cool-pony-c67e5b.netlify.app/#/1026?content=${contentId}` },
        { embedding: embedding18, name: "반려동물용품", number: 1029, url: `https://cool-pony-c67e5b.netlify.app/#/1029?content=${contentId}` },
        { embedding: embedding19, name: "유아동패션", number: 1030, url: `https://cool-pony-c67e5b.netlify.app/#/1030?content=${contentId}` },
    ];

    let highestAd = 0;
    let adIndex = 0;
    ads.forEach((ad, idx) => {
        const similarity = cosineSimilarity(contentEmbedding, ad.embedding);
        console.log(`${ads[idx].name} >> similarity: ${similarity}`);
        if (similarity >= highestAd) {
            highestAd = similarity;
            adIndex = idx;
        }
    });

    return {
        statusCode: 200,
        body: JSON.stringify({ adUrl: ads[adIndex].url }),
    }
}