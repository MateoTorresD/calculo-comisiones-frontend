import { commissionsApi } from "../api/commissions.api";
import type { SellerCommission } from "../interfaces/seller-commission.interface";
import type { CommissionsResponse } from "../responses/commissions.response";

export const calculateCommissions = async (
  startDate: string,
  endDate: string,
  signal?: AbortSignal,
): Promise<SellerCommission[]> => {
  const { data } = await commissionsApi.get<CommissionsResponse>(
    "/commissions",
    { params: { startDate, endDate }, signal },
  );

  return data.results;
};
