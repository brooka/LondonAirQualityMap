import React from "react";
import {Map, Marker} from 'react-leaflet';
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

const url = "//webgis.erg.kcl.ac.uk/arcgis/rest/services/Annual_London/MapServer";

const NO2_Annual = dynamicMapLayer({
    url: url,
    opacity: 0.15,
    layers: [0],
    useCors: false
});

const PM10_Annual = dynamicMapLayer({
    url: url,
    opacity: 0.15,
    layers: [2],
    useCors: false
});

const PM25_Annual = dynamicMapLayer({
    url: url,
    opacity: 0.15,
    layers: [3],
    useCors: false
});

const gisMaps = {
    NO2: NO2_Annual,
    PM10: PM10_Annual,
    PM25: PM25_Annual
};

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
            loading: props.loading
        };
        this.toggleBasemap = this.toggleBasemap.bind(this);
        this.handleMarkerDrag = this.handleMarkerDrag.bind(this);
    }

    componentWillReceiveProps(props) {
        const map = this.refs.map.leafletElement;
        const orientationChanged = this.state.orientation !== props.orientation;
        this.setState({
            orientation: props.orientation,
            latitude: props.latitude,
            longitude: props.longitude,
            showBasemap: props.showBasemap,
            loading: props.loading
        }, () => {
            if (props.pollutant !== this.state.pollutant || orientationChanged) {
                map.removeLayer(gisMaps[this.state.pollutant]);
                this.setState({pollutant: props.pollutant}, () => {
                    gisMaps[this.state.pollutant].addTo(map);
                    setTimeout(function () {
                        map.invalidateSize()
                    }, 400);
                })
            }
            this.panToLocation(props.latitude, props.longitude);
        });

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
        gisMaps[this.state.pollutant].addTo(map);
        CARTO_BlackWhite.addTo(map)

        map.on('click', function (e) {
            const {lat, lng} = e.latlng;
            this.props.updateLatLng(lat, lng);
        }.bind(this));
    }

    panToLocation(lat, lng) {
        let map = this.refs.map.leafletElement;
        map.setView(new L.LatLng(lat, lng));
    }

    handleMarkerDrag(e) {
        const latlng = e.target._latlng;
        this.props.updateLatLng(latlng.lat,latlng.lng);
    }

    render() {
        const {orientation, latitude, longitude, loading} = this.state;
        const position = [latitude, longitude];
        const mapSize = dimensions[orientation];
        return (
            <div className="map-poster" style={{height: mapSize.height, width: mapSize.width}}>
                <div id='inner-poster'>

                    <Loader active={loading} />
                    <Map onZoomend={this.props.onZoomEvent} center={position} zoom={this.props.zoom} ref='map' id="map"
                         style={{
                             height: (mapSize.height - 40),
                             width: '100%',
                             borderBottom: 'thick double #427d9a',
                             paddingBottom: '5px'
                         }}>
                        <Marker
                            draggable={true}
                            position={position}
                            icon={iconHome}
                            onDragEnd={this.handleMarkerDrag}
                        >
                        </Marker>
                    </Map>
                </div>
            </div>
        );
    }
}

export default LeafletMap;
