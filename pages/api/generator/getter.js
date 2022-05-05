const axios = require("axios");
const jsdom = require("jsdom");
const urlparser = require("url");

var origin;
var compurl;
var query;
var wentto = [];
var result = [];
var namesel = '';
var pricesel = '';
var imgsel = '';
var contsel = '';

const blacklistprice = ["P.T.F.", "IVA Inc."]

const rentireusd = new RegExp("(USD|U$D)", "g");
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
    origin;
    compurl;
    query;
    wentto = [];
    result = [];
    namesel = '';
    pricesel = '';
    imgsel = '';
    contsel = '';
    console.log("Getter:")
    console.log(req.query)
    query = req.query.query;
    let url = urlparser.parse(req.query.url, true);
    origin = url.hostname;
    let queryurl = req.query.url.split(`$ValDNT990`);
    compurl = `${queryurl[0]}${query}${queryurl[1]}`;
    namesel = req.query.namesel;
    pricesel = req.query.pricesel;
    imgsel = req.query.imgsel;
    contsel = req.query.contsel;
    let selectors = {
        name: namesel,
        price: pricesel,
        image: imgsel,
        container: contsel
    }

    let promises = [];
    let nexturl = compurl;
    let doc = await getData(nexturl, selectors, url);
    let next = true;
    while (next) {
        let oldurl = nexturl;
        promises.push(parseItems(doc, selectors, url));
        let nextEl = getNextPageElement(doc, query, url);
        if (nextEl.element) {
            for (let link of doc.querySelectorAll(nextEl.selector)) {
                nexturl = new URL(link.href, url.href).href;
                if (!wentto.includes(nexturl)) {
                    doc = await getData(nexturl, selectors, url)
                }
            }
            if (oldurl == nexturl) {
                next = false;
            }
        } else {
            next = false;
        }
    }
    await Promise.all(promises).then(function(values) {
        for (let value of values) {
            for (let item of value) {
                if (!result.includes(item)) {
                    result.push(item);
                }
            }
        }
    });
    return res.send(result);
});

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function getIndex(node) {
    let i = 1;
    let tagName = node.tagName;

    while (node.previousSibling) {
        node = node.previousSibling;
        if (
            node.nodeType === 1 &&
            tagName.toLowerCase() == node.tagName.toLowerCase()
        ) {
            i++;
        }
    }
    return i;
}

function generateContSelector(context) {
    let index, pathSelector, localName;

    if (context == null) throw "not an dom reference";
    index = getIndex(context);

    while (context.tagName) {
        pathSelector = context.localName + (pathSelector ? ">" + pathSelector : "");
        context = context.parentNode;
    }
    pathSelector = pathSelector + `:nth-of-type(${index})`;
    return pathSelector;
}

function getNextPageElement(document, query, url) {
    let nextpageel;
    let nextpage = new RegExp("(&[A-z].*=(1|2)(&|$))");
    let testquery = new RegExp(`(=${query.toLowerCase()}(&|$))`)
    for (let item of document.querySelectorAll('*')) {
        if (item.href != undefined) {
            if (item.href.includes(url.pathname) && testquery.test(item.href) && nextpage.test(item.href) && !item.href.includes('javascript:')) {
                nextpageel = item;
                break;
            }
        }
    }
    return {
        name: "NextPage",
        element: nextpageel,
        selector: (nextpageel) ? generateContSelector(nextpageel) : '',
    };
}



async function getData(url) {
    wentto.push(url);
    var doc = await axios.get(url, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
        }
    }).then(function(res) {
        let doc = new jsdom.JSDOM(res.data).window.document;
        console.log("Got");
        return doc
    });
    return doc;
}

async function parseItems(document, selectors, url) {

    let arr = new Set();
    for (let element of document.querySelectorAll(selectors.container)) {
        let item = {}

        let namesel = element.querySelector(selectors.name);
        let pricesel = element.querySelector(selectors.price);
        let nameit;
        let priceit;
        let image = ''
        if (namesel) {
            nameit = namesel.textContent
            item["name"] = nameit.trim().replaceAll('[^A-Za-z0-9\/:\-\.\?\,=&_$ ]+', '')
            item["url"] = (namesel.tagName == "A") ? new URL(namesel.href, url.href).href : (element.querySelector('a') ? element.querySelector('a').href : url.href);
        }
        if (pricesel) {
            priceit = pricesel.textContent
            for (let word of blacklistprice) {
                priceit = priceit.replaceAll(word, '')
            }
            if (rentireusd.test(priceit)) {
                item["currency"] = 'USD'
                priceit.replaceAll(rentireusd, '')
            } else if (priceit.includes('$') || priceit.includes('UYU')) {
                item["currency"] = 'UYU'
                priceit.replaceAll(rentireusd, '')
            }
            (item["currency"] ? item["price"] = priceit.trim().replaceAll(/[^\d,-]/g, '').replaceAll(' ', '') : item["price"] = priceit.trim())
        }
        if (element.querySelector(selectors.image)) {
            let imageel = element.querySelector(selectors.image)
            if (imageel) {
                if (!imageel.src.includes('data:image')) {
                    if (imageel.src) {
                        let line = imageel.src.split(/\r?\n/)[0]
                        if (line.match('(gif|jpe?g|bmp|png)')) {
                            image = line.split(' ')[0]
                        }
                    }
                    if (image) {
                        let imgurl = new URL(image, url.href).href;
                        item["image"] = imgurl;
                    }

                } else {
                    item["image"] = 'https://via.placeholder.com/150'
                }
            }
        }
        if (Object.keys(item).length > 0 && item["name"] != "" && item["price"] != "") {
            item["id"] = makeid(10);
            item["store"] = url.hostname;
            arr.add(item);
        }

    }
    return arr;
}