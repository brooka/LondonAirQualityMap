import {httpFetch} from "./Http";

const POSTCODE_IO_URL = `//api.postcodes.io/postcodes`;

export const getLocationForPostcode = (postcode) => {
    return httpFetch(`${POSTCODE_IO_URL}/${postcode}`);
};

export const getPostcodeForLocation = (lat, lng) => {
    return httpFetch(`//${POSTCODE_IO_URL}?lon=${lng}&lat=${lat}`);
};

export const validatePostcode = (postcode) => {
    return httpFetch(`//${POSTCODE_IO_URL}/${postcode}/validate`);
};