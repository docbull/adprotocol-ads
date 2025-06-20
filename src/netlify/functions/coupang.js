import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc } from "firebase/firestore";

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

        const items = data.data.slice(0, 3);
        return items;
    } catch (err) {
        console.log(err);
    }
}

const getCoupangBestItemsByCategory = async (category) => {
    try {
        if (category === 1025) {
            const keyword = encodeURIComponent("국내여행 필수품");
            const url = `/v2/providers/affiliate_open_api/apis/openapi/products/search?keyword=${keyword}&limit=10`;
            const authorization = await generateHmac("GET", url, process.env.REACT_APP_KEY, process.env.REACT_APP_AU);

            const res = await fetch("https://api-gateway.coupang.com" + url, {
                method: "GET",
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            return data.data.productData;
        } else if (category === 1026) {
            const keyword = encodeURIComponent("여행 필수품");
            const url = `/v2/providers/affiliate_open_api/apis/openapi/products/search?keyword=${keyword}&limit=10`;
            const authorization = await generateHmac("GET", url, process.env.REACT_APP_KEY, process.env.REACT_APP_AU);

            const res = await fetch("https://api-gateway.coupang.com" + url, {
                method: "GET",
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            return data.data.productData;
        } else {
            const url = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/bestcategories/${category}?limit=10`;
            const authorization = await generateHmac("GET", url, process.env.REACT_APP_KEY, process.env.REACT_APP_AU);
    
            const res = await fetch(`https://api-gateway.coupang.com` + url, {
                method: "GET",
                headers: {
                    'Authorization': authorization,
                    'Content-Type': 'application/json',
                },
            });
            const data = await res.json();
            return data.data;
        }
    } catch (err) {
        console.log(err);
    }
}

const sortCoupangItems = (content, items, count) => {
    const arrange = [];

    for (const item of items) {
        const contentWords = new Set(content.split(/\s+/));
        const itemName = new Set(item.productName.split(/\s+/));

        const intersection = new Set([...contentWords].filter(word => itemName.has(word)));
        const union = new Set([...contentWords, ...itemName]);

        const similarity = intersection.size / union.size;
        console.log(`${item.productName} : ${similarity}`);
        arrange.push({
            item,
            similarity,
        });

        arrange.sort((a, b) => b.similarity - a.similarity);
    }

    return arrange.slice(count * 4, (count * 4) + 3);
}

const makeUrlForUs = async (urls) => {
    try {
        const url = `/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink`;
        const authorization = await generateHmac("POST", url, process.env.REACT_APP_KEY, process.env.REACT_APP_AU);

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

const getContent = async (contentId) => {
    return new Promise(async (resolve) => {
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
        const docRef = doc(firestore, "ladder", contentId);
        const docSnap = await getDoc(docRef);
        const content = docSnap.data().content;

        resolve(content);
    });
}

// 콘텐츠와 가장 연관성이 높은 카테고리 상품 추천
exports.handler = async (event, context) => {
    const data = JSON.parse(event.body);
    const category = data.category;
    const count = data.count;

    // send items that is similar with the contents(category)
    const itemsByCategory = await getCoupangBestItemsByCategory(category);

    const contentId = data.content;
    const content = await getContent(contentId);

    const bestItems = sortCoupangItems(content, itemsByCategory, count);

    const itemArray = [];
    for (const item of bestItems) {
        itemArray.push({
            productId: item.item.productId,
            productName: item.item.productName,
            productPrice: item.item.productPrice,
            productImage: item.item.productImage,
            isRocket: item.item.isRocket,
            isFreeShipping: item.item.isFreeShipping,
            productUrl: item.item.productUrl,
        });
    }
    console.log("ITEMS:", itemArray);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
        },
        body: JSON.stringify({ items: itemArray }),
    }
}