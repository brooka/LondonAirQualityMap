import React from 'react'
import {Table} from 'semantic-ui-react'
import _ from 'lodash'

const POLLUTANT_ENUM = {NO2_2013: "NO2_2013", PM10_2013: "PM10_2013", PM25_2013: "PM25_2013"};

const passObjective = (pollutant, value) => {
    switch (pollutant) {
        case POLLUTANT_ENUM.NO2_2013 : {
            return value < 40;
        }
        case POLLUTANT_ENUM.PM10_2013 : {
            return value < 40;
        }
        case POLLUTANT_ENUM.PM25_2013 : {
            return value < 25;
        }
        default: {
            return value < 40;
        }
    }
};

export const EULimitValuesTable = (props) => {
    const results = props.pollutionValues.results;
    const {no2_values, pm10_values, pm25_values, no2Passes, pm10Passes, pm25Passes} = getValuesAndPasses(results);
    return (
        <Table id='euTable' style={{width: '150px', fontSize: '8px', textAlign: 'center'}} basic='very' collapsing>
            <Table.Body>
                <Table.Row>
                    <Table.Cell><strong>Pollutant</strong></Table.Cell>
                    <Table.Cell><strong>EU Limit</strong></Table.Cell>
                    <Table.Cell><strong>Estimated</strong></Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell className={no2Passes ? 'positive' : 'negative'}><b>NO2</b></Table.Cell>
                    <Table.Cell>40 µg/m³</Table.Cell>
                    <Table.Cell
                        className={no2Passes ? 'positive' : 'negative'}>{Math.round(no2_values.attributes['Pixel Value'])}
                        µg/m³</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell className={pm10Passes ? 'positive' : 'negative'}><b>PM10</b></Table.Cell>
                    <Table.Cell>40 µg/m³</Table.Cell>
                    <Table.Cell
                        className={pm10Passes ? 'positive' : 'negative'}>{Math.round(pm10_values.attributes['Pixel Value'])}
                        µg/m³</Table.Cell>
                </Table.Row>
                <Table.Row>
                    <Table.Cell className={pm25Passes ? 'positive' : 'negative'}><b>PM2.5</b></Table.Cell>
                    <Table.Cell>25 µg/m³</Table.Cell>
                    <Table.Cell
                        className={pm25Passes ? 'positive' : 'negative'}>{Math.round(pm25_values.attributes['Pixel Value'])}
                        µg/m³</Table.Cell>
                </Table.Row>
            </Table.Body>
        </Table>
    )
};


export const LocationNotes = (props) => {
    const results = props.pollutionValues.results;
    const {no2_values, pm10_values, pm25_values, no2Passes, pm10Passes, pm25Passes} = getValuesAndPasses(results);
    return <div>
        <ul>
            <li>
                NO2 is <strong>{Math.round(no2_values.attributes['Pixel Value'])}</strong> µg/m³ {no2Passes ? <PassingLabel/> :
                <ExceedingLabel/>} the EU limit of <b> 40</b> µg/m³
            </li>
            <li>
                PM10 is <strong>{Math.round(pm10_values.attributes['Pixel Value'])}</strong> µg/m³ {pm10Passes ? <PassingLabel/> :
                <ExceedingLabel/>} the EU limit of <b>40</b> µg/m³
            </li>
            <li>
                PM2.5 is <strong>{Math.round(pm25_values.attributes['Pixel Value'])}</strong> µg/m³ {pm25Passes ?
                <PassingLabel/> : <ExceedingLabel/>} the EU limit of <b> 25</b> µg/m³
            </li>
        </ul>
    </div>
}

const getValuesAndPasses = (results) => {
    const no2_values = _.find(results, {layerName: POLLUTANT_ENUM.NO2_2013});
    const pm10_values = _.find(results, {layerName: POLLUTANT_ENUM.PM10_2013});
    const pm25_values = _.find(results, {layerName: POLLUTANT_ENUM.PM25_2013});

    const no2Passes = passObjective(POLLUTANT_ENUM.NO2_2013, no2_values.attributes['Pixel Value']);
    const pm10Passes = passObjective(POLLUTANT_ENUM.PM10_2013, pm10_values.attributes['Pixel Value']);
    const pm25Passes = passObjective(POLLUTANT_ENUM.PM25_2013, pm25_values.attributes['Pixel Value']);
    return {no2_values, pm10_values, pm25_values, no2Passes, pm10Passes, pm25Passes};
}

const PassingLabel = () => (<span style={{color: 'green'}}> <strong>passing</strong></span>);
const ExceedingLabel = () => (<span style={{color: 'red'}}> <strong>exceeding</strong></span>);