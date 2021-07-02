import React from "react";
import {loadModules} from 'react-arcgis';

class GisMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            featureLayer: null
        };
    }

    render() {
        return null;
    }

    componentWillMount() {
        loadModules(['esri/layers/FeatureLayer', 'esri/layers/MapImageLayer', 'esri/widgets/LayerList', 'esri/widgets/BasemapGallery']).then(([FeatureLayer, MapImageLayer, LayerList, BasemapGallery]) => {
            const mapLayer = new MapImageLayer({
                url: "//webgis.erg.ic.ac.uk/ergwebsvr/rest/services/laei_2013/2020_NO2_LAEI2013/MapServer",
                opacity: 0.1,
                visible: true,
                sublayers: [
                    {
                        id: 0,
                        visible: true
                    }]
            });

            const layerList = new LayerList({
                view: this.props.view,
                listItemCreatedFunction: function (event) {
                    const item = event.item;
                    item.panel = {
                        content: "legend",
                        open: true
                    };
                }
            });
            var basemapGallery = new BasemapGallery({
                view: this.props.view
            });
            this.props.map.add(mapLayer);
            this.setState({mapLayer});
            this.props.handleMapLoad(this.props.map);
        }).catch((err) => console.error(err));
    }

    componentWillUnmount() {
        this.props.map.remove(this.state.mapLayer);
    }
}

export default GisMap;
