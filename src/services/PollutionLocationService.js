import {httpFetch} from "./Http";

export const fetchValuesFromGIS = (url, lat, lng) => {
    return new Promise(function (resolve, reject) {
        let gisURL = buildURL(url, lat, lng);
        httpFetch(gisURL)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
    })
};

export const fetchAllFromMapServer = (url, lat, lng) => {
    return new Promise(function (resolve, reject) {
        let gisURL = buildURL(url, lat, lng, true);
        httpFetch(gisURL)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
    })
};

export const fetchAllFromMapServerWithToken = (url, lat, lng, token) => {
    return new Promise(function (resolve, reject) {
        let gisURL = buildURLWithToken(url, lat, lng, true, token);
        httpFetch(gisURL)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
    })
};

function buildURL(baseURL, lat, long, all) {
    var identifyURL = "/identify?";
    var endURL = "&returnGeometry=false&f=json";

    var geometryType = "esriGeometryPoint";
    var layers = all ? "all" : "0";
    var sr = "4326";
    var tolerance = "1";

    var imageDisplay = "750,500,96";

    var dynamicMapExtent = getMapExtent(lat, long);
    var geometryDynamic = long + "," + lat;

    var parameters = "geometry=" + geometryDynamic + "&geometryType=" + geometryType + "&layers=" + layers + "&sr=" + sr
        + "&tolerance=" + tolerance + "&mapExtent=" + dynamicMapExtent + "&imageDisplay=" + imageDisplay;

    var returnURL = baseURL + identifyURL + parameters + endURL;

    return returnURL;
}

function buildURLWithToken(baseURL, lat, long, all, gisToken) {
    var identifyURL = "/identify?";
    var endURL = "&returnGeometry=false&f=json";

    var geometryType = "esriGeometryPoint";
    var layers = all ? "all" : "0";
    ;
    var sr = "4326";
    var tolerance = "1";

    var imageDisplay = "750,500,96";

    var dynamicMapExtent = getMapExtent(lat, long);
    var geometryDynamic = long + "," + lat;
    var referrer = "localhost";
    var parameters = "geometry=" + geometryDynamic + "&geometryType=" + geometryType + "&layers=" + layers + "&sr=" + sr
        + "&tolerance=" + tolerance + "&mapExtent=" + dynamicMapExtent + "&imageDisplay=" + imageDisplay + "&token=" + gisToken + "&referrer=" + referrer;

    var returnURL = baseURL + identifyURL + parameters + endURL;

    return returnURL;
}


function getMapExtent(lat, long) {
    //generate extent box
    var latFloat = parseFloat(lat);
    var longFloat = parseFloat(long);

    var LONG_DIFF_FIRST = -0.007736;
    var LONG_DIFF_SECOND = -0.00962876;
    var LAT_DIFF_FIRST = 0;
    var LAT_DIFF_SECOND = -0.003339;

    return (longFloat - LONG_DIFF_FIRST) + "," + (latFloat + LAT_DIFF_FIRST) + "," + (longFloat - LONG_DIFF_SECOND) + "," + (latFloat - LAT_DIFF_SECOND);
}