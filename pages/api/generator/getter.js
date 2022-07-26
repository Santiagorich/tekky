const axios = require("axios");
const jsdom = require("jsdom");
const urlparser = require("url");


const letterin = /[a-zA-Z]/g;
const blacklistprice = ["P.T.F.", "IVA Inc."];
const rentireusd = new RegExp("(USD|U$D)", "g");
var wentto = [];
var promises = [];

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
    var origin;
    var compurl;
    var query;
    wentto = [];
    var result = [];
    var namesel = "";
    var pricesel = "";
    var imgsel = "";
    var contsel = "";
    var nextsel = "";
    console.log("Getter:");
    console.log(req.query);
    query = req.query.query;
    let url = urlparser.parse(req.query.url.replace('$ValDNT990', query), true);
    origin = url.hostname;
    let queryurl = req.query.url.split('$ValDNT990');
    compurl = `${queryurl[0]}${query}${queryurl[1]}`;
    namesel = req.query.namesel;
    pricesel = req.query.pricesel;
    imgsel = req.query.imgsel;
    contsel = req.query.contsel;
    nextsel = req.query.nextsel;
    let selectors = {
        nextsel: nextsel,
        name: namesel,
        price: pricesel,
        image: imgsel,
        container: contsel,
    };
    let response = await processPage(compurl, selectors, url);
    for (let item of response) {
        if (!result.includes(item)) {
            result.push(item);
        }
    }

    //await Promise.all(promises).then(function(values) {
    //    
    //    for (let value of values) {
    //        for (let item of value) {
    //            if (!result.includes(item)) {
    //                result.push(item);
    //            }
    //        }
    //    }
    //});
    return res.send(result);
});

async function processPage(url, selectors, ogurl) {
    let nextsel = selectors.nextsel;
    if (!wentto.includes(url.href) && url.href) {
        wentto.push(url.href);
    }
    return await getData(url).then(async function(doc) {
        return await parseItems(doc, selectors, ogurl).then(async function(result) {
            let oldurl = ogurl.href;
            for (let link of doc.querySelectorAll(nextsel)) {
                if (!letterin.test(link.textContent)) {
                    let nexturlin;
                    !link.href.includes("http") ?
                        (nexturlin = new URL(link.href, ogurl.href)) :
                        (nexturlin = new URL(link.href));
                    let nexturl = nexturlin.href;
                    for (let query of nexturlin.searchParams.entries()) {
                        if (query[1].length > 4) {
                            nexturlin.searchParams.set(query[0], "");
                        }
                    }
                    if (!wentto.includes(nexturlin.href) && !(oldurl == nexturl)) {
                        wentto.push(nexturlin.href);
                        return await processPage(nexturl, selectors, ogurl);
                    }
                } else {
                    console.log("No hay ma")
                    console.log(link.textContent);
                    return result;
                }
            }
            console.log(result);

            return result;

        });

    });
}

function makeid(length) {
    var result = "";
    var characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
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

async function getData(url) {
    console.log("Getting data from: " + url);
    var doc = await axios
        .get(url, {
            headers: {
                "User-Agent": process.env.UA,
            },
        })
        .then(function(res) {
            let doc = new jsdom.JSDOM(res.data).window.document;
            return doc;
        });
    return doc;
}

async function parseItems(document, selectors, url) {
    let arr = new Set();
    for (let element of document.querySelectorAll(selectors.container)) {
        let item = {};

        let namesel = element.querySelector(selectors.name);
        let pricesel = element.querySelector(selectors.price);
        let nameit;
        let priceit;
        let image = "";
        if (namesel) {
            nameit = namesel.textContent;
            item["name"] = nameit.trim().replaceAll("[^A-Za-z0-9/:-.?,=&_$ ]+", "");
            item["url"] = namesel.tagName == "A" ? new URL(namesel.href, url.href).href : (element.querySelector("a") ? new URL(element.querySelector("a").href, url.href).href : url.href);
        }
        if (pricesel) {
            priceit = pricesel.textContent;
            for (let word of blacklistprice) {
                priceit = priceit.replaceAll(word, "");
            }
            if (rentireusd.test(priceit)) {
                item["currency"] = "USD";
                priceit.replaceAll(rentireusd, "");
            } else if (priceit.includes("$") || priceit.includes("UYU")) {
                item["currency"] = "UYU";
                priceit.replaceAll(rentireusd, "");
            }
            item["currency"] ?
                (item["price"] = priceit
                    .trim()
                    .replaceAll(/[^\d,-.,]/g, "")
                    .replaceAll(" ", "")) :
                (item["price"] = priceit.trim());
        }
        if (element.querySelector(selectors.image)) {
            let imageel = element.querySelector(selectors.image);
            if (imageel) {
                if (
                    imageel.getAttribute("data-src") &&
                    !imageel.getAttribute("data-src").includes("data:image")
                ) {
                    let line = imageel.getAttribute("data-src").split(/\r?\n/)[0];
                    if (line.match("(gif|jpe?g|bmp|png)")) {
                        image = line.split(" ")[0];
                    }
                }
                if (imageel.src && !image) {
                    if (!imageel.src.includes("data:image")) {
                        let line = imageel.src.split(/\r?\n/)[0];
                        if (line.match("(gif|jpe?g|bmp|png)")) {
                            image = line.split(" ")[0];
                        }
                    }
                }
                if (image) {
                    let imgurl = new URL(image, url.href).href;
                    item["image"] = imgurl;
                } else {
                    item["image"] = "https://via.placeholder.com/150";
                }
            }
        }
        if (
            Object.keys(item).length > 0 &&
            item["name"] != "" &&
            item["price"] != ""
        ) {
            item["id"] = makeid(10);
            item["store"] = url.hostname;
            arr.add(item);
        }
    }

    return arr;
}