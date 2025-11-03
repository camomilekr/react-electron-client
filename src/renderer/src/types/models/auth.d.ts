import { CommonMutationResType } from '../common';

export type TermsAndPolicyType =
  | 'TERMS'
  | 'PRIVACY_POLICY'
  | 'STORE_OWNER_SITE_TERMS'
  | 'STORE_OWNER_SITE_PRIVACY_POLICY'
  | 'STORE_OWNER_SITE_14_AGE_OVER'
  | 'MARKETING'
  | 'ADVERTISEMENT';

type TermsAndPolicyResponseMethod = 'SMS' | 'PUSH' | 'EMAIL';

export interface UserTermsAgreement {
  termsAndPolicyId: number;
  termsAndPolicyType: TermsAndPolicyType;
  isAgree: boolean;
  checkedAt: number;
  responseMethod: TermsAndPolicyResponseMethod;
}

export interface LoginUserForMobile {
  userId: number;
  loginId: string;
  name: string;
  phone: string;
  role: string;
  userTermsAgreements: UserTermsAgreementType[];
  accessToken: string;
  isPasswordChangeRequired: boolean;
  createdAt: number;
  birthDate: string;
}

/**
 * 인풋 타입
 */
export interface LoginUserForMobileData {
  loginId: string;
  password: string;
  rememberMe: boolean;
}

/**
 * 리스폰스 타입
 */
export interface LoginUserForMobileResponse {
  loginUserForMobile: LoginUserForMobile;
}

export interface MeResponse {
  me: LoginUserForMobile;
}

export interface LogoutUserResponse {
  logoutUser: string;
}

/**
 * 쿼리 타입
 */
export interface MeGqlType {
  (): Promise<MeResponse>;
}

export interface LoginUserForMobileGqlType {
  (payload: LoginUserForMobileData): CommonMutationResType<LoginUserForMobileResponse>;
}

export interface LogoutUserGqlType {
  (): CommonMutationResType<LogoutUserResponse>;
}
