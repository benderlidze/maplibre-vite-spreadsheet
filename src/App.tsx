import { useState } from "react";
import { CSVBox } from "./components/CSVBox";
import { MapView } from "./components/MapView";

export type MapFields = {
  latField: string;
  lngField: string;
  nameField: string;
  descField: string;
};

export const MainApp = () => {
  const [mapFields, setMapFields] = useState<MapFields>({
    latField: "",
    lngField: "",
    nameField: "",
    descField: "",
  });

  const [mapData, setMapData] = useState<GeoJSON.FeatureCollection | null>(
    null
  );

  return (
    <div className="w-full p-6">
      <div className="flex flex-col gap-5 ">
        https://docs.google.com/spreadsheets/d/1GkiV0OF9ifo512SYUzbBzjMXnc1eI8puAdEBkdfYKxs
        <div className="bg-white rounded-lg w-full ">
          <h2 className="text-xl font-bold ">Google Spreadsheet Viewer</h2>
          <CSVBox setMapFields={setMapFields} setMapData={setMapData} />
        </div>
        <div className=" ">
          <MapView mapData={mapData} />
        </div>
        {JSON.stringify(mapFields)}
      </div>
    </div>
  );
};
