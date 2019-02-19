import React from "react";
import {Map, Marker, Popup} from 'react-leaflet';
import {dynamicMapLayer} from 'esri-leaflet';
import {Loader} from 'semantic-ui-react'

import '../styles/map.css';
import L from 'leaflet';

const dimensions = {
    a4landscape: {height: 413, width: 582},
    a4portrait: {height: 582, width: 413},
};

const iconHome = new L.Icon({
    iconUrl: require('./../images/home1.svg'),
    iconRetinaUrl: require('./../images/home1.svg'),
    iconAnchor: null,
    popupAnchor: null,
    shadowUrl: null,
    shadowSize: null,
    shadowAnchor: null,
    iconSize: new L.Point(30, 40)
});

const url = "//webgis.erg.kcl.ac.uk/arcgis/rest/services/Nowcast_London/MapServer/";

const Combined_Now = dynamicMapLayer({
    url: url,
    opacity: 0.5,
    useCors: false,
    layers: [0, 1, 2, 3],
    token: "NTrAeJNB906bugzBcShT1znqJI1-YjH4No3_VZHE4f03bMtZXMnxaRIZ7kaLxqJM"
});



const PM25_Annual = dynamicMapLayer({
    url: url,
    opacity: 0.15,
    layers: [3],
    useCors: false
});



const CARTO_BlackWhite =  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
});

class LeafletMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            map: undefined,
            orientation: 'a4landscape',
            latitude: props.latitude,
            longitude: props.longitude,
            pollutant: props.pollutant,
            showBasemap: props.showBasemap,
            loading: props.loading,
            campusInfo: props.campusInfo
        };
    }

    componentWillReceiveProps(props) {
        const map = this.refs.map.leafletElement;
        this.setState({
            orientation: props.orientation,
            latitude: props.latitude,
            longitude: props.longitude,
            showBasemap: props.showBasemap,
            loading: props.loading,
            campusInfo: props.campusInfo

        }, () => {
            setTimeout(function () {
                map.invalidateSize()
            }, 400);
        })
    }

    toggleBasemap(show){
        const map = this.refs.map.leafletElement;
        if(!show){
            map.removeLayer(CARTO_BlackWhite);
        }else{
            CARTO_BlackWhite.addTo(map);
        }
    }

    componentDidMount() {
        const map = this.refs.map.leafletElement;
        Combined_Now.addTo(map);
        CARTO_BlackWhite.addTo(map)
    }
    render() {
        const {orientation, latitude, longitude, loading, campusInfo} = this.state;
        const mapSize = dimensions[orientation];

        const position = [latitude, longitude];
        return (
            <div className="map-poster" style={{height: mapSize.height, width: mapSize.width}}>
                <div id='inner-poster'>

                    <Loader active={loading} />
                    <Map center={position} zoom={this.props.zoom} ref='map' id="map"
                         style={{
                             height: (mapSize.height - 40),
                             width: '100%',
                             borderBottom: 'thick double #427d9a',
                             paddingBottom: '5px'
                         }}>
                        {campusInfo &&  campusInfo.map((item, index)=> {
                            const position = [item.lat, item.lng];
                            return <Marker
                                draggable={true}
                                position={position}
                            >
                                <Popup> {item.name} </Popup>
                            </Marker>
                        })}

                    </Map>
                </div>
            </div>
        );
    }
}

export default LeafletMap;
