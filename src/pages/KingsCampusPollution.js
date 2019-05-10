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
import LeafletMap from './../Components/CampusMap';
import '../styles/font-styles.css';
import kclLogo from './../images/kcl-logo.svg';
import {saveAs} from 'file-saver';
import {MapColourLegend, MapTextLegend} from '../../src/Components/PollutantLegend';
import {fetchAllFromMapServerWithToken} from '../../src/services/PollutionLocationService';
import CampusTable from '../Components/CampusTable';
import _ from 'lodash';
import {getConfig} from "../../src/services/ExternalConfigRetrieval";

const displayOptions = {
    'a4landscape': {printWidth: 1165, printHeight: 826, displayWidth: 582, displayHeight: 413},
    'a4portrait': {printWidth: 826, printHeight: 1165, displayWidth: 413, displayHeight: 582}
};

const pollutants = {
    NO2: 'Nitrogen Dioxide',
    PM10: 'PM10 Particulates',
    PM25: 'PM2.5 Particulates'
};

const PosterLabel = ({text}) => (
    <div style={{
        position: 'absolute',
        marginTop: '-50px',
        zIndex: '9999',
        width: '100%',
        left: '10px'
    }}>
        <h6 style={{position: 'absolute', whiteSpace: 'nowrap'}} className='retroshadow'>{text}</h6>
    </div>
);

const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];


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
            zoom: 13
        };

        getConfig().then((config)=>{
            console.log(config);
            let campusInfo = config.data;
            //fetchlatests readings
            let promises = []
            campusInfo.map(item => {
                promises.push(fetchAllFromMapServerWithToken("//webgis.erg.kcl.ac.uk/arcgis/rest/services/Nowcast_London/MapServer/", item.lat, item.lng, 'NTrAeJNB906bugzBcShT1znqJI1-YjH4No3_VZHE4f03bMtZXMnxaRIZ7kaLxqJM'));
            });

            Promise.all(promises).then(values => {
                _.each(values, (item, index) => {
                    campusInfo[index].results = item.data.results;
                })
                this.setState({campusInfo: campusInfo});
            })
        });

    }


    render() {
        let {pollutant, orientation, latitude, longitude, campusInfo, showLegend, pollutionValues, showEULimits, loading} = this.state;
        const orientationSettings = displayOptions[orientation];
        const now = new Date();
        var hours = now.getHours() - 1;

        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0'
        const previousHourDateTime = ` @ ${hours}:00${ampm} on ${days[ now.getDay()]} ${now.getDate()}th`;
        return (
            <div>
                <AnimationHome label={"King's Campus Pollution" + previousHourDateTime}/>
                <Grid doubling textAlign="center" style={{paddingTop: '20px'}}>
                    <Grid.Row>
                        <Grid.Column computer={6} mobile={14} tablet={5}>
                            <Segment>
                                {campusInfo ? <CampusTable campusInfo={campusInfo}/> : '' }
                            </Segment>
                        </Grid.Column>
                        <Grid.Column computer={8} mobile={16} tablet={11}>
                            <Segment style={{minWidth: orientationSettings.displayWidth + 20}}>

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
                                                    campusInfo={campusInfo}
                                                    onZoomEvent={this.onZoomEvent}/>

                                    </div>
                                </div>
                            </Segment>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <Footer/>

            </div>
        );
    }
}

export default Homepage;
