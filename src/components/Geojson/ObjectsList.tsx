import { Feature, FeatureCollection } from "geojson";
import { useMemo } from "react";

type ObjectsListProps = {
  geojson?: FeatureCollection | Feature | null | undefined;
  onItemClick: (item: string) => void;
};

export const ObjectsList = ({ geojson, onItemClick }: ObjectsListProps) => {
  // Extract properties from GeoJSON
  const extractProperties = () => {
    if (!geojson) return [];
    if (
      "type" in geojson &&
      geojson.type === "FeatureCollection" &&
      geojson.features
    ) {
      const props = geojson.features.map((feature, idx) => ({
        id: feature.id || `feature-${idx}`,
        properties: feature.properties || {},
        geometryType: feature.geometry?.type || "Unknown",
      }));
      return props;
    } else if ("type" in geojson && geojson.type === "Feature") {
      const props = {
        id: geojson.id || "feature-0",
        properties: geojson.properties || {},
        geometryType: geojson.geometry?.type || "Unknown",
      };
      return [props];
    }
    return [];
  };

  const featuresWithProperties = useMemo(() => extractProperties(), [geojson]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col flex-1 overflow-y-auto min-h-0 max-h-[calc(100vh-10rem)] gap-4 p-4">
        {featuresWithProperties.length > 0 ? (
          featuresWithProperties.map((feature) => (
            <section key={feature.id}>
              <div className="overflow-x-auto bg-white rounded-md border border-gray-200 ">
                <table className="min-w-full text-left text-sm">
                  <tbody>
                    <tr className="bg-gray-100 border-b border-gray-200">
                      <th
                        className="px-4 py-2 font-medium text-gray-700 text-xs underline cursor-pointer"
                        colSpan={2}
                        onClick={() => onItemClick(feature.id as string)}
                      >
                        {feature.id.toString().slice(0, 30)}...
                      </th>
                    </tr>
                    <tr className="bg-blue-50">
                      <td className="px-4 py-2 font-mono text-xs text-blue-600">
                        Type
                      </td>
                      <td className="px-4 py-2 font-mono text-xs text-blue-800">
                        {feature.geometryType}
                      </td>
                    </tr>
                    {Object.entries(feature.properties)
                      .splice(0, 3)
                      .map(([key, value], idx) => (
                        <tr
                          key={key}
                          className={`
                            ${idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
                            hover:bg-gray-100
                          `}
                        >
                          <td className="px-4 py-2 font-mono text-gray-700">
                            {key}
                          </td>
                          <td className="px-4 py-2 font-mono text-gray-800">
                            {typeof value === "object"
                              ? JSON.stringify(value)
                              : String(value)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        ) : (
          <div className="text-gray-400 text-center py-16">
            No properties found in GeoJSON data
          </div>
        )}
      </div>
    </div>
  );
};
