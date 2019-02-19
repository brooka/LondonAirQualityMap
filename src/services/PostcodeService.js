import {httpFetch} from "./Http";

export const getLocationForPostcode = (postcode) => {
    return new Promise(function (resolve, reject) {
        let protocol = 'http:';
        if (window.location.protocol === 'https:') {
            protocol = 'https:';
        }
        httpFetch(protocol + '//api.postcodes.io/postcodes/' + postcode)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
    })
};

export const getPostcodeForLocation = (lat, lng) => {
    return new Promise(function (resolve, reject) {
        let protocol = 'http:';
        if (window.location.protocol === 'https:') {
            protocol = 'https:';
        }
        httpFetch(`${protocol}//api.postcodes.io/postcodes?lon=${lng}&lat=${lat}`)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
    })
};

export const validatePostcode = (postcode) => {
    return new Promise(function (resolve, reject) {
        let protocol = 'http:';
        if (window.location.protocol === 'https:') {
            protocol = 'https:';
        }
        httpFetch(`${protocol}//api.postcodes.io/postcodes/${postcode}/validate`)
            .then(function (response) {
                resolve(response);
            })
            .catch(function (error) {
                reject(error);
            });
    })
};