import embedding1 from "../../ads/embeddings/no1.json";
import embedding2 from "../../ads/embeddings/no2.json";
import embedding3 from "../../ads/embeddings/no3.json";
import embedding4 from "../../ads/embeddings/no4.json";
import embedding5 from "../../ads/embeddings/no5.json";
import embedding6 from "../../ads/embeddings/no6.json";
import embedding7 from "../../ads/embeddings/no7.json";
import embedding8 from "../../ads/embeddings/no8.json";

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
    // 1. embedding 파싱
    // 2. DB에서 광고 embedding 가져오기
    // 3. 각 embedding과 유사도 검사
    // 4. 유사도가 높은 상위 5개 선별
    // 5. 그 중에 랜덤 반환(페이지 로드)

    console.log(JSON.parse(event.body));
    const contentEmbedding = JSON.parse(event.body.keywords);
    console.log(contentEmbedding);

    // 
    const ads = [
        { embedding: embedding1, url: "https://cool-pony-c67e5b.netlify.app/#/ad1" },
        { embedding: embedding2, url: "https://cool-pony-c67e5b.netlify.app/#/ad2" },
        { embedding: embedding3, url: "https://cool-pony-c67e5b.netlify.app/#/ad3" },
        { embedding: embedding4, url: "https://cool-pony-c67e5b.netlify.app/#/ad4" },
        { embedding: embedding5, url: "https://cool-pony-c67e5b.netlify.app/#/ad5" },
        { embedding: embedding6, url: "https://cool-pony-c67e5b.netlify.app/#/ad6" },
        { embedding: embedding7, url: "https://cool-pony-c67e5b.netlify.app/#/ad7" },
        { embedding: embedding8, url: "https://cool-pony-c67e5b.netlify.app/#/ad8" },
    ]

    let highestAd = 0;
    let adIndex = 0;
    ads.forEach((ad, idx) => {
        const similarity = cosineSimilarity(contentEmbedding, ad.embedding);
        console.log("similarity:", similarity);
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