import { useState } from "react";

type TabSwitcherProps = {
  tabs: TabItem[];
};

type TabItem = {
  tabName: string;
  component: React.ReactNode;
};

export const TabSwitcher = ({ tabs }: TabSwitcherProps) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="h-full w-full flex flex-col rounded-lg overflow-hidden  bg-white">
      <div className="flex bg-gray-50 border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-3 px-5 bg-transparent border-none cursor-pointer text-sm font-medium text-slate-500 transition-all duration-200 relative hover:bg-gray-100 hover:text-slate-700 ${
              activeTab === index
                ? "text-blue-500 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500"
                : ""
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.tabName}
          </button>
        ))}
      </div>
      <div className="h-full w-full">{tabs[activeTab].component}</div>
    </div>
  );
};
