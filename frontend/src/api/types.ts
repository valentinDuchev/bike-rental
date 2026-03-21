export type PricePeriod = {
  id: number;
  price_per_day: number;
  start_date: string;
  end_date: string;
  created_at: string;
};

export type CalculationResult = {
  rental_days: number;
  total_price: number;
  breakdown: { date: string; price: number }[];
};

export type LoginResponse = {
  access_token: string;
  username: string;
};
