import embedding1 from "../../ads/embeddings/1001.json";
import embedding2 from "../../ads/embeddings/1002.json";
import embedding3 from "../../ads/embeddings/1010.json";
import embedding4 from "../../ads/embeddings/1011.json";
import embedding5 from "../../ads/embeddings/1012.json";
import embedding6 from "../../ads/embeddings/1013.json";
import embedding7 from "../../ads/embeddings/1014.json";
import embedding8 from "../../ads/embeddings/1015.json";
import embedding9 from "../../ads/embeddings/1016.json";
import embedding10 from "../../ads/embeddings/1017.json";
import embedding11 from "../../ads/embeddings/1018.json";
import embedding12 from "../../ads/embeddings/1019.json";
import embedding13 from "../../ads/embeddings/1020.json";
import embedding14 from "../../ads/embeddings/1021.json";
import embedding15 from "../../ads/embeddings/1024.json";
import embedding16 from "../../ads/embeddings/1025.json";
import embedding17 from "../../ads/embeddings/1026.json";
import embedding18 from "../../ads/embeddings/1029.json";
import embedding19 from "../../ads/embeddings/1030.json";

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

exports.handler = async (event, context) => {
    const contentEmbedding = JSON.parse(event.body).keywords;

    const ads = [
        { embedding: embedding1, name: "여성패션", number: 1001, url: "https://cool-pony-c67e5b.netlify.app/#/1001" },
        { embedding: embedding2, name: "남성패션", number: 1002, url: "https://cool-pony-c67e5b.netlify.app/#/1002" },
        { embedding: embedding3, name: "뷰티", number: 1010, url: "https://cool-pony-c67e5b.netlify.app/#/1010" },
        { embedding: embedding4, name: "출산/유아동", number: 1011, url: "https://cool-pony-c67e5b.netlify.app/#/1011" },
        { embedding: embedding5, name: "식품", number: 1012, url: "https://cool-pony-c67e5b.netlify.app/#/1012" },
        { embedding: embedding6, name: "주방용품", number: 1013, url: "https://cool-pony-c67e5b.netlify.app/#/1013" },
        { embedding: embedding7, name: "생활용품", number: 1014, url: "https://cool-pony-c67e5b.netlify.app/#/1014" },
        { embedding: embedding8, name: "홈인테리어", number: 1015, url: "https://cool-pony-c67e5b.netlify.app/#/1015" },
        { embedding: embedding9, name: "가전디지털", number: 1016, url: "https://cool-pony-c67e5b.netlify.app/#/1016" },
        { embedding: embedding10, name: "스포츠/레저", number: 1017, url: "https://cool-pony-c67e5b.netlify.app/#/1017" },
        { embedding: embedding11, name: "자동차용품", number: 1018, url: "https://cool-pony-c67e5b.netlify.app/#/1018" },
        { embedding: embedding12, name: "도서/음반/DVD", number: 1019, url: "https://cool-pony-c67e5b.netlify.app/#/1019" },
        { embedding: embedding13, name: "완구/취미", number: 1020, url: "https://cool-pony-c67e5b.netlify.app/#/1020" },
        { embedding: embedding14, name: "문구/오피스", number: 1021, url: "https://cool-pony-c67e5b.netlify.app/#/1021" },
        { embedding: embedding15, name: "헬스/건강식품", number: 1024, url: "https://cool-pony-c67e5b.netlify.app/#/1024" },
        { embedding: embedding16, name: "국내여행", number: 1025, url: "https://cool-pony-c67e5b.netlify.app/#/1025" },
        { embedding: embedding17, name: "해외여행", number: 1026, url: "https://cool-pony-c67e5b.netlify.app/#/1026" },
        { embedding: embedding18, name: "반려동물용품", number: 1029, url: "https://cool-pony-c67e5b.netlify.app/#/1029" },
        { embedding: embedding19, name: "유아동패션", number: 1030, url: "https://cool-pony-c67e5b.netlify.app/#/1030" },
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