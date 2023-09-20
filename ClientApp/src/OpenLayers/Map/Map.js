import React, { useRef, useState, useEffect } from "react"
import "./Map.css";
import MapContext from "./MapContext";
import * as ol from "ol";
import { TileLayer, VectorLayer } from "../Layers";
import {OSM, Vector as VectorSource} from 'ol/source.js';
import Draw from 'ol/interaction/Draw.js';
import {Tile as OLTileLayer, Vector as OLVectorLayer} from 'ol/layer.js';

const raster = new OLTileLayer({
	source: new OSM()
});

let typeSelectValue = 'Polygon';

const source = new VectorSource({wrapX: false});

const vector = new OLVectorLayer({
	source: source,
	style: {
		'fill-color': 'rgba(255, 255, 255, 0.2)',
		'stroke-color': '#ffcc33',
		'stroke-width': 2,
		'circle-radius': 7,
		'circle-fill-color': '#ffcc33',
	  },
});

const Map = ({ children, zoom, center }) => {
	const mapRef = useRef();
	const [map, setMap] = useState(null);

	// on component mount
	useEffect(() => {
		let options = {
			view: new ol.View({ zoom, center }),
			layers: [raster, vector],
			controls: [],
			overlays: []
		};

		let mapObject = new ol.Map(options);
		mapObject.setTarget(mapRef.current);
		setMap(mapObject);

		return () => mapObject.setTarget(undefined);
	}, []);

	// zoom change handler
	useEffect(() => {
		if (!map) return;

		map.getView().setZoom(zoom);
	}, [zoom]);

	// center change handler
	useEffect(() => {
		if (!map) return;

		map.getView().setCenter(center)
	}, [center])

	return (
		<MapContext.Provider value={{ map }}>
			<div ref={mapRef} className="ol-map">
				{children}
			</div>
		</MapContext.Provider>
	)
}

let draw;
function addInteraction(typeSelectValue) {
	const value = typeSelectValue;
	if (value !== 'None') {
	  draw = new Draw({
		source: source,
		type: typeSelectValue,
	  });
	  Map.addInteraction(draw);
	}
}

//addInteraction();

export default Map;