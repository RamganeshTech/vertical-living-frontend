import React from "react";

type SectionConfigType = {
  key: string;
  label: string;
  icon: string;
};

type Props = {
  sections: SectionConfigType[];
  setVisibleSection: (key: string) => void;
};

const SectionCards = ({ sections, setVisibleSection }: Props) => (
  <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {sections.map(({ key, label, icon }) => (
      <div
        key={key}
        className="bg-white border-l-4 border-blue-600 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer group"
        onClick={() => setVisibleSection(key)}
      >
        <div className="flex items-center justify-between p-5 gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full text-xl">
              <i className={icon} />
            </div>
            <span className="text-sm font-medium text-gray-800 group-hover:text-blue-700">
              {label}
            </span>
          </div>
          <i className="fa-solid fa-chevron-right text-blue-400 group-hover:text-blue-600" />
        </div>
      </div>
    ))}
  </section>
);

export default React.memo(SectionCards);