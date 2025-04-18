import React from "react";

import MapHeatmap from "@/components/ui/HeatmapGlobe";

import "maplibre-gl/dist/maplibre-gl.css";

const HeatmapGlobe = () => {
  return (
    <div>
      <MapHeatmap />
    </div>
  );
};

export default HeatmapGlobe;
