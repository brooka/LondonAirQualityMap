import axios from "axios";

export const httpFetch = (url) => {
    return axios.get(url);
};

export const httpFetchWithHeader = (url) => {
    return axios(url, {headers: { "Content-Type": "application/xml" }});
};