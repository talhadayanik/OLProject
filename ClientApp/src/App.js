import React, { Component, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './custom.css';
import './App.css';
import ParcelItem from './components/ParcelItem';
import Map from "./OpenLayers/Map";
import { Layers, TileLayer, VectorLayer } from "./OpenLayers/Layers";
import { Style, Icon } from "ol/style";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { osm, vector } from "./OpenLayers/Source";
import { fromLonLat, get } from "ol/proj";
import GeoJSON from "ol/format/GeoJSON";
import { Controls, FullScreenControl } from "./OpenLayers/Controls";
import FeatureStyles from "./OpenLayers/Features/Styles";
import mapConfig from "./map_config.json";
import Draw from 'ol/interaction/Draw.js';
import View from 'ol/View.js';

function addMarkers(lonLatArray) {
  var iconStyle = new Style({
    image: new Icon({
      anchorXUnits: "fraction",
      anchorYUnits: "pixels",
      src: mapConfig.markerImage32,
    }),
  });
  let features = lonLatArray.map((item) => {
    let feature = new Feature({
      geometry: new Point(fromLonLat(item)),
    });
    feature.setStyle(iconStyle);
    return feature;
  });
  return features;
}

const App = () => {

  const BASE_URL = "https://localhost:7141";

  const [parcels, setParcels] = useState([]);
  const [center, setCenter] = useState(mapConfig.center);
  const [zoom, setZoom] = useState(9);
  const [features, setFeatures] = useState();

  const getAllParcels = async () => {
    
    const response = await fetch(`${BASE_URL}/api/Parcels`, {
      method: 'GET'
    });

    const data = await response.json();
  
    setParcels(data);
    console.log(JSON.stringify(data));
  };

  useEffect(() => {
    getAllParcels();
  }, []);

  return(
    <>
      <div className='app'>
        <h1>OLProject</h1>
      </div>

      <Map center={fromLonLat(center)} zoom={zoom}>
        <Layers>
        <TileLayer source={osm()} zIndex={0} />
        </Layers>
        <Controls>
          <FullScreenControl />
        </Controls>
      </Map>
      
      {parcels?.length > 0 ? (
        <div>
            {parcels.map((parcel) => (
              <ParcelItem parcel={parcel} key={parcel.id}/>
            ))}
        </div>
        ) : (
          <div className='general'>
            <h2>No parcels found</h2>
          </div>
      )}
    </>    
  );
}

export default App;
