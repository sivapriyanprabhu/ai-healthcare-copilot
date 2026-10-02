export interface User {
  id: number;
  email: string;
  fullName: string;
  role: 'ROLE_PATIENT' | 'ROLE_DOCTOR' | 'ROLE_ADMIN';
}

export interface AuthResponse {
  token: string;
  type: string;
  user: User;
}

export interface PatientProfile {
  patientId: number;
  userId: number;
  fullName: string;
  email: string;
  dateOfBirth?: string;
  age?: number;
  gender?: string;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  bmiCategory?: string;
  bloodGroup?: string;
  allergies?: string;
  existingConditions?: string;
  familyHistory?: string;
  smokingStatus?: string;
  alcoholStatus?: string;
  activityLevel?: string;
  emergencyContact?: string;
}

export interface HealthMetric {
  id?: number;
  patientId?: number;
  systolicBp?: number;
  diastolicBp?: number;
  glucoseMgDl?: number;
  heartRateBpm?: number;
  weightKg?: number;
  sleepHours?: number;
  waterIntakeLiters?: number;
  exerciseMinutes?: number;
  recordedAt?: string;
}

export interface MedicalReportValue {
  id?: number;
  metricName: string;
  extractedValue: string;
  numericValue?: number;
  unit?: string;
  referenceRange?: string;
  status: 'NORMAL' | 'ABNORMAL_HIGH' | 'ABNORMAL_LOW';
  explanation?: string;
}

export interface MedicalReport {
  id: number;
  patientId: number;
  title: string;
  reportType: string;
  fileName?: string;
  rawOcrText?: string;
  aiSummary?: string;
  doctorQuestions?: string;
  overallStatus?: string;
  uploadedAt: string;
  values?: MedicalReportValue[];
}

export interface ChatMessage {
  id?: number;
  sender: 'USER' | 'AI';
  content: string;
  citations?: string;
  createdAt?: string;
}

export interface ChatConversation {
  id: number;
  patientId: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages?: ChatMessage[];
}

export interface RiskFactor {
  factorName: string;
  impactScore: number; // SHAP value
  description?: string;
}

export interface RiskPrediction {
  id?: number;
  conditionName: string;
  riskScorePercent: number;
  riskCategory: 'LOW' | 'MODERATE' | 'HIGH';
  confidenceScore?: number;
  summary?: string;
  createdAt?: string;
  factors?: RiskFactor[];
}

export interface Medication {
  id: number;
  patientId?: number;
  name: string;
  dosage: string;
  frequency: string;
  timeOfDay: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  startDate?: string;
  endDate?: string;
  active: boolean;
  notes?: string;
  takenToday?: boolean;
}

export interface DietMealItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
}

export interface DietMeal {
  mealType: string;
  items: DietMealItem[];
  totalCalories: number;
}

export interface DietPlan {
  dailyCalorieTarget: number;
  macroSplit: Record<string, number>;
  meals: DietMeal[];
  hydrationAdvice: string;
  supplementSuggestions: string[];
  disclaimer: string;
}

export interface DietPlanRequest {
  age?: number;
  sex?: string;
  weightKg?: number;
  heightCm?: number;
  activityLevel?: string;
  goal?: string;
  restrictions?: string[];
  conditions?: string[];
}

export interface ExerciseItem {
  name: string;
  sanskritName?: string;
  category?: string;
  durationMinutes: number;
  intensityLevel: string;
  caloriesBurned: number;
  muscleGroups: string[];
  instructions: string;
  breathingCue?: string;
  benefits?: string[];
  precautions?: string[];
  imageUrl?: string;
  videoUrl?: string;
  videoEmbedId?: string;
  language?: string;
}

export interface ExercisePlan {
  weeklyPlan: Record<string, ExerciseItem[]>;
  totalWeeklyMinutes: number;
  estimatedWeeklyCalories: number;
  safetyTips: string[];
  disclaimer: string;
  routineType?: 'yoga' | 'exercise' | 'combined';
  language?: string;
}

export interface ExercisePlanRequest {
  age?: number;
  fitnessLevel?: string;
  goal?: string;
  availableMinutes?: number;
  injuries?: string[];
  preferences?: string[];
  routineType?: 'yoga' | 'exercise' | 'combined';
  language?: string;
}

export interface DrugInteractionItem {
  drugA: string;
  drugB: string;
  severity: 'SAFE' | 'MODERATE_CAUTION' | 'HIGH_RISK' | 'CONTRAINDICATED';
  mechanism: string;
  clinicalAdvice: string;
}

export interface DrugFoodInteractionItem {
  drug: string;
  food: string;
  severity: 'SAFE' | 'MODERATE_CAUTION' | 'HIGH_RISK' | 'CONTRAINDICATED';
  mechanism: string;
  clinicalAdvice: string;
}

export interface DrugInteractionResult {
  safetyLevel: 'SAFE' | 'MODERATE_CAUTION' | 'HIGH_RISK' | 'CONTRAINDICATED';
  overallSummary: string;
  totalInteractionsFound: number;
  interactions: DrugInteractionItem[];
  foodInteractions: DrugFoodInteractionItem[];
  monitoredParameters: string[];
  disclaimer: string;
}

