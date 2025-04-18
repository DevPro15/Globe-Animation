"use client";
import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import type { StyleSpecification } from "maplibre-gl";

import headMapImage from "@/data/heatmapImage.json";

const MapHeatmap = () => {
  const mapRef = useRef<maplibregl.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      maxPitch: 95,
      center: [-120, 37.422],
      zoom: 7.25,
      bearing: 57,
      pitch: 71,
      hash: true,
    });

    mapRef.current = map;

    // https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL --> JSON data taken from here
    map.setStyle(headMapImage as StyleSpecification, {
      transformStyle: (previousStyle, nextStyle) => {
        nextStyle.projection = { type: "globe" };
        nextStyle.sources = {
          ...nextStyle.sources,
          terrainSource: {
            type: "raster-dem",
            url: "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=792pTLQN9x7S0DazHxQ9",
            tileSize: 256,
          },
          hillshadeSource: {
            type: "raster-dem",
            url: "https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=792pTLQN9x7S0DazHxQ9",
            tileSize: 256,
          },
        };

        nextStyle.terrain = {
          source: "terrainSource",
          exaggeration: 1,
        };

        nextStyle.sky = {
          "atmosphere-blend": ["interpolate", ["linear"], ["zoom"], 0, 1, 2, 0],
        };

        if (!nextStyle.layers.find((layer) => layer.id === "hills")) {
          nextStyle.layers.push({
            id: "hills",
            type: "hillshade",
            source: "hillshadeSource",
            layout: { visibility: "visible" },
            paint: { "hillshade-shadow-color": "#473B24" },
          });
        }

        return nextStyle;
      },
    });

    map.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true,
      })
    );

    map.addControl(new maplibregl.GlobeControl());
    map.addControl(
      new maplibregl.TerrainControl({
        source: "terrainSource",
        exaggeration: 1,
      })
    );

    map.on("load", () => {
      map.addSource("earthquakes", {
        type: "geojson",
        data: "https://maplibre.org/maplibre-gl-js/docs/assets/earthquakes.geojson",
      });

      map.addLayer({
        id: "earthquakes-heat",
        type: "heatmap",
        source: "earthquakes",
        maxzoom: 9,
        paint: {
          "heatmap-weight": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            0,
            0,
            6,
            1,
          ],
          "heatmap-intensity": [
            "interpolate",
            ["linear"],
            ["zoom"],
            0,
            1,
            9,
            3,
          ],
          "heatmap-color": [
            "interpolate",
            ["linear"],
            ["heatmap-density"],
            0,
            "rgba(33,102,172,0)",
            0.2,
            "rgb(103,169,207)",
            0.4,
            "rgb(209,229,240)",
            0.6,
            "rgb(253,219,199)",
            0.8,
            "rgb(239,138,98)",
            1,
            "rgb(0, 255, 12)",
          ],
          "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 0, 2, 9, 20],
          "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 7, 1, 9, 0],
        },
      });

      map.addLayer({
        id: "earthquakes-point",
        type: "circle",
        source: "earthquakes",
        minzoom: 7,
        paint: {
          "circle-radius": [
            "interpolate",
            ["linear"],
            ["zoom"],
            7,
            ["interpolate", ["linear"], ["get", "mag"], 1, 1, 6, 4],
            16,
            ["interpolate", ["linear"], ["get", "mag"], 1, 5, 6, 50],
          ],
          "circle-color": [
            "interpolate",
            ["linear"],
            ["get", "mag"],
            1,
            "rgba(33,102,172,0)",
            2,
            "rgb(103,169,207)",
            3,
            "rgb(209,229,240)",
            4,
            "rgb(253,219,199)",
            5,
            "rgb(239,138,98)",
            6,
            "rgb(178,24,43)",
          ],
          "circle-stroke-color": "white",
          "circle-stroke-width": 1,
          "circle-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 8, 1],
        },
      });
    });

    return () => {
      map.remove();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />;
};

export default MapHeatmap;
