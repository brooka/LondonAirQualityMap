import {httpFetch} from './Http';

export const getConfig = () => {
    let protocol = 'http:';
    if (window.location.protocol == 'https:') {
        protocol = 'https:';
    }
    return httpFetch(protocol + '//www.londonair.org.uk/react/config/campusData.json');
};