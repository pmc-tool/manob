export interface IFilterCategory {
  id: string;
  name: string;
  count?: number;
}

export interface IJobFilter {
  term: string;
  minBudget: number;
  maxBudget: number;
  deliveryTime: string;
  level: string[];
  category: string[];
}
