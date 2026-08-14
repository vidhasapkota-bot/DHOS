import React from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { SupplyInventoryItem } from '../types/dhos';

interface SupplyChainViewProps {
  inventory: SupplyInventoryItem[];
  onRestockItem: (itemId: string) => void;
}

export const SupplyChainView: React.FC<SupplyChainViewProps> = ({
  inventory,
  onRestockItem
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-600" />
            Supply Chain & Ward PAR Inventory Operations (WF-291 - WF-310)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Automated PAR replenishment alerts, critical stock-out prevention, surgical implant tracking & barcode inventory control.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(inventory || []).map((item) => {
          const isLowStock = item.currentStock <= item.parLevel;
          return (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{item.itemName}</h3>
                  <span className="text-[10px] font-mono font-bold text-slate-500">{item.id} • {item.location}</span>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  isLowStock ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse' :
                  'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {isLowStock ? 'REPLENISHMENT REQ' : 'STOCK OPTIMAL'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <div>
                    <span className="text-slate-500 text-[10px] font-bold block">Current Stock</span>
                    <span className={`text-base font-extrabold ${isLowStock ? 'text-red-700' : 'text-emerald-700'}`}>
                      {item.currentStock} {item.unit}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 text-[10px] font-bold block">PAR Level</span>
                    <span className="text-base font-bold text-slate-800">
                      {item.parLevel} {item.unit}
                    </span>
                  </div>
                </div>

                {isLowStock && (
                  <div className="bg-red-50 border border-red-200 p-2 rounded text-[11px] text-red-900 font-bold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Stock below PAR threshold ({item.parLevel} {item.unit}). Immediate replenishment order queued.
                  </div>
                )}
              </div>

              {isLowStock && (
                <button
                  onClick={() => onRestockItem(item.id)}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  Restock Item to PAR Level
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
