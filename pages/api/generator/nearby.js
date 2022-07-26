import { Client } from "@googlemaps/google-maps-services-js";

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
    let lng = req.query.lng;
    let lat = req.query.lat;
    console.log(lat, lng);
    const client = new Client({});

    var params = {
        location: { lat: lat, lng: lng },
        radius: 500,
        type: ["store"],
        key: process.env.GOOGLE_API_KEY
    };
    let places = await client.placesNearby(params, (err, response) => {
        if (err) {
            throw err;
        } else {
            return response;
        }
    });
    console.log(places);
    return res.end(places);
});