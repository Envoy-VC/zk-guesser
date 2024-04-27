'use client';

import React from 'react';
import { Marker, Popup, TileLayer, useMapEvent } from 'react-leaflet';

import { useMapStore } from '~/lib/stores';

import { Icon } from 'leaflet';
import { LeafletMouseEvent } from 'leaflet';
import MarkerIcon from 'leaflet/dist/images/marker-icon.png';
import MarkerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

const MiniMap = () => {
  const { markers, updateMarker } = useMapStore();

  useMapEvent('click', (e: LeafletMouseEvent) => {
    updateMarker('guess', [e.latlng.lat, e.latlng.lng]);
  });

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
        position={markers.guess}
      >
        <Popup>Guess</Popup>
      </Marker>
      {markers.answer && (
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
          position={markers.answer}
        >
          <Popup>Answer</Popup>
        </Marker>
      )}
    </>
  );
};

export default MiniMap;
