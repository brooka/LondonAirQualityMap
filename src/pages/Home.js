import React, {Component} from 'react'
import {
    Button,
    Divider,
    Grid,
    Form,
    Segment,
    Loader
} from 'semantic-ui-react';
import LeafletMap from '../components/LeafletMap';
import {getLocationForPostcode, validatePostcode, getPostcodeForLocation} from './../services/PostcodeService';
import '../styles/font-styles.css';
import '../styles/home.css';
import domtoimage from 'retina-dom-to-image';
import {saveAs} from 'file-saver';
import {MapTextLegend} from '../components/PollutantLegend';
import {fetchAllFromMapServer} from '../../src/services/PollutionLocationService';
import {EULimitValuesTable} from '../components/LimitValueInformation';
import _ from 'lodash';
import {
    EULimitInformation,
    IntroductionSection,
    MapPermission,
    PosterForm,
    PosterLabel
} from "../components/CustomiseMap";

const displayOptions = {
    a4landscape: {printWidth: 1165, printHeight: 826, displayWidth: 582, displayHeight: 413},
    a4portrait: {printWidth: 826, printHeight: 1165, displayWidth: 413, displayHeight: 582}
};

const pollutants = {
    NO2: 'Nitrogen Dioxide',
    PM10: 'PM10 Particulates',
    PM25: 'PM2.5 Particulates'
};

class Home extends Component {
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
        this.handleOrientationChange = this.handleOrientationChange.bind(this);

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
                        console.log("invalid postcode")
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
        fetchAllFromMapServer("//webgis.erg.ic.ac.uk/ergwebsvr/rest/services/Annual_London/MapServer", lat, lng).then((res) => {
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
        let {
            pollutant,
            orientation: posterOrientation,
            latitude,
            longitude,
            footerText,
            postcode,
            postcodeValid,
            showLegend,
            pollutionValues,
            showEULimits,
            loading
        } = this.state;
        const orientationSettings = displayOptions[posterOrientation];

        const landscapeStyle = {bottom: '40px', right: '17px'};
        const portraitStyle = {top: '14px', left: '15px'};
        const keyPosition = (posterOrientation === 'a4landscape' ? landscapeStyle : portraitStyle);
        return (
            <div>
                <Grid doubling textAlign="center" style={{paddingTop: '20px'}}>
                    <Grid.Row>
                        <Grid.Column computer={6} mobile={14} tablet={5}>
                            <Segment>

                                <IntroductionSection/>
                                <Loader active={loading}/>

                                <Divider horizontal>
                                    Customise your map
                                </Divider>
                                <PosterForm
                                    postcodeValid={postcodeValid}
                                    postcode={postcode}
                                    posterOrientation={posterOrientation}
                                    footerText={footerText}
                                    pollutant={pollutant}
                                    showLegend={showLegend}
                                    showEULimits={showEULimits}
                                    toggleLegend={this.toggleLegend}
                                    toggleEULimits={this.toggleEULimits}
                                    handleChange={this.handleChange}
                                    handleFooterChange={this.handleFooterChange}
                                    handleOrientationChange={this.handleOrientationChange}
                                    handlePostcodeChange={this.handlePostcodeChange}/>
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
                                        <LeafletMap zoom={this.state.zoom} orientation={posterOrientation}
                                                    latitude={latitude}
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
                                            <EULimitValuesTable orientation={posterOrientation}
                                                                pollutionValues={pollutionValues}/>
                                        </div> : ''}

                                    </div>
                                </div>

                                <br/>
                                <MapPermission/>
                                <br/>
                                <EULimitInformation pollutionValues={pollutionValues} postcode={postcode}/>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default Home;
