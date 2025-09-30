export interface UserSubscription {
  id: string;
  status: 'trial' | 'active' | 'canceled';
  trialEndsAt: Date;
  planType: string;
}

export interface WorkoutData {
  id: string;
  name: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
}

export interface WebhookData {
  email: string;
  name: string;
  platform: string;
  purchaseId: string;
  purchaseDate: string;
}