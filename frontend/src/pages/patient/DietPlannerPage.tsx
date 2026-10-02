import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { dietService } from '../../services/dietService';
import { PatientProfile, DietPlan, DietPlanRequest } from '../../types';
import {
  Utensils,
  Flame,
  Apple,
  Leaf,
  Sparkles,
  Droplet,
  AlertTriangle,
  RefreshCw,
  Activity,
  Heart,
  Scale,
  Settings
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function DietPlannerPage() {
  const { t, tCondition } = useLanguage();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [age, setAge] = useState<number>(35);
  const [sex, setSex] = useState<string>('Male');
  const [weightKg, setWeightKg] = useState<number>(75);
  const [heightCm, setHeightCm] = useState<number>(175);
  const [activityLevel, setActivityLevel] = useState<string>('Moderate');
  const [goal, setGoal] = useState<string>('Maintenance');
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await patientService.getProfile();
        setProfile(data);
        if (data.age) setAge(data.age);
        if (data.gender) setSex(data.gender);
        if (data.weightKg) setWeightKg(data.weightKg);
        if (data.heightCm) setHeightCm(data.heightCm);
        if (data.activityLevel) setActivityLevel(data.activityLevel);

        // Prepopulate conditions
        const condList: string[] = [];
        if (data.existingConditions) {
          const lowerCond = data.existingConditions.toLowerCase();
          if (lowerCond.includes('diabet') || lowerCond.includes('sugar') || lowerCond.includes('glucose')) {
            condList.push('Diabetes');
          }
          if (lowerCond.includes('hyper') || lowerCond.includes('bp') || lowerCond.includes('pressure')) {
            condList.push('Hypertension');
          }
          if (lowerCond.includes('heart') || lowerCond.includes('coronary') || lowerCond.includes('cardio')) {
            condList.push('Heart Disease');
          }
        }
        setConditions(condList);

        // Prepopulate restrictions
        const restList: string[] = [];
        if (data.allergies) {
          const lowerAllergies = data.allergies.toLowerCase();
          if (lowerAllergies.includes('dairy') || lowerAllergies.includes('milk')) {
            restList.push('Dairy-Free');
          }
          if (lowerAllergies.includes('gluten') || lowerAllergies.includes('wheat')) {
            restList.push('Gluten-Free');
          }
        }
        setRestrictions(restList);

      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setInitialLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleRestrictionToggle = (name: string) => {
    setRestrictions(prev =>
      prev.includes(name) ? prev.filter(r => r !== name) : [...prev, name]
    );
  };

  const handleConditionToggle = (name: string) => {
    setConditions(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const requestData: DietPlanRequest = {
        age,
        sex,
        weightKg,
        heightCm,
        activityLevel,
        goal,
        restrictions,
        conditions
      };
      const response = await dietService.generatePlan(requestData);
      setPlan(response);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate your diet plan. Please verify the AI Service is active and try again.');
    } finally {
      setLoading(false);
    }
  };

  const restrictionOptions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Low-Carb'];
  const conditionOptions = ['Diabetes', 'Hypertension', 'Heart Disease', 'High Cholesterol'];

  if (initialLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-teal-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden border border-emerald-900/30">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 translate-y-16 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold mb-3 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" /> {t('diet_title', 'Healthy Meal Ideas')}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t('diet_title', 'Personal Meal & Diet Planner')}</h1>
          <p className="text-slate-300 text-sm md:text-base mt-2 max-w-2xl">
            {t('diet_subtitle', 'Get delicious, healthy daily meal ideas tailored to your body, your favorite foods, and your wellness goals.')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Settings className="w-5 h-5 text-slate-500" />
            <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{t('personal_info', 'Plan Parameters')}</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Age & Gender */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('age', 'Age')}</label>
                <input
                  type="number"
                  min={1}
                  max={120}
                  required
                  value={age}
                  onChange={(e) => setAge(+e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('gender', 'Gender')}</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                >
                  <option value="Male">{t('male', 'Male')}</option>
                  <option value="Female">{t('female', 'Female')}</option>
                </select>
              </div>
            </div>

            {/* Height & Weight */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('weight', 'Weight (kg)')}</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(+e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">{t('height_cm', 'Height (cm)')}</label>
                <input
                  type="number"
                  required
                  value={heightCm}
                  onChange={(e) => setHeightCm(+e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Activity Factor</label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
              >
                <option value="Sedentary">Sedentary (Little/no exercise)</option>
                <option value="Light">Light (Exercise 1-2 times/week)</option>
                <option value="Moderate">Moderate (Exercise 3-4 times/week)</option>
                <option value="Active">Active (Exercise 5+ times/week)</option>
                <option value="Very Active">Very Active (Heavy training)</option>
              </select>
            </div>

            {/* Fitness Goal */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Diet Goal</label>
              <div className="grid grid-cols-3 gap-2">
                {['Weight Loss', 'Maintenance', 'Muscle Gain'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={`py-2 px-1 text-center rounded-xl border text-[11px] font-semibold transition-all ${
                      goal === g
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Dietary Restrictions</label>
              <div className="flex flex-wrap gap-1.5">
                {restrictionOptions.map((opt) => {
                  const active = restrictions.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleRestrictionToggle(opt)}
                      className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-full border transition-all ${
                        active
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Medical Conditions */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">{t('existing_conditions', 'Targeted Clinical Conditions')}</label>
              <div className="flex flex-wrap gap-1.5">
                {conditionOptions.map((opt) => {
                  const active = conditions.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleConditionToggle(opt)}
                      className={`text-[10px] font-semibold px-2.5 py-1.5 rounded-full border transition-all ${
                        active
                          ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {tCondition(opt) || opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  {t('loading', 'Generating Plan...')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {t('generate_diet', 'Generate Diet Plan')}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Diet Plan Output */}
        <div className="lg:col-span-8 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-2xl flex gap-3 text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {plan ? (
            <div className="space-y-6">
              {/* Daily Energy & Macro Card */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Calories target */}
                <div className="md:col-span-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-md flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">Target Energy</span>
                    <Flame className="w-5 h-5 text-emerald-100" />
                  </div>
                  <div className="my-4">
                    <span className="text-4xl font-extrabold">{plan.dailyCalorieTarget}</span>
                    <span className="text-emerald-100 text-xs ml-1">kcal / day</span>
                  </div>
                  <div className="text-[11px] text-emerald-100/90 leading-tight">
                    Custom daily energy target matching Mifflin-St Jeor metabolic equations.
                  </div>
                </div>

                {/* Macro splits */}
                <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 mb-3">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Macro-Nutrient Distribution</span>
                  </div>
                  
                  {/* Distribution Bar */}
                  <div className="space-y-4">
                    <div className="h-6 w-full rounded-full overflow-hidden flex text-[10px] text-white font-bold">
                      <div
                        style={{ width: `${plan.macroSplit.protein}%` }}
                        className="bg-emerald-600 flex items-center justify-center"
                        title="Protein"
                      >
                        P {plan.macroSplit.protein}%
                      </div>
                      <div
                        style={{ width: `${plan.macroSplit.carbs}%` }}
                        className="bg-amber-500 flex items-center justify-center"
                        title="Carbs"
                      >
                        C {plan.macroSplit.carbs}%
                      </div>
                      <div
                        style={{ width: `${plan.macroSplit.fat}%` }}
                        className="bg-sky-500 flex items-center justify-center"
                        title="Fat"
                      >
                        F {plan.macroSplit.fat}%
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-emerald-600"></span>
                        <span className="font-medium text-slate-600">{t('protein', 'Protein')}:</span>
                        <span className="font-bold text-slate-800">{Math.round((plan.dailyCalorieTarget * (plan.macroSplit.protein / 100)) / 4)}g</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-amber-500"></span>
                        <span className="font-medium text-slate-600">{t('carbs', 'Carbs')}:</span>
                        <span className="font-bold text-slate-800">{Math.round((plan.dailyCalorieTarget * (plan.macroSplit.carbs / 100)) / 4)}g</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded bg-sky-500"></span>
                        <span className="font-medium text-slate-600">{t('fat', 'Fats')}:</span>
                        <span className="font-bold text-slate-800">{Math.round((plan.dailyCalorieTarget * (plan.macroSplit.fat / 100)) / 9)}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meals Schedule */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{t('diet_title', 'Structured Daily Meal Schedule')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plan.meals.map((meal) => (
                    <div key={meal.mealType} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                          <span className="font-extrabold text-sm text-slate-900">{t(meal.mealType.toLowerCase(), meal.mealType)}</span>
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            {meal.totalCalories} kcal
                          </span>
                        </div>

                        <div className="space-y-3">
                          {meal.items.map((item, idx) => (
                            <div key={idx} className="space-y-1">
                              <p className="text-xs font-semibold text-slate-800">{item.name}</p>
                              {item.notes && (
                                <p className="text-[10px] text-slate-500 italic bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                  {item.notes}
                                </p>
                              )}
                              <div className="flex gap-2 text-[9px] text-slate-400 font-medium">
                                <span>{item.calories} kcal</span>
                                <span>·</span>
                                <span>P: {item.protein}g</span>
                                <span>·</span>
                                <span>C: {item.carbs}g</span>
                                <span>·</span>
                                <span>F: {item.fat}g</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hydration & Supplements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hydration card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                    <Droplet className="w-4 h-4 text-sky-500" />
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Hydration Guidance</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{plan.hydrationAdvice}</p>
                </div>

                {/* Nutrition tips card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
                    <Leaf className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">Healthy Nutrition Tips</span>
                  </div>
                  <ul className="space-y-1.5">
                    {plan.supplementSuggestions.map((sup, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {sup}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl flex gap-3 text-xs leading-relaxed">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span>{plan.disclaimer}</span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-16 rounded-3xl border border-slate-200/80 text-center text-slate-400 space-y-3 flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-1">
                <Apple className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-700 text-sm">No diet plan generated yet</h3>
              <p className="text-xs text-slate-400 max-w-sm">
                Fill out the metrics form on the left and click "Generate Diet Plan" to retrieve your custom AI nutrition routine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
