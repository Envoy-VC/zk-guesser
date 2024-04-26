'use client';

import React from 'react';
import { Marker, Popup, TileLayer, useMap, useMapEvent } from 'react-leaflet';

import { Icon } from 'leaflet';
import { LeafletMouseEvent } from 'leaflet';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

const MiniMap = () => {
  const map = useMap();

  const [markerPos, setMarkerPos] = React.useState<[number, number]>([
    51.505, -0.09,
  ]);

  const onClick = (e: LeafletMouseEvent) => {
    setMarkerPos([e.latlng.lat, e.latlng.lng]);
  };

  useMapEvent('click', onClick);

  return (
    <>
      <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
      <Marker
        icon={
          new Icon({
            iconUrl: MarkerIcon.src,
            iconRetinaUrl: MarkerIcon.src,
            iconSize: [25, 41],
            iconAnchor: [12.5, 41],
            popupAnchor: [0, -41],
            shadowUrl: MarkerShadow.src,
            shadowSize: [41, 41],
          })
        }
        position={markerPos}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </>
  );
};

export default MiniMap;
