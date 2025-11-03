export interface ConvertedError {
  category: string;
  code: string;
  message: string;
}

export interface RouteInfo {
  path: string;
  title: string;
  requireAuth: boolean;
}

export type CommonMutationResType<T> = Promise<T | null | undefined>;
