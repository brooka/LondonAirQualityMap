import React from "react";
import tinycolor from "tinycolor2";

const no2LegendValues = [
    {value: '-16', colour: '00f'},
    {value: '16', colour: '0064ff'},
    {value: '19', colour: '0078ff'},
    {value: '22', colour: '0096ff'},
    {value: '25', colour: '00c8ff'},
    {value: '28', colour: '00dcff'},
    {value: '31', colour: '00dcc8'},
    {value: '34', colour: '00dc96'},
    {value: '37', colour: 'c8f064'},
    {value: '40', colour: 'ffff00'},
    {value: '43', colour: 'fff500'},
    {value: '46', colour: 'ffeb00'},
    {value: '49', colour: 'ffe100'},
    {value: '52', colour: 'ffd700'},
    {value: '55', colour: 'ffcd00'},
    {value: '58', colour: 'ffa000'},
    {value: '61', colour: 'ff7d00'},
    {value: '64', colour: 'ff6400'},
    {value: '67', colour: 'ff5000'},
    {value: '70', colour: 'ff3c00'},
    {value: '73', colour: 'ff2800'},
    {value: '76', colour: 'ff1400'},
    {value: '79', colour: 'ff0000'},
    {value: '82', colour: 'e60000'},
    {value: '85', colour: 'd20000'},
    {value: '88', colour: 'be0000'},
    {value: '91', colour: 'aa0000'},
    {value: '94', colour: '820000'},
    {value: '97+', colour: '500000'}
];

const pm10LegendValues = [
    {value: '-16', colour: '000096'},
    {value: '16', colour: '0000c8'},
    {value: '19', colour: '0000ff'},
    {value: '22', colour: '0046ff'},
    {value: '25', colour: '008cff'},
    {value: '28', colour: '00d2ff'},
    {value: '31', colour: '64ffff'},
    {value: '34', colour: '64ff96'},
    {value: '37', colour: 'c7fe96'},
    {value: '40', colour: 'ffff00'},
    {value: '43', colour: 'ffdc00'},
    {value: '55', colour: 'ffb400'},
    {value: '58', colour: 'ff6400'},
    {value: '73', colour: 'ff0000'},
    {value: '76', colour: 'c80000'},
    {value: '97+', colour: '460000'}
];

const pm25LegendValues = [
    {value: '<13', colour: '0000ff'},
    {value: '13', colour: '0046ff'},
    {value: '15', colour: '008cff'},
    {value: '17', colour: '00d2ff'},
    {value: '19', colour: '64ffff'},
    {value: '21', colour: '64ff96'},
    {value: '23', colour: 'ffff00'},
    {value: '25', colour: 'ffdc00'},
    {value: '27', colour: 'ffdc00'},
    {value: '>33', colour: 'ffb400'}
];

const legendMap = {
    NO2: no2LegendValues,
    PM25: pm25LegendValues,
    PM10: pm10LegendValues
}

export const MapColourLegend = (props) => (
    <div style={{textAlign: 'center', zIndex: '99999'}}>{legendMap[props.pollutant].map((item, i) =>
        <div key={i} style={{backgroundColor: `#${item.colour}`, height: 12, width: 15}}></div>)}
    </div>
);

export const MapTextLegend = (props) => (
    <div>{legendMap[props.pollutant].slice(0).reverse().map((item, i) => {
            var color = tinycolor(`#${item.colour}`);
            color.setAlpha(0.2);
            return (
                <div key={i} style={{height: 12, width: 20, lineHeight: '1em', backgroundColor: `${color.toRgbString()}`}}>
                    <div className="legend-font" style={{fontSize: '8px', verticalAlign: 'text-top', fontWeight: '600'}}>{item.value}
                    </div>
                </div>
            )
        }
    )}
    </div>
);