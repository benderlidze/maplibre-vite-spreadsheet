import { MapFields } from "../../routes";

type CodeGeneratorProps = {
  mapFields: MapFields;
};

export const CodeGenerator = ({ mapFields }: CodeGeneratorProps) => {
  const params = new URLSearchParams();
  params.append("mapFields", encodeURIComponent(JSON.stringify(mapFields)));
  const iframeCode = `<iframe 
  ${new Date().toLocaleString()} 
    src="${window.location.origin}/?${params}" 
    width="100%" 
    height="500px" 
    style="border: 1px solid #ccc">
  </iframe>
  `;
  return (
    <div>
      <div>
        <h2>Embed Code </h2>
        <textarea className="border w-full" value={iframeCode} readOnly />
      </div>
    </div>
  );
};
