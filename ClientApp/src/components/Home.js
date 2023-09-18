import React, { Component } from 'react';
import {interaction, layer, custom, control, interactions, Overlays, Controls, Map, Layers, Overlay, Util} from "react-openlayers"

export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        <Map view={{center:[0, 0], zoom:2}}>
          <Layers>
            <layer.Tile></layer.Tile>
          </Layers>
        </Map>ß
      </div>
    );
  }
}
