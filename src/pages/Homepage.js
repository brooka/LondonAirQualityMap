import React, {Component} from 'react'
import {
    Button,
    Container,
    Divider,
    Grid,
    Header,
    Form,
    Radio,
    Segment,
    Input,
    Select,
    Checkbox,
    Loader
} from 'semantic-ui-react'
import AnimationHome from './../Components/AnimationHome';
import LeafletMap from './../Components/LeafletMap';
import {getLocationForPostcode, validatePostcode, getPostcodeForLocation} from './../services/PostcodeService';
import '../styles/font-styles.css';
import kclLogo from './../images/kcl-logo.svg';
import domtoimage from 'retina-dom-to-image';
import {saveAs} from 'file-saver';
import {MapTextLegend} from '../../src/Components/PollutantLegend';
import {fetchAllFromMapServer} from '../../src/services/PollutionLocationService';
import {PollutionBadges, LocationNotes, EULimitValuesTable} from './../Components/InfoOverlays';

import _ from 'lodash';

const options = [
    {key: 'l', text: 'Landscape', value: 'a4landscape'},
    {key: 'p', text: 'Portrait', value: 'a4portrait'},
];

const displayOptions = {
    'a4landscape': {printWidth: 1165, printHeight: 826, displayWidth: 582, displayHeight: 413},
    'a4portrait': {printWidth: 826, printHeight: 1165, displayWidth: 413, displayHeight: 582}
};

const pollutants = {
    NO2: 'Nitrogen Dioxide',
    PM10: 'PM10 Particulates',
    PM25: 'PM2.5 Particulates'
};

const PosterLabel = ({text, reportingMode}) => (
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

const Footer = () => (
    <Segment inverted vertical style={{padding: '5em 0em', marginTop: '300px'}}>
        <Container>
            <Grid divided inverted stackable>
                <Grid.Row>
                    <Grid.Column width={16}>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    </Segment>)

class Homepage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pollutant: 'NO2',
            orientation: 'a4landscape',
            latitude: 51.511873,
            longitude: -0.115959,
            footerText: '',
            zoom: 15,
            showLegend: false,
            showEULimits: false,
            showBasemap: true,
            postcode: 'WC2R 2LS',
            postcodeValid: true,
            pollutionValues: undefined,
            loading: false
        };
        this.updatePreview = this.updatePreview.bind(this);
        this.onZoomEvent = this.onZoomEvent.bind(this);
        this.takeScreenshot = this.takeScreenshot.bind(this);
        this.updatePreview();
        this.updateCaption = this.updateCaption.bind(this);
        this.toggleLegend = this.toggleLegend.bind(this);
        this.toggleEULimits = this.toggleEULimits.bind(this);

        this.toggleBasemap = this.toggleBasemap.bind(this);
        this.updateLatLng = this.updateLatLng.bind(this);
        this.updatePollutionValues = this.updatePollutionValues.bind(this);

    }

    takeScreenshot(orientationSettings) {
        domtoimage.toPng(document.getElementById('map-poster'), {
            quality: 1,
            width: orientationSettings.printWidth,
            height: orientationSettings.printHeight
        })
            .then(function (blob) {
                saveAs(blob, 'map.png');
            });
    }

    handleChange = (e, {value}) => {
        this.setState({pollutant: value}, () => {
            this.updateCaption();
        })
    };
    handleOrientationChange = (e, {value}) => {
        this.setState({orientation: value})
    };

    handlePostcodeChange = (e, {value}) => {
        this.setState({postcode: value, postcodeValid: false}, () => {
            if (value.length >= 5) {
                validatePostcode(value).then((res) => {
                    if (res.data.result) {
                        this.setState({postcodeValid: true});
                        this.updatePreview();
                    }
                })
                    .catch(function (error) {
                        console.log("invalid")
                    });
            }
        });

    };

    handleFooterChange = (e, {value}) => {
        this.setState({footerText: value})
    };

    updateLatLng(lat, lng) {
        this.updatePollutionValues(lat, lng);
        this.setState({latitude: lat, longitude: lng}, () => {
            getPostcodeForLocation(lat, lng).then((response) => {
                const postcodes = response.data.result;
                //check if existing postcode is within result array
                const existingPostcode = _.find(postcodes, {'postcode': this.state.postcode.toUpperCase()});
                if (!existingPostcode && postcodes) {
                    const firstPostcode = postcodes[0];
                    //update postcode and local authority
                    this.setState({
                        postcode: firstPostcode.postcode,
                        adminDistrict: firstPostcode.admin_district
                    }, () => {
                        this.updateCaption();
                    })
                }
            });
        });
    }

    updatePollutionValues(lat, lng) {
        fetchAllFromMapServer("//webgis.erg.kcl.ac.uk/arcgis/rest/services/Annual_London/MapServer", lat, lng).then((res) => {
            this.setState({pollutionValues: res.data, loading: false});
        })
    }


    onZoomEvent(e) {
        this.setState({zoom: e.target._zoom});
    }

    updatePreview() {
        getLocationForPostcode(this.state.postcode).then((res) => {
            const result = res.data.result;
            this.setState({
                latitude: result.latitude,
                longitude: result.longitude,
                postcode: result.postcode,
                adminDistrict: result.admin_district,
                loading: true
            }, () => {
                this.updatePollutionValues(result.latitude, result.longitude);
                this.updateCaption();
            })
        });
    }

    updateCaption() {
        const {pollutant, postcode, adminDistrict, showLegend} = this.state;
        this.setState({
            footerText: pollutants[pollutant] + (showLegend ? ' (µg/m³)' : '') + ' - ' + adminDistrict + ', ' + postcode
        })
    }

    toggleLegend(event) {
        event.preventDefault();
        this.setState({showLegend: !this.state.showLegend}, () => {
            this.updateCaption();
        })
    }

    toggleEULimits(event) {
        event.preventDefault();
        this.setState({showEULimits: !this.state.showEULimits})
    }

    toggleBasemap(event) {
        event.preventDefault();
        this.setState({showBasemap: !this.state.showBasemap});
    }

    render() {
        let {pollutant, orientation, latitude, longitude, footerText, postcode, postcodeValid, showLegend, pollutionValues, showEULimits, loading} = this.state;
        const orientationSettings = displayOptions[orientation];

        const landscapeStyle = {bottom: '40px', right: '17px'};
        const portraitStyle = {top: '14px', left: '15px'};
        const keyPosition = (orientation == 'a4landscape' ? landscapeStyle : portraitStyle);
        return (
            <div>
                <Grid doubling textAlign="center" style={{paddingTop: '20px'}}>
                    <Grid.Row>
                        <Grid.Column computer={6} mobile={14} tablet={5}>
                            <Segment>
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
                                <Loader active={loading}/>

                                <Divider horizontal>
                                    Customise your map
                                </Divider>
                                <Form className="mapform">
                                    <Form.Input icon='point' iconPosition='left' error={!postcodeValid}
                                                onChange={this.handlePostcodeChange}
                                                control={Input} label='Postcode' value={postcode}
                                                placeholder='Postcode'/>

                                    <Form.Field onChange={this.handleOrientationChange} control={Select}
                                                label='Orientation' value={orientation} options={options}
                                                placeholder='Orientation'/>
                                    <Form.Field value={footerText} onChange={this.handleFooterChange} control={Input}
                                                label='Caption Text' placeholder='Type...'/>

                                    <div className="field"><label>Pollutant</label></div>

                                    <Form.Group inline>
                                        <Form.Field
                                            control={Radio}
                                            label='Nitrogen Dioxide (NO2)'
                                            value='NO2'
                                            checked={pollutant === 'NO2'}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group inline>
                                        <Form.Field
                                            control={Radio}
                                            label='PM10 Particulates'
                                            value='PM10'
                                            checked={pollutant === 'PM10'}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Form.Group inline>
                                        <Form.Field
                                            control={Radio}
                                            label='PM2.5 Particulates'
                                            value='PM25'
                                            checked={pollutant === 'PM25'}
                                            onChange={this.handleChange}
                                        />
                                    </Form.Group>
                                    <Divider horizontal>
                                        <Header as='h4'>
                                            Optional
                                        </Header>
                                    </Divider>
                                    <Form.Group inline>
                                        <Form.Field
                                            control={Checkbox}
                                            label='Show Legend'
                                            onChange={this.toggleLegend}
                                            checked={showLegend}

                                        />
                                    </Form.Group>
                                    <Form.Group inline>
                                        <Form.Field
                                            control={Checkbox}
                                            label='Show EU Limits'
                                            onChange={this.toggleEULimits}
                                            checked={showEULimits}

                                        />
                                    </Form.Group>
                                </Form>
                            </Segment>
                            <Form.Group inline>
                                <Form.Field color='teal' onClick={() => {
                                    this.takeScreenshot(orientationSettings)
                                }} control={Button}>Export</Form.Field>

                            </Form.Group>
                        </Grid.Column>
                        <Grid.Column computer={10} mobile={16} tablet={11}>
                            <Segment style={{minWidth: orientationSettings.displayWidth + 20}}>
                                <Divider horizontal>
                                    Preview
                                </Divider>
                                <div className="posterBorder" style={{
                                    width: orientationSettings.displayWidth,
                                    height: orientationSettings.displayHeight
                                }}>

                                    <div style={{position: 'relative'}} id="map-poster">
                                        <img alt="kcl-logo" src={kclLogo} style={{
                                            position: 'absolute',
                                            height: '55px',
                                            top: '15px',
                                            right: '15px',
                                            zIndex: '99999',
                                            background: 'white',
                                            padding: '2px',
                                        }}/>
                                        {showLegend ? <div style={{
                                            position: 'absolute',
                                            left: '15px',
                                            bottom: '40px',
                                            zIndex: '99998',
                                            background: 'white',
                                            paddingLeft: '3px',
                                            paddingTop: '3px',
                                            paddingBottom: '3px',
                                            paddingRight: '3px',

                                        }}>
                                            <MapTextLegend pollutant={pollutant}/>
                                        </div> : ''}
                                        <LeafletMap zoom={this.state.zoom} orientation={orientation} latitude={latitude}
                                                    longitude={longitude} pollutant={pollutant}
                                                    updateLatLng={this.updateLatLng}
                                                    loading={loading}
                                                    onZoomEvent={this.onZoomEvent}/>
                                        <PosterLabel style={{whiteSpace: 'nowrap'}} text={footerText}/>

                                        {pollutionValues && showEULimits ? <div style={{
                                            ...keyPosition,
                                            position: 'absolute',
                                            zIndex: '99998',
                                            background: 'white',
                                            paddingLeft: '3px',
                                            paddingTop: '3px',
                                            paddingBottom: '3px',
                                            paddingRight: '3px',

                                        }}>
                                            <EULimitValuesTable orientation={orientation} pollutionValues={pollutionValues}/>
                                        </div>  : ''}

                                    </div>
                                </div>

                                <br/>
                                <small style={{textAlign: 'left'}}>
                                    This map was used with permission from The Greater London Authority and Transport
                                    for
                                    London, who fund, develop and maintain the London Atmospheric Emissions Inventory.
                                    For
                                    more information please visit <a href="data.london.gov.uk"> data.london.gov.uk </a>
                                </small>
                                <br/>
                                <Divider horizontal>
                                    EU Annual Mean Limit Values
                                </Divider>
                                {pollutionValues ? <div style={{textAlign: 'left', fontSize: '12px'}}>
                                    <LocationNotes postcode={postcode} pollutionValues={pollutionValues}/></div> : ''}
                                For more information please refer to the <a
                                href="https://uk-air.defra.gov.uk/assets/documents/Air_Quality_Objectives_Update.pdf"
                                target="_blank">'National air quality objectives and European Directive limit and target
                                values for the protection of human health'</a>.

                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default Homepage;
