<template>
  <div
    id="maproot"
    style="width: 100%; height: 100%">
  </div>
</template>

<script setup lang="ts">
  import View from "ol/View"
  import Map from "ol/Map"
  import TileLayer from "ol/layer/Tile"
  import OSM from "ol/source/OSM"
  import GeoJSON from "ol/format/GeoJSON"
  import VectorSource from "ol/source/Vector"
  import VectorLayer from "ol/layer/Vector"
  import {fromLonLat} from 'ol/proj'
  import {Circle as CircleStyle, Fill, Stroke, Text, Style} from 'ol/style';
  import { onMounted } from "vue"
  import "ol/ol.css"

  onMounted(async () => {

    var style1 = new Style({
      fill: new Fill({
        color: 'rgba(0, 0, 0, 0.33)'
      }),
      stroke: new Stroke({
        color: '#319FD3',
        width: 2
      }),
      text: new Text({
        font: '18px Calibri,sans-serif',
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 8
        })
      })
    });

    var style2 = new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.63)'
      }),
      stroke: new Stroke({
        color: '#319FD3',
        width: 2
      }),
      text: new Text({
        font: '18px Calibri,sans-serif',
        fill: new Fill({
          color: '#000'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 8
        })
      })
    });

    var vectorSource1 = new VectorSource({
      url: 'http://localhost:3001/src/components/searchbarmodals/spatial/australian-states.min.geojson',
      format: new GeoJSON({ featureProjection: "EPSG:3857" })
    });

    var vectorSource2 = new VectorSource({
      url: 'http://localhost:3001/src/components/searchbarmodals/spatial/australian-suburbs.geojson',
      format: new GeoJSON({ featureProjection: "EPSG:3857" })
    });

    const vectorLayer1 = new VectorLayer({
      source: vectorSource1,
      style: function(feature) {
        let statename = feature.get('STATE_NAME');
        style1.getText().setText(statename);
        return style1;
      }
    });

    const vectorLayer2 = new VectorLayer({
      source: vectorSource2,
      style: function(feature) {
        let areaname = feature.get('AREA_NAME');
        style2.getText().setText(areaname);
        return style2;
      }
    });

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        vectorLayer2,
        vectorLayer1,
      ],
      target: 'maproot',
      view: new View({
        center: fromLonLat([134.70859884651694,-26.457075137967266]),
        zoom: 5,
      }),
    });
    
  });

</script>
