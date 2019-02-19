import React from 'react'
import {Label, Icon, Table} from 'semantic-ui-react'
import _ from 'lodash'

const POLLUTANT_ENUM = {NO2_2013: "NO2_2013", PM10_2013: "PM10_2013", PM25_2013: "PM25_2013"};

export const PollutionBadges = (props) => {
    const results = props.pollutionValues.results;
    const orientation = props.orientation;
    const no2_values = _.filter(results, {layerName: POLLUTANT_ENUM.NO2_2013})[0];
    const pm10_values = _.filter(results, {layerName: POLLUTANT_ENUM.PM10_2013})[0];
    const pm25_values = _.filter(results, {layerName: POLLUTANT_ENUM.PM25_2013})[0];

    const no2Passes = passObjective(POLLUTANT_ENUM.NO2_2013, no2_values.attributes['Pixel Value']);
    const pm10Passes = passObjective(POLLUTANT_ENUM.PM10_2013, pm10_values.attributes['Pixel Value']);
    const pm25Passes = passObjective(POLLUTANT_ENUM.PM25_2013, pm25_values.attributes['Pixel Value']);

    const landscapeStyle = {bottom: '4px', right: '9px'};
    const portraitStyle = {top: '14px', left: '15px'};

    const badgePosition = (orientation == 'a4landscape' ? landscapeStyle : portraitStyle);
    return <div style={
        {
            ...badgePosition,
            position: 'absolute',
            zIndex: '9999',
            background: 'transparent',
            paddingLeft: '1px',
            paddingRight: '1px',
            paddingTop: '0px',
            paddingBottom: '1px',
            borderRadius: '5px'
        }}><Label as='div' circular size='mini' color={no2Passes ? 'green' : 'red'} style={{width: '40px'}}>
        NO2
    </Label>
        <Label as='div' circular size='mini' color={pm10Passes ? 'green' : 'red'} style={{width: '40px'}}>
            PM10
        </Label>
        <Label as='div' circular size='mini' color={pm25Passes ? 'green' : 'red'} style={{width: '40px'}}>
            PM2.5
        </Label>
    </div>
}

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
    }
};

export const PollutionLabels = () => {
    return <div style={{
        position: 'absolute',
        marginTop: '-27px',
        zIndex: '9999',
        width: '150px',
        right: '10px',
        textAlign: 'right'
    }}><Label as='a' size='mini' color='green'>
        <Icon name='thumbs up'/> NO2
    </Label>
        <Label as='a' size='mini' color='green'>
            <Icon name='thumbs up'/> PM10
        </Label>
        <Label as='a' size='mini' color='green'>
            <Icon name='thumbs up'/> PM2.5
        </Label>
    </div>
}

export const EULimitValuesTable = (props) => {

    const results = props.pollutionValues.results
    const no2_values = _.filter(results, {layerName: POLLUTANT_ENUM.NO2_2013})[0];
    const pm10_values = _.filter(results, {layerName: POLLUTANT_ENUM.PM10_2013})[0];
    const pm25_values = _.filter(results, {layerName: POLLUTANT_ENUM.PM25_2013})[0];

    const no2Passes = passObjective(POLLUTANT_ENUM.NO2_2013, no2_values.attributes['Pixel Value']);
    const pm10Passes = passObjective(POLLUTANT_ENUM.PM10_2013, pm10_values.attributes['Pixel Value']);
    const pm25Passes = passObjective(POLLUTANT_ENUM.PM25_2013, pm25_values.attributes['Pixel Value']);
    return (
        <Table id='euTable' style={{width: '150px', fontSize: '8px', textAlign: 'center'}} basic='very' collapsing>
            <Table.Body>
                <Table.Row>
                    <Table.Cell><b>Pollutant</b></Table.Cell>
                    <Table.Cell><b>EU Limit</b></Table.Cell>
                    <Table.Cell><b>Estimated</b></Table.Cell>
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
    const results = props.pollutionValues.results
    const no2_values = _.filter(results, {layerName: POLLUTANT_ENUM.NO2_2013})[0];
    const pm10_values = _.filter(results, {layerName: POLLUTANT_ENUM.PM10_2013})[0];
    const pm25_values = _.filter(results, {layerName: POLLUTANT_ENUM.PM25_2013})[0];

    const no2Passes = passObjective(POLLUTANT_ENUM.NO2_2013, no2_values.attributes['Pixel Value']);
    const pm10Passes = passObjective(POLLUTANT_ENUM.PM10_2013, pm10_values.attributes['Pixel Value']);
    const pm25Passes = passObjective(POLLUTANT_ENUM.PM25_2013, pm25_values.attributes['Pixel Value']);
    return <div>
        <ul>
            <li>
                NO2 is <b>{Math.round(no2_values.attributes['Pixel Value'])}</b> µg/m³ {no2Passes ? <PassingLabel/> :
                <ExceedingLabel/>} the EU limit of <b> 40</b> µg/m³
            </li>
            <li>
                PM10 is <b>{Math.round(pm10_values.attributes['Pixel Value'])}</b> µg/m³ {pm10Passes ? <PassingLabel/> :
                <ExceedingLabel/>} the EU limit of <b>40</b> µg/m³
            </li>
            <li>
                PM2.5 is <b>{Math.round(pm25_values.attributes['Pixel Value'])}</b> µg/m³ {pm25Passes ?
                <PassingLabel/> : <ExceedingLabel/>} the EU limit of <b> 25</b> µg/m³
            </li>
        </ul>
    </div>
}

const PassingLabel = () => (<span style={{color: 'green'}}> <b>passing</b></span>);
const ExceedingLabel = () => ( <span style={{color: 'red'}}> <b>exceeding</b></span>);