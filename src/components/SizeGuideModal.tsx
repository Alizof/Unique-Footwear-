import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();

  if (!isSizeGuideOpen) return null;

  const sizeChart = [
    { ukIndia: 'UK 4', usMen: 'US 5', usWomen: 'US 6', eu: '37', footCm: '23.0 cm' },
    { ukIndia: 'UK 5', usMen: 'US 6', usWomen: 'US 7', eu: '38', footCm: '24.0 cm' },
    { ukIndia: 'UK 6', usMen: 'US 7', usWomen: 'US 8', eu: '39-40', footCm: '25.0 cm' },
    { ukIndia: 'UK 7', usMen: 'US 8', usWomen: 'US 9', eu: '41', footCm: '26.0 cm' },
    { ukIndia: 'UK 8', usMen: 'US 9', usWomen: 'US 10', eu: '42', footCm: '27.0 cm' },
    { ukIndia: 'UK 9', usMen: 'US 10', usWomen: 'US 11', eu: '43', footCm: '28.0 cm' },
    { ukIndia: 'UK 10', usMen: 'US 11', usWomen: 'US 12', eu: '44-45', footCm: '29.0 cm' },
    { ukIndia: 'UK 11', usMen: 'US 12', usWomen: 'US 13', eu: '46', footCm: '30.0 cm' },
  ];

  return (
    <div
      id="size-guide-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={() => setIsSizeGuideOpen(false)}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Footwear Size Guide</h3>
              <p className="text-xs text-slate-500">Standard Indian / UK Foot Measurement Chart</p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Size Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-2.5 rounded-l-lg">India / UK</th>
                <th className="p-2.5">Euro (EU)</th>
                <th className="p-2.5">US Men</th>
                <th className="p-2.5">US Women</th>
                <th className="p-2.5 rounded-r-lg">Foot Length</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {sizeChart.map((row, idx) => (
                <tr key={idx} className="hover:bg-amber-50/60 transition-colors">
                  <td className="p-2.5 font-bold text-amber-700">{row.ukIndia}</td>
                  <td className="p-2.5">{row.eu}</td>
                  <td className="p-2.5">{row.usMen}</td>
                  <td className="p-2.5">{row.usWomen}</td>
                  <td className="p-2.5 font-mono text-slate-600">{row.footCm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to measure tip */}
        <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
          <p className="font-bold text-slate-800 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            How to find your accurate shoe size:
          </p>
          <p>
            Place your foot flat on a blank piece of paper against a wall. Mark the tip of your longest toe and heel. Measure the distance in centimeters (cm) and compare with the chart above.
          </p>
          <p className="text-amber-800 font-medium">
            💡 If you are between two sizes or have wide feet, we recommend choosing one size larger.
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
