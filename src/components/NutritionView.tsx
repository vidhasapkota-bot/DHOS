import React from 'react';
import {
  Utensils,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Apple,
  ShieldCheck
} from 'lucide-react';
import { MealOrder } from '../types/dhos';

interface NutritionViewProps {
  mealOrders: MealOrder[];
  onDeliverMeal: (orderId: string) => void;
}

export const NutritionView: React.FC<NutritionViewProps> = ({
  mealOrders,
  onDeliverMeal
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-orange-600" />
            Patient Nutrition, Dietary & Allergen Catering (WF-191 - WF-210)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            IDDSI dysphagia texture modified diets (Puree / Soft), strict allergen checking (WF-195) and meal delivery tracking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(mealOrders || []).map((meal) => (
          <div key={meal.id} className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs text-slate-900">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{meal.patientName}</h3>
                <span className="text-[11px] font-mono font-bold text-slate-500">Bed {meal.bedNumber}</span>
              </div>

              <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                meal.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                'bg-amber-100 text-amber-800 border border-amber-200'
              }`}>
                {meal.status}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg space-y-1">
                <span className="text-slate-500 text-[10px] uppercase font-bold block">Meal Details</span>
                <div className="font-extrabold text-orange-900">{meal.mealType}: {meal.dietaryRequirements}</div>
                {meal.iddsiLevel && (
                  <div className="text-[10px] text-blue-800 font-mono font-bold">
                    IDDSI Texture Level: {meal.iddsiLevel}
                  </div>
                )}
              </div>

              {meal.allergenWarnings && meal.allergenWarnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg text-red-900 space-y-1">
                  <div className="font-extrabold text-[10px] uppercase flex items-center gap-1 text-red-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                    Strict Allergen Locks (WF-195)
                  </div>
                  <div className="font-bold">
                    {meal.allergenWarnings.join(', ')}
                  </div>
                </div>
              )}
            </div>

            {meal.status !== 'Delivered' && (
              <button
                onClick={() => onDeliverMeal(meal.id)}
                className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm Bedside Meal Delivery
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
