var axios = require('axios');
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';

const allowCors = (fn) => async(req, res) => {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );
    return await fn(req, res);
};

module.exports = allowCors(async(req, res) => {
    if (!req.query.url.includes('http')) {
        req.query.url = `http://${req.query.url}`;
    }
    const encodedurl = encodeURIComponent(req.query.url);
    const encodedprod = encodeURIComponent(req.query.prod);
    const encodedquery = encodeURIComponent(req.query.query);
    var config = {
        method: 'post',
        url: `https://tekky.vercel.app/api/generator/querifySpec?url=${encodedurl}&prod=${encodedprod}`,
        headers: {}
    };
    let jsonres = await axios(config);
    let selobj = JSON.parse(AES.decrypt(jsonres.data, process.env.SECRET).toString(enc.Utf8));
    console.log("Got this");
    console.log(selobj);
    var config = {
        method: 'post',
        url: `https://tekky.vercel.app/api/generator/getter?url=${encodeURIComponent(selobj["queryableurl"])}&query=${encodedquery}&contsel=${selobj["contsel"]}&namesel=${selobj["namesel"]}&pricesel=${selobj["pricesel"]}&imgsel=${selobj["imgsel"]}`,
        headers: {}
    };
    if (req.query.query) {
        let response = await axios(config)
            .then(function(response) {
                return JSON.stringify(response.data);
            })
        return res.send(response);
    } else {
        return res.end();
    }


});