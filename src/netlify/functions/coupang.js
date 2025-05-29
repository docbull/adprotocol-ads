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
        const url = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/bestcategories/${category}?limit=20`;
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
    } catch (err) {
        console.log(err);
    }
}

const sortCoupangItems = (content, items) => {
    const arrange = [];

    for (const item of items) {
        const contentWords = new Set(content.split(/\s+/));
        const itemName = new Set(item.productName.split(/\s+/));

        const intersection = new Set([...contentWords].filter(word => itemName.has(word)));
        const union = new Set([...contentWords, ...itemName]);

        const similarity = intersection.size / union.size;
        console.log(`${itemName} : ${similarity}`);
        arrange.push({
            item,
            similarity,
        });

        arrange.sort((a, b) => b.similarity - a.similarity);
    }

    return arrange.item.slice(0, 3);
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

// 콘텐츠와 가장 연관성이 높은 카테고리 상품 추천
exports.handler = async (event, context) => {
    const category = JSON.parse(event.body).category;

    // send items that is similar with the contents(category)
    const itemsByCategory = await getCoupangBestItemsByCategory(category);

    const bestItems = sortCoupangItems(itemsByCategory);

    const itemArray = [];
    for (const item of bestItems) {
        itemArray.push({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            productImage: item.productImage,
            isRocket: item.isRocket,
            isFreeShipping: item.isFreeShipping,
            productUrl: item.productUrl,
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