import { MapFields } from "../../App";
import { useMemo } from "react";

type CodeGeneratorProps = {
  mapFields: MapFields;
  CSVUrl: string;
};

export const CodeGenerator = ({ mapFields, CSVUrl }: CodeGeneratorProps) => {
  // Create URL with parameters
  const iframeUrl = useMemo(() => {
    const params = new URLSearchParams();
    params.append("csvUrl", encodeURIComponent(CSVUrl));
    params.append("mapFields", encodeURIComponent(JSON.stringify(mapFields)));

    // Assuming the iframe should load from a relative path
    return `/map?${params.toString()}`;
  }, [mapFields, CSVUrl]);

  return (
    <div>
      <div>
        <h2>Embed Code</h2>
        <textarea className="border w-full">
          {`<iframe src="${window.location.origin}${iframeUrl}" width="100%" height="500px" style="border: 1px solid #ccc"></iframe>`}
        </textarea>
      </div>
    </div>
  );
};
