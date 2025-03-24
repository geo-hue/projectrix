import { apiSlice } from './apiSlice';

export interface PromoCode {
  _id: string;
  code: string;
  description: string;
  isActive: boolean;
  duration: number;
  maxUses: number;
  usedCount: number;
  createdBy: {
    _id: string;
    name: string;
    username: string;
  };
  usedBy: Array<{
    userId: {
      _id: string;
      name: string;
      username: string;
      email: string;
    };
    usedAt: string;
  }>;
  expiresAt: string;
  createdAt: string;
}

export interface GeneratePromoCodesRequest {
  count?: number;
  prefix?: string;
  duration?: number;
  maxUses?: number;
  description?: string;
  expiryDays?: number;
}

export interface GeneratePromoCodesResponse {
  success: boolean;
  count: number;
  codes: PromoCode[];
}

export interface GetPromoCodesResponse {
  success: boolean;
  count: number;
  promoCodes: PromoCode[];
}

export interface RedeemPromoCodeRequest {
  code: string;
}

export interface RedeemPromoCodeResponse {
  success: boolean;
  message: string;
  expiryDate: string;
}

export interface DeactivatePromoCodeResponse {
  success: boolean;
  message: string;
}

export const promoCodeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Admin endpoints
    generatePromoCodes: builder.mutation<GeneratePromoCodesResponse, GeneratePromoCodesRequest>({
      query: (data) => ({
        url: '/admin/promo-codes/generate',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PromoCodes'],
    }),
    
    getPromoCodes: builder.query<GetPromoCodesResponse, { active?: boolean }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.active !== undefined) {
          queryParams.append('active', params.active.toString());
        }
        return {
          url: `/admin/promo-codes?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['PromoCodes'],
    }),
    
    deactivatePromoCode: builder.mutation<DeactivatePromoCodeResponse, string>({
      query: (codeId) => ({
        url: `/admin/promo-codes/${codeId}/deactivate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['PromoCodes'],
    }),
    
    // User endpoints
    redeemPromoCode: builder.mutation<RedeemPromoCodeResponse, RedeemPromoCodeRequest>({
      query: (data) => ({
        url: '/promo-codes/redeem',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGeneratePromoCodesMutation,
  useGetPromoCodesQuery,
  useDeactivatePromoCodeMutation,
  useRedeemPromoCodeMutation,
} = promoCodeApiSlice;