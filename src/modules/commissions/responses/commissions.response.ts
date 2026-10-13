import type { SellerCommission } from "../interfaces/seller-commission.interface";

// Shape of GET /commissions.
export interface CommissionsResponse {
  startDate: string;
  endDate: string;
  results: SellerCommission[];
}
