import { NavigateFunction, NavigateOptions, To } from 'react-router-dom';

let navigateFunction: NavigateFunction | null = null;

export const setNavigator = (navigate: NavigateFunction): void => {
  navigateFunction = navigate;
};

export const navigateTo = (path: To, options?: NavigateOptions): void => {
  if (navigateFunction) {
    navigateFunction(path, options);
  }
};
