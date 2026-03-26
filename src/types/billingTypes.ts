export interface BillingRecord {
  _id: string;
  employee_id: { _id: string; name: string };
  project_id: { _id: string; name: string };
  billing_month: string;
  story_points_completed: number;
  billing_rate_per_point: number;
  total_revenue: number;
}