export const getNo2Index = (rawValue) => {
    let index = 0;
    if (rawValue <= 67) {
        index = 1;
    } else if (rawValue <= 134) {
        index = 2;
    } else if (rawValue <= 200) {
        index = 3;
    } else if (rawValue <= 267) {
        index = 4;
    } else if (rawValue <= 334) {
        index = 5;
    } else if (rawValue <= 400) {
        index = 6;
    } else if (rawValue <= 467) {
        index = 7;
    } else if (rawValue <= 534) {
        index = 8;
    } else if (rawValue <= 600) {
        index = 9;
    } else if (rawValue > 600) {
        index = 10;
    }
    return index;
};

export const getO3Index = (rawValue) => {
    let index = 0;
    if (rawValue <= 33) {
        index = 1;
    } else if (rawValue <= 66) {
        index = 2;
    } else if (rawValue <= 100) {
        index = 3;
    } else if (rawValue <= 120) {
        index = 4;
    } else if (rawValue <= 140) {
        index = 5;
    } else if (rawValue <= 160) {
        index = 6;
    } else if (rawValue <= 187) {
        index = 7;
    } else if (rawValue <= 213) {
        index = 8;
    } else if (rawValue <= 240) {
        index = 9;
    } else if (rawValue > 240) {
        index = 10;
    }
    return index;
};

export const getPM10Index = (rawValue) => {
    let index = 0;
    if (rawValue <= 16) {
        index = 1;
    } else if (rawValue <= 33) {
        index = 2;
    } else if (rawValue <= 50) {
        index = 3;
    } else if (rawValue <= 58) {
        index = 4;
    } else if (rawValue <= 66) {
        index = 5;
    } else if (rawValue <= 75) {
        index = 6;
    } else if (rawValue <= 83) {
        index = 7;
    } else if (rawValue <= 91) {
        index = 8;
    } else if (rawValue <= 100) {
        index = 9;
    } else if (rawValue > 100) {
        index = 10;
    }
    return index;
};

export const getPM25Index = (rawValue) => {
    let index = 0;
    if (rawValue <= 11) {
        index = 1;
    } else if (rawValue <= 23) {
        index = 2;
    } else if (rawValue <= 35) {
        index = 3;
    } else if (rawValue <= 41) {
        index = 4;
    } else if (rawValue <= 47) {
        index = 5;
    } else if (rawValue <= 53) {
        index = 6;
    } else if (rawValue <= 58) {
        index = 7;
    } else if (rawValue <= 64) {
        index = 8;
    } else if (rawValue <= 70) {
        index = 9;
    } else if (rawValue > 70) {
        index = 10;
    }
    return index;
};

export const no2IndexBackgroundColor = (rawValue) => {
    const index = getNo2Index(rawValue);
    switch (index) {
        case 1: {
            return rawValue <= 33 ? '#5cb8de' : '#2e71c8';
            break;
        }
        case 2: {
            return rawValue <= 105 ? '#004da8' : '#a3cc7a';
            break;
        }
        case 3: {
            return rawValue <= 167 ? '#66a33e' : '#2b8100';
            break;
        }
        case 4: {
            return '#e6b88a';
            break;
        }
        case 5: {
            return '#ff994d';
            break;
        }
        case 6: {
            return '#f36100';
            break;
        }
        case 7: {
            return '#d40000';
            break;
        }
        case 8: {
            return '#A30001';
            break;
        }
        case 9: {
            return '#7a0000';
            break;
        }
        case 10: {
            return '#000000';
            break;
        }
        default: {
            return '#ffffff';
        }
    }
};

export const o3IndexBackgroundColor = (rawValue) => {
    const index = getO3Index(rawValue);
    switch (index) {
        case 1: {
            return rawValue <= 17 ? '#5cb8de' : '#2e71c8';
            break;
        }
        case 2: {
            return rawValue <= 50 ? '#004da8' : '#a3cc7a';
            break;
        }
        case 3: {
            return rawValue <= 83 ? '#66a33e' : '#2b8100';
            break;
        }
        case 4: {
            return '#e6b88a';
            break;
        }
        case 5: {
            return '#ff994d';
            break;
        }
        case 6: {
            return '#f36100';
            break;
        }
        case 7: {
            return '#d40000';
            break;
        }
        case 8: {
            return '#A30001';
            break;
        }
        case 9: {
            return '#7a0000';
            break;
        }
        case 10: {
            return '#000000';
            break;
        }
        default: {
            return '#ffffff';
        }
    }
};


export const pm10IndexBackgroundColor = (rawValue) => {

    const index = getPM10Index(rawValue);
    switch (index) {
        case 1: {
            return rawValue <= 8 ? '#5cb8de' : '#2e71c8';
            break;
        }
        case 2: {
            return rawValue <= 24 ? '#004da8' : '#a3cc7a';
            break;
        }
        case 3: {
            return rawValue <= 41 ? '#66a33e' : '#2b8100';
            break;
        }
        case 4: {
            return '#e6b88a';
            break;
        }
        case 5: {
            return '#ff994d';
            break;
        }
        case 6: {
            return '#f36100';
            break;
        }
        case 7: {
            return '#d40000';
            break;
        }
        case 8: {
            return '#A30001';
            break;
        }
        case 9: {
            return '#7a0000';
            break;
        }
        case 10: {
            return '#000000';
            break;
        }
        default: {
            return '#ffffff';
        }
    }
};

export const pm25IndexBackgroundColor = (rawValue) => {
    const index = getPM25Index(rawValue);

    switch (index) {
        case 1: {
            return rawValue <= 6 ? '#5cb8de' : '#2e71c8';
            break;
        }
        case 2: {
            return rawValue <= 17 ? '#004da8' : '#a3cc7a';
            break;
        }
        case 3: {
            return rawValue <= 29 ? '#66a33e' : '#2b8100';
            break;
        }
        case 4: {
            return '#e6b88a';
            break;
        }
        case 5: {
            return '#ff994d';
            break;
        }
        case 6: {
            return '#f36100';
            break;
        }
        case 7: {
            return '#d40000';
            break;
        }
        case 8: {
            return '#A30001';
            break;
        }
        case 9: {
            return '#7a0000';
            break;
        }
        case 10: {
            return '#000000';
            break;
        }
        default: {
            return '#ffffff';
        }
    }
};

export const getHeathAdviceForIndex = (index) => {
    let advice = {};
    if (index <= 3) {
        advice = {
            atRisk: "Enjoy your usual outdoor activities.",
            generalPopulation: "Enjoy your usual outdoor activities."
        };
    } else if (index <= 6) {
        advice = {
            atRisk: "Adults and children with lung problems, and adults with heart problems, who experience symptoms, should consider reducing strenuous physical activity, particularly outdoors.",
            generalPopulation: "Enjoy your usual outdoor activities."
        };
    } else if (index <= 9) {
        advice = {
            atRisk: "Adults and children with lung problems, and adults with heart problems, should reduce strenuous physical exertion, particularly outdoors, and particularly if they experience symptoms. People with asthma may find they need to use their reliever inhaler more often. Older people should also reduce physical exertion.",
            generalPopulation: "Anyone experiencing discomfort such as sore eyes, cough or sore throat should consider reducing activity, particularly outdoors."
        };
    } else if (index == 10) {
        advice = {
            atRisk: "Adults and children with lung problems, adults with heart problems, and older people, should avoid strenuous physical activity. People with asthma may find they need to use their reliever inhaler more often.",
            generalPopulation: "Reduce physical exertion, particularly outdoors, especially if you experience symptoms such as cough or sore throat."
        };
    }
    return advice;
};
