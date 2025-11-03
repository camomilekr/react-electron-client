import { RouteInfo } from '../types/common';

export const ROUTES: Record<string, RouteInfo> = {
  LOGIN: {
    path: '/login',
    title: '로그인',
    requireAuth: false,
  },
  MAIN: {
    path: '/',
    title: '주문 현황',
    requireAuth: true,
  },
};
