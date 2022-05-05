import { getApps, initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import AES from 'crypto-js/aes';

const firequery = query;
const firebaseConfig = {
    apiKey: "AIzaSyBvnhh1tfalJo2a4llWcRKq4u8-zuoDP80",
    authDomain: "tekky-dd9c7.firebaseapp.com",
    projectId: "tekky-dd9c7",
    storageBucket: "tekky-dd9c7.appspot.com",
    messagingSenderId: "687067575293",
    appId: "1:687067575293:web:a9539014646e6634c7df94",
    measurementId: "G-CP91C3HKYZ"
};


if (getApps().length === 0) {
    initializeApp(firebaseConfig);
}

const db = getFirestore();

const axios = require("axios");
const jsdom = require("jsdom");

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

function generateSelector(context, container) {
    let index, pathSelector, localName;

    if (context == null) throw "not an dom reference";
    index = getIndex(context);

    while (context.tagName && context != container) {
        pathSelector = context.localName + (pathSelector ? ">" + pathSelector : "");
        context = context.parentNode;
    }
    pathSelector = pathSelector + `:nth-of-type(${index})`;
    return pathSelector;
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

function getContainer(document, nameel, priceel, imageel) {
    let maxlength = document.body.innerHTML.length;
    let containerel;
    for (let item of document.querySelectorAll('*')) {
        if (item.contains(nameel) && item.contains(priceel) && item.contains(imageel) && item.innerHTML.length < maxlength) {
            containerel = item;
            maxlength = item.innerHTML.length;
        }
    }
    return {
        name: "Container",
        element: containerel,
        selector: generateContSelector(containerel)
    };
}

function getImageElement(nameel) {
    //Ig closest is not a thing on jsdom
    let nextitem = nameel.parentElement;
    while (nextitem.querySelectorAll('img').length == 0) {
        nextitem = nextitem.parentElement;
    }
    let imgel = nextitem.querySelectorAll('img')[0];
    return {
        name: "Image",
        element: imgel,
        selector: '',
    };
}

function getNameElement(document, prod) {
    let maxlength = document.body.innerHTML.length;
    let nameel = null;
    for (let item of document.querySelectorAll('*')) {
        if (item.textContent) {
            if (item.textContent.toLowerCase().includes(prod.toLowerCase()) && item.innerHTML.length < maxlength) {
                nameel = item;
                maxlength = item.innerHTML.length;
            }
        }
    }
    if (!nameel) {
        throw "Name element not found";
    }
    return {
        name: "Name",
        element: nameel,
        selector: '',
    };
}

function getPriceElement(document, nameel) {
    let priceel;
    let rentire = new RegExp("((UYU|USD|U\\$S|U$D|\\$U|\\$) {0,10}.*[0-9].*)", "g");
    let nextitem = (nameel.parentElement) ? nameel.parentElement : nameel;
    let maxlength = document.body.innerHTML.length;
    while (!rentire.test(nextitem.textContent)) {
        if (nextitem.parentElement) {
            nextitem = nextitem.parentElement;
        } else {
            throw "Price element not found";
        }
    }
    for (let item of nextitem.querySelectorAll('*')) {
        if (item.textContent) {
            if (rentire.test(item.textContent) && item.innerHTML.length < maxlength) {
                priceel = item;
                maxlength = item.innerHTML.length;
            }
        }
    }
    return {
        name: "Price",
        element: priceel,
        selector: '',
    };
}

function getSelectors(document, prod, url) {
    let name = getNameElement(document, prod);
    let price = getPriceElement(document, name.element);
    let image = getImageElement(name.element);
    let container = getContainer(document, name.element, price.element, image.element);
    name.selector = generateSelector(name.element, container.element);
    price.selector = generateSelector(price.element, container.element);
    image.selector = generateSelector(image.element, container.element);
    let queryobj = findQueryinurl(document, container.selector, name.selector, url);

    return {
        contsel: container.selector,
        namesel: name.selector,
        pricesel: price.selector,
        imgsel: image.selector,
        query: queryobj.query,
        queryableurl: queryobj.queryableurl,
    }
}

function findQueryinurl(document, contsel, namesel, url) {
    let query = "";
    let urlstr = url.href.replace(url.hostname, "");
    for (let cont of document.querySelectorAll(contsel)) {
        let item = cont.querySelector(namesel);
        console.log(item.innerHTML);
        let nametext = item.textContent.trim();
        console.log(nametext);
        let nameparts = nametext.split(/[^a-zA-Z0-9]/);
        console.log(nameparts);
        for (let part of nameparts) {
            if (part != "") {
                if (Object.values(url.searchParams).includes(part.toLowerCase())) {
                    console.log("Found in queries: " + part.toLowerCase());
                    query = part.toLowerCase();
                    break;
                }
                if (urlstr.toLowerCase().includes(part.toLowerCase()) && query == "") {
                    console.log("Found in url: " + part.toLowerCase());
                    query = part.toLowerCase();
                    break;
                }
            }
        }
        if (query != "") {
            break;
        }
    }

    return {
        query: query,
        queryableurl: url.href.replace(query, "$ValDNT990"),
    }
}

module.exports = allowCors(async(req, res) => {
    let url = new URL(req.query.url);
    let prod = req.query.prod;
    console.log("Querifying: " + req.query.url);
    let snapshot = await getDocs(firequery(collection(db, 'stores'), where("storename", "==", url.hostname)))
    if (snapshot.docs.length == 0) {
        var response = await axios.get(req.query.url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36"
            }
        }).then(function(res) {
            let doc = new jsdom.JSDOM(res.data).window.document;
            return getSelectors(doc, prod, url);
        });

        let newdoc = {
            id: makeid(10),
            storename: url.hostname,
            queryableurl: response.queryableurl,
            contsel: response.contsel,
            namesel: response.namesel,
            pricesel: response.pricesel,
            imgsel: response.imgsel
        }
        addDoc(collection(db, 'stores'), newdoc);
        let encrypted = AES.encrypt(JSON.stringify(newdoc), process.env.SECRET)
        return res.send(encrypted.toString());
    } else {
        console.log("Found store in db");
        console.log(snapshot.docs[0].data());
        let encrypted = AES.encrypt(JSON.stringify(snapshot.docs[0].data()), process.env.SECRET)
        return res.send(encrypted.toString());
    }


});