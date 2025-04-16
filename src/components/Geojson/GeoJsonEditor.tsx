import CodeMirror from "@uiw/react-codemirror";
import { json } from "@codemirror/lang-json";
import { EditorView } from "@codemirror/view";
import { Feature, FeatureCollection } from "geojson";

type GeoJsonEditorProps = {
  geojson?: FeatureCollection | Feature;
  onChange: (value: string) => void;
};

export function GeoJsonEditor({ geojson, onChange }: GeoJsonEditorProps) {
  return (
    <div className="h-full w-full relative">
      <CodeMirror
        value={JSON.stringify(geojson, null, 2)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        extensions={[
          json(),
          EditorView.theme({
            "&": { height: "100%" },
            ".cm-scroller": {
              overflow: "auto",
            },
            ".cm-editor": {
              height: "100%",
            },
          }),
        ]}
        onChange={onChange}
        theme="light"
      />
    </div>
  );
}
