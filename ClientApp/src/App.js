import React, { useState, useEffect, useRef } from 'react';
import './custom.css';
import './App.css';
import ParcelItem from './components/ParcelItem';
import 'ol/ol.css';
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector';
import WKT from 'ol/format/WKT';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { Draw, Snap } from 'ol/interaction';
import APICaller from './networking/APICaller';
import { Button, Form } from 'semantic-ui-react';
import ReactModal from 'react-modal';


const App = () => {

  const [didLoadOnce, setDidLoadOnce] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [parcels, setParcels] = useState([]);
  const mapRef = useRef();
  const [map, setMap] = useState();
  const [raster, setRaster] = useState(new TileLayer({ source: new OSM(), }));
  const [vectorSource, setVectorSource] = useState(new VectorSource());
  const [format, setFormat] = useState(new WKT());
  const [parcelId, setParcelId] = useState();
  const [province, setProvince] = useState();
  const [district, setDistrict] = useState();
  const [neighborhood, setNeighborhood] = useState();
  const [parcelWkt, setParcelWkt] = useState();
  const [selectedType, setSelectedType] = useState("Polygon");

  let [wkt, setWkt] = useState("");
  let draw, snap;
  var location;
  var feature;

  useEffect(() => {
    createMap();
    getAll();
  }, []);

  useEffect(() => {
    getAll();
  }, [parcels]);

  const vector = new VectorLayer({
    source: vectorSource,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.4)',
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33',
        }),
      }),
    }),
  });

  const addInteractions = (selectedType) => {
    draw = new Draw({
      source: vectorSource,
      type: selectedType,
    });
    map.addInteraction(draw);
    draw.on('drawend', (event) => {
      feature = event.feature;
      location = feature.getGeometry().getCoordinates();
      var formattedWkt = format.writeFeature(feature);
      setWkt(formattedWkt);
      if (formattedWkt) {
        setIsAddModalOpen(!isAddModalOpen);
      }
      map.getInteractions().pop();
    });
    snap = new Snap({ source: vectorSource });
    map.addInteraction(snap);
  }

  const createMap = () => {
    const initMap = new Map({
      target: mapRef.current,
      layers: [
        raster,
        vector
      ],
      view: new View({
        projection: 'EPSG:3857',
        center: [0.0, 0.0],
        zoom: 2
      })
    });
    setMap(initMap);
    initMap.once("rendercomplete", function () {
      getAll();
    })
  }
  
  function getAll(){
    APICaller.getAllParcels().then(data => {
      setParcels(data);
      if (data && data.length > 0) {
        data.forEach(element => {
          if (element.parcelWkt) {
            const elementFeature = format.readFeature(element.parcelWkt, {
              dataProjection: 'EPSG:3857',
              featureProjection: 'EPSG:3857',
            });
            elementFeature.set('Id', element.id);
            elementFeature.set('Province', element.province);
            elementFeature.set('District', element.district);
            elementFeature.set('Neighborhood', element.neighborhood);
            elementFeature.set('ParcelWkt', element.parcelWkt);
            vectorSource.addFeature(elementFeature);
          }
        });
      }
    })
  }

  const toggleAddModal = () => {
    var f = vectorSource.getFeatures()[vectorSource.getFeatures().length - 1];
    setVectorSource(vectorSource.removeFeature(f));
    setIsAddModalOpen(!isAddModalOpen);
  }

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  }

  function addParcel(){
    let parcel = { province: province, district: district, neighborhood: neighborhood, parcelWkt: wkt };
    APICaller.addParcel(parcel).then((res) => {
      setParcelId("");
      setProvince("");
      setDistrict("");
      setNeighborhood("");
      setParcelWkt("");
      console.log(res);
    })
    setIsAddModalOpen(!isAddModalOpen);
    getAll();
  }

  const edit = () => {
    map.getInteractions().forEach(x => x.setActive(false));
    map.on("dblclick", function (e) {
      map.forEachFeatureAtPixel(e.pixel, function (feature) {
        setParcelId(feature.values_.Id);
        setProvince(feature.values_.Province);
        setDistrict(feature.values_.District);
        setNeighborhood(feature.values_.Neighborhood);
        setParcelWkt(feature.values_.ParcelWkt);
        setIsEditModalOpen(!isEditModalOpen);
      })
    })
  }

  function editAParcel(parcel){
    setParcelId(parcel.id);
    setProvince(parcel.province);
    setDistrict(parcel.district);
    setNeighborhood(parcel.neighborhood);
    setParcelWkt(parcel.parcelWkt);
    setIsEditModalOpen(!isEditModalOpen);
  }
  

  const deleteParcel = () => {
    APICaller.delete(parcelId).then((res) => {
      console.log(res);
    });
    setIsEditModalOpen(!isEditModalOpen)
    vectorSource.clear();
    getAll();
  };

  const updateParcel = (e) => {
    let parcel = { Id: parcelId, Province: province, District: district, Neighborhood: neighborhood, ParcelWkt: parcelWkt }
    APICaller.update(parcel).then((res) => {
      console.log(res);
      setParcelId("");
      setProvince("");
      setDistrict("");
      setNeighborhood("");
      setParcelWkt("");
    })
    vectorSource.clear();
    getAll();
    setIsEditModalOpen(!isEditModalOpen);
  }

  return(
    <>
      <div className='app'>
        <h1>OLProject</h1>
      </div>

      <div ref={mapRef} id="map" className="map" ></div>

      <div className='flexbox-container'>

        <div className='general'>
          <h1>&nbsp;Select draw shape:&nbsp;&nbsp;&nbsp;</h1>
        </div>

        <div className='selector-container'>
            <select name='typeSelect' defaultValue="Polygon"
             value={selectedType} onChange={e => setSelectedType(e.target.value)}>
                <option value="Point">Point</option>
                <option value="LineString">LineString</option>
                <option value="Polygon">Polygon</option>
                <option value="Circle">Circle</option>
            </select>
        </div>

        <div>
          <Button onClick={() => addInteractions(selectedType)}>Draw</Button>
        </div>

        <div>
          <Button onClick={() => edit()}>Edit</Button>
        </div>

      </div>

      <div className='general'>
        <h1>&nbsp;Parcels: </h1>
      </div>

      {parcels?.length > 0 ? (
          <div>
              {parcels.map((parcel) => (
                <div>
                  <ParcelItem parcel={parcel} key={parcel.Id}/>
                  <Button onClick={() => editAParcel(parcel)}>Edit</Button>
                </div>
              ))}
          </div>
        ) : (
          <div className='general'>
            <h2>No parcels found</h2>
          </div>
      )}

      <ReactModal
        isOpen={isAddModalOpen}
        contentLabel='Add Parcel'
        ariaHideApp={true}
      >

          <Form>
            <Form.Field>
              <input
                placeholder='Province'
                onChange={e => setProvince(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder='District'
                onChange={e => setDistrict(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder='Neighborhood'
                onChange={e => setNeighborhood(e.target.value)}
              />
            </Form.Field>
          </Form>
          <Button primary onClick={() => addParcel()}>Add</Button>
          <Button negative onClick={() => toggleAddModal()}>Cancel</Button>
        
      </ReactModal>

      <ReactModal
        isOpen={isEditModalOpen}
        contentLabel='Edit Parcel'
        ariaHideApp={true}
      >

          <Form>
            <Form.Field>
              <input
                placeholder='Province'
                value={province}
                onChange={e => setProvince(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder='District'
                value={district}
                onChange={e => setDistrict(e.target.value)}
              />
            </Form.Field>
            <Form.Field>
              <input
                placeholder='Neighborhood'
                value={neighborhood}
                onChange={e => setNeighborhood(e.target.value)}
              />
            </Form.Field>
          </Form>
          <Button primary onClick={() => updateParcel()}>Update</Button>
          <Button negative onClick={() => deleteParcel()}>Delete</Button>
          <Button onClick={() => toggleEditModal()}> Cancel</Button>
        
      </ReactModal>

    </>    
  );
}

export default App;
