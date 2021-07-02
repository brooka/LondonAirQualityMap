import React from "react";
import {Checkbox, Divider, Form, Input, Radio, Select} from "semantic-ui-react";
import {LocationNotes} from "./LimitValueInformation";

const options = [
    {key: 'l', text: 'Landscape', value: 'a4landscape'},
    {key: 'p', text: 'Portrait', value: 'a4portrait'},
];

export const MapPermission = () => (
    <small style={{textAlign: 'left'}}>
        This map was used with permission from The Greater London Authority and Transport
        for
        London, who fund, develop and maintain the London Atmospheric Emissions Inventory.
        For
        more information please visit <a href="data.london.gov.uk"> data.london.gov.uk </a>
    </small>
)

export const IntroductionSection = () => (
    <div>
        <Divider horizontal>
            Introduction
        </Divider>
        <div style={{textAlign: 'left', fontSize: '12px'}}>
            This map shows the annual mean pollution for NO2, PM10 and PM2.5 across London, the
            data is based on most recent year for which an accurate model is available, 2013.
            <br/> You may explore the air pollution in London by clicking on an area of the map
            or entering a postcode below. <br/> <b> The 'Export' button will download a high
            quality PNG image of the previewed map</b>.
        </div>
    </div>
);

export const PosterLabel = ({text, reportingMode}) => (
    <div style={{
        position: 'absolute',
        marginTop: -50,
        zIndex: '9999',
        width: '100%',
        left: '10px'
    }}>
        <h6 style={{position: 'absolute', whiteSpace: 'nowrap'}} className='retroshadow'>{text}</h6>
    </div>
);
export const PosterForm = (props) => {
    const {
        toggleLegend,
        toggleEULimits,
        postcodeValid,
        postcode,
        posterOrientation,
        footerText,
        pollutant,
        showLegend,
        showEULimits,
        handleFooterChange,
        handlePostcodeChange,
        handleOrientationChange,
        handleChange
    } = props;
    console.log(props);
    return <Form className="mapform">
        <Form.Input icon='point' iconPosition='left' error={!postcodeValid}
                    onChange={handlePostcodeChange}
                    control={Input} label='Postcode' value={postcode}
                    placeholder='Postcode'/>

        <Form.Field onChange={handleOrientationChange} control={Select}
                    label='Orientation' value={posterOrientation} options={options}
                    placeholder='Orientation'/>
        <Form.Field value={footerText} onChange={handleFooterChange} control={Input}
                    label='Caption Text' placeholder='Type...'/>

        <div className="field"><label>Pollutant</label></div>

        <Form.Group inline>
            <Form.Field
                control={Radio}
                label='Nitrogen Dioxide (NO2)'
                value='NO2'
                checked={pollutant === 'NO2'}
                onChange={handleChange}
            />
        </Form.Group>
        <Form.Group inline>
            <Form.Field
                control={Radio}
                label='PM10 Particulates'
                value='PM10'
                checked={pollutant === 'PM10'}
                onChange={handleChange}
            />
        </Form.Group>
        <Form.Group inline>
            <Form.Field
                control={Radio}
                label='PM2.5 Particulates'
                value='PM25'
                checked={pollutant === 'PM25'}
                onChange={handleChange}
            />
        </Form.Group>
        <Divider horizontal>
            OPTIONAL
        </Divider>
        <Form.Group inline>
            <Form.Field
                control={Checkbox}
                label='Show Legend'
                onChange={toggleLegend}
                checked={showLegend}

            />
        </Form.Group>
        <Form.Group inline>
            <Form.Field
                control={Checkbox}
                label='Show EU Limits'
                onChange={toggleEULimits}
                checked={showEULimits}
            />
        </Form.Group>
    </Form>
};

export const EULimitInformation = (props) => (

    <div>
        <Divider horizontal>
            EU Annual Mean Limit Values
        </Divider>
        {props.pollutionValues ? <div style={{textAlign: 'left', fontSize: '12px'}}>
            <LocationNotes postcode={props.postcode} pollutionValues={props.pollutionValues}/></div> : ''}
        For more information please refer to the <a
        href="https://uk-air.defra.gov.uk/assets/documents/Air_Quality_Objectives_Update.pdf"
        target="_blank" rel="noopener noreferrer">'National air quality objectives and European Directive limit and
        target
        values for the protection of human health'</a>.
    </div>
)