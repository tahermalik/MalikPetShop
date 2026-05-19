import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 2,
    duration: '10s',
};

// -----------------------------
// CONFIG
// -----------------------------
const BASE_URL = 'http://localhost:3000';

// random search queries
const queries = ["phone", "laptop", "shirt", "watch", "shoes"];

// -----------------------------
// GUEST FLOW
// -----------------------------
function guestFlow() {

    let jar = http.cookieJar();

    // simulate guest middleware requirement
    jar.set(BASE_URL, 'guestId', 'guest-' + Math.random());

    let payload = JSON.stringify({
        userQuery: queries[Math.floor(Math.random() * queries.length)],
        page: 1,
        limit: 10
    });

    let res = http.post(`${BASE_URL}/products/display`, payload, {
        headers: { 'Content-Type': 'application/json' }
    });

    check(res, {
        'guest request success': (r) => r.status === 200,
        'guest has products': (r) => r.json('products') !== undefined,
    });

    sleep(1);
}

// -----------------------------
// LOGIN + USER FLOW
// -----------------------------
function userFlow() {

    // 1. LOGIN
    let loginRes = http.post(`${BASE_URL}/login/user`,
        JSON.stringify({
            email: "test@gmail.com",
            password: "1234",
            reduxWishListData: []
        }),
        {
            headers: { 'Content-Type': 'application/json' }
        }
    );

    check(loginRes, {
        'login success': (r) => r.status === 200,
        'login bool true': (r) => r.json('bool') === true,
    });

    console.log(loginRes.status);
    console.log(loginRes.headers);
    console.log(loginRes.body);

    let token = loginRes.json('token');

    // 2. SET TOKEN COOKIE (important for middleware)
    let jar = http.cookieJar();
    jar.set(BASE_URL, 'token', token);

    // 3. DISPLAY PRODUCT CALL (authenticated user)
    let payload = JSON.stringify({
        userQuery: queries[Math.floor(Math.random() * queries.length)],
        page: 1,
        limit: 10
    });

    let res = http.post(`${BASE_URL}/products/display`, payload, {
        headers: { 'Content-Type': 'application/json' }
    });

    check(res, {
        'user request success': (r) => r.status === 200,
        'products returned': (r) => Array.isArray(r.json('products')),
    });

    sleep(1);
}

// -----------------------------
// MAIN EXECUTION (MIXED TRAFFIC)
// -----------------------------
export default function () {

    // 50% guest, 50% logged-in users
    if (Math.random() < 0.5) {
        guestFlow();
    } else {
        userFlow();
    }
}
