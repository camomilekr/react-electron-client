import { ROUTES } from '../constants/routes';
import { RouteInfo } from '../types/common';

export const getRouteInfo = (path: string): RouteInfo | null => {
  const route = Object.values(ROUTES).find((route) => route.path === path);

  return route || null;
};
