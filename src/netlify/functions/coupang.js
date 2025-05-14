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

const getCoupangBestItemsByCategory = async (category) => {
    try {
        const url = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/bestcategories/${category}?limit=3`;
        const authorization = await generateHmac("GET", url, "70133b5e821616df4e3692a807000edc00f6f586", "4e1821c6-9dce-4d00-bd06-0b56acbb71ff");

        const res = await fetch(`https://api-gateway.coupang.com` + url, {
            method: "GET",
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

const makeUrlForUs = async (urls) => {
    try {
        const url = `/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink`;
        const authorization = await generateHmac("POST", url, "70133b5e821616df4e3692a807000edc00f6f586", "4e1821c6-9dce-4d00-bd06-0b56acbb71ff");

        const request = {
            "coupangUrls": urls
        }

        const res = await fetch(`https://api-gateway.coupang.com` + url, {
            method: "POST",
            headers: {
                'Authorization': authorization,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });
        const data = await res.json();
        console.log(data);
        return data;
    } catch (err) {
        console.log(err);
    }
}

const generateHmac = async (method, url, secretKey, accessKey) => {
    const [ path, query = "" ] = url.split(/\?/);

    const datetime = new Date().toISOString().replace(/[-:]/g, '').slice(2, 15) + 'Z';
    const message = datetime + method + path + query;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secretKey),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
    const signatureArray = Array.from(new Uint8Array(signatureBuffer));
    const signatureHex = signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signatureHex}`;
}

// 콘텐츠와 가장 연관성이 높은 카테고리 상품 추천
exports.handler = async (event, context) => {
    const category = JSON.parse(event.body).category;

    const itemsByCategory = await getCoupangBestItemsByCategory(category);
    console.log('LOADED ITEMS:', itemsByCategory);

    const itemArray = [];
    for (const item of itemsByCategory.data) {
        const productUrl = await makeUrlForUs(item.productUrl);

        itemArray.push({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            productImage: item.productImage,
            productUrl: productUrl,
        });
    }
    console.log("ITEM ARRAY:", itemArray);

    return {
        statusCode: 200,
        body: JSON.stringify({ adUrl: `${ads[adIndex].url}?items=${encodeURIComponent(JSON.stringify(itemArray))}` }),
    }
}