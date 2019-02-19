import React from 'react'
import { Icon, Table } from 'semantic-ui-react'
import {
    pm10IndexBackgroundColor,
    pm25IndexBackgroundColor,
    o3IndexBackgroundColor,
    no2IndexBackgroundColor,
    getNo2Index,
    getO3Index,
    getPM10Index,
    getPM25Index,
    getHeathAdviceForIndex,
    getSmileyForIndexGeneral,
    getSmileyForIndexAtRisk
} from './../services/SpeciesIndexColorSettings'
const CampusTable = (props) => (
    <Table celled structured>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell rowSpan='2'>Location</Table.HeaderCell>
                <Table.HeaderCell colSpan='4'>Pollutant</Table.HeaderCell>
            </Table.Row>
            <Table.Row>
                <Table.HeaderCell>NO<sub>2</sub></Table.HeaderCell>
                <Table.HeaderCell>O<sub>3</sub></Table.HeaderCell>
                <Table.HeaderCell>PM10</Table.HeaderCell>
                <Table.HeaderCell>PM2.5</Table.HeaderCell>

            </Table.Row>
        </Table.Header>

        <Table.Body>
            {props.campusInfo.map((item, index) => {
             let results = item.results;
             if(results){
                 console.log(results);
                 let nO2Attributes = results[2].attributes;
                 let o3Attributes = results[3].attributes;
                 let pm10Attributes = results[4].attributes;
                 let pm25Attributes = results[5].attributes;

                 return <Table.Row key={index}>
                     <Table.Cell>{item.name}</Table.Cell>

                     <Table.Cell  style={{
                         color: 'white',
                         backgroundColor: no2IndexBackgroundColor(nO2Attributes['Pixel Value'])
                     }} textAlign='center'>{(nO2Attributes['Pixel Value'] > -1000) ? getNo2Index(nO2Attributes['Pixel Value']) : ''}</Table.Cell>
                     <Table.Cell  style={{
                         color: 'white',
                         backgroundColor: o3IndexBackgroundColor(o3Attributes['Pixel Value'])
                     }} textAlign='center'>{(o3Attributes['Pixel Value'] > -1000) ? getO3Index(o3Attributes['Pixel Value']) : ''}</Table.Cell>
                     <Table.Cell style={{
                         color: 'white',
                         backgroundColor: pm10IndexBackgroundColor(pm10Attributes['Pixel Value'])
                     }} textAlign='center'>{(pm10Attributes['Pixel Value'] > -1000) ? getPM10Index(pm10Attributes['Pixel Value']) : ''}</Table.Cell>
                     <Table.Cell style={{
                         color: 'white',
                         backgroundColor: pm25IndexBackgroundColor(pm25Attributes['Pixel Value'])
                     }} textAlign='center'>{(pm25Attributes['Pixel Value'] > -1000) ? getPM25Index(pm25Attributes['Pixel Value']) : ''}
                     </Table.Cell>
                 </Table.Row>
             }
            })}
        </Table.Body>
    </Table>
)

export default CampusTable
