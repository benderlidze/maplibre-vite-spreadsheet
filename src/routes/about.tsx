import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center">How to Use GeoMapi</h1>
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <ul className="space-y-4">
            <li>
              <strong>1. Prepare Your Google Spreadsheet:</strong> <br />
              Your spreadsheet should have columns for latitude, longitude,
              name, and description.
              <br />
              You can use this link as a reference:{" "}
              <a
                className="underline text-blue-700"
                href="https://docs.google.com/spreadsheets/d/1GkiV0OF9ifo512SYUzbBzjMXnc1eI8puAdEBkdfYKxs"
                target="_blank"
              >
                Top 10 US cities
              </a>
            </li>

            <li>
              <strong>2. Connect Your Spreadsheet:</strong> <br />
              Go to <strong>File&rarr;Share&rarr;Publish to the web </strong>
              in your Google Spreadsheet. Then select the CSV format and copy
              the link to your clipboard{" "}
              <strong>Web page&rarr;Comma-separated values (.csv)</strong>
            </li>
            <li>
              <strong>4. Customize Your Map:</strong> <br />
              Paste the CSV link into the GeoMapi tool. Choose columns for
              titles, descriptions, and adjust styles like marker types and
              themes.
            </li>
            <li>
              <strong>5. Generate & Embed the Map:</strong> <br />
              Get an embed code and insert it into your website's HTML to
              display the interactive map. You can copy the link only and share
              it with anyone.
            </li>
            <li>
              <strong>6. Update & Maintain:</strong> <br />
              Any changes in the Google Spreadsheet will automatically reflect
              on the embedded map.
            </li>
          </ul>
        </div>

        <div className="bg-yellow-100 p-4 mt-6 border border-yellow-300 rounded-lg">
          <p className="font-semibold">Disclaimer:</p>
          <p>
            The map generated using GeoMapi is based on the data provided in
            your Google Spreadsheet. We do not guarantee the accuracy or
            completeness of the data. It is your responsibility to ensure that
            all data entries are correct. GeoMapi is not liable for any issues
            or damages arising from the use of this map.
          </p>
          <p>
            We do not store your data in any way. All your data remains in your
            spreadsheet only and is available to anyone via the CSV link.
          </p>
        </div>
      </div>
    </div>
  );
}
