import {httpFetch} from "./Http";

export const fetchAllFromMapServer = (url, lat, lng) => {
    const gisURL = buildURL(url, lat, lng, true);
    return httpFetch(gisURL);
};

const buildURL = (baseURL, lat, long, all) => {

    //https://developers.arcgis.com/rest/services-reference/enterprise/identify-map-service-.htm#
    const identifyURL = '/identify?';
    const endURL = '&returnGeometry=false&f=json';
    const geometryType = 'esriGeometryPoint';
    const layers = all ? 'all' : '0';
    const sr = '4326';
    const tolerance = '1';
    const imageDisplay = '750,500,96';
    const dynamicMapExtent = getMapExtent(lat, long);
    const geometryDynamic = `${long} , ${lat}`;
    const parameters = `geometry=${geometryDynamic}&geometryType=${geometryType}&layers=${layers}&sr=${sr}&tolerance=${tolerance}&mapExtent=${dynamicMapExtent}&imageDisplay=${imageDisplay}`;
    const returnURL = baseURL + identifyURL + parameters + endURL;

    return returnURL;
}

const getMapExtent = (lat, long) => {
    //generate extent box
    const latFloat = parseFloat(lat);
    const longFloat = parseFloat(long);

    const LONG_DIFF_FIRST = -0.007736;
    const LONG_DIFF_SECOND = -0.00962876;
    const LAT_DIFF_FIRST = 0;
    const LAT_DIFF_SECOND = -0.003339;

    return (longFloat - LONG_DIFF_FIRST) + "," + (latFloat + LAT_DIFF_FIRST) + "," + (longFloat - LONG_DIFF_SECOND) + "," + (latFloat - LAT_DIFF_SECOND);
}