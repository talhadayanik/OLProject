import React, { Component, useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import './custom.css';
import './App.css';
import ParcelItem from './components/ParcelItem';
import {
  interaction, layer, custom, control, //name spaces
  Interactions, Overlays, Controls,     //group
  Map, Layers, Overlay, Util    //objects
} from "react-openlayers";

const App = () => {

  const BASE_URL = "https://localhost:7141";

  const [parcels, setParcels] = useState([]);

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
      
      <Map view={{center:[0, 0], zoom:2}}>
        <Layers>
          <layer.Tile></layer.Tile>
        </Layers>
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
