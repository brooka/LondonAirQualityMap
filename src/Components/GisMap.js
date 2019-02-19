import React from "react";
import { Map, loadModules  } from 'react-arcgis';
import GisLayers from './GisLayers';
class GisMap extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            map: null,
            view: null,
            zoom: props.zoom,
            width: props.width,
            height: props.height,
            lat: props.lat,
            lng: props.lng
        };

        this.handleMapLoad = this.handleMapLoad.bind(this);
    }

    componentWillReceiveProps(props){
        console.log(props);
        console.log(this);
    }

    handleMapLoad(map, view) {
        this.setState({ map: map});
    }

    render(){
        const {zoom, width, height, lat, lng} = this.state;
        return (
            <div>
                <Map
                    className="gismap"
                    mapProperties={{ basemap: 'gray' }}
                    viewProperties={{
                        center: [lat, lng],
                        zoom: zoom
                    }}
                    style={{width: width, height: height}}
                >
                    <GisLayers handleMapLoad={this.handleMapLoad}
                    />
                </Map>
            </div>
        );
    }
}
export default GisMap;
