import { CSVBox } from "./components/CSVBox";

export const MainApp = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 w-full">
        <div className="bg-white rounded-lg w-full p-6">
          <h2 className="text-xl font-bold mb-4">Google Spreadsheet Viewer</h2>
          <CSVBox />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-bold mb-4">Box 2</h2>
          <p>Content for box 2 will go here</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md w-full">
          <h2 className="text-xl font-bold mb-4">Box 3</h2>
          <p>Content for box 3 will go here</p>
        </div>
      </div>
    </div>
  );
};
