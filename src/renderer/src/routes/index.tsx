import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import MainRoutes from '@/routes/MainRoutes';

const Router = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <MainRoutes />
    </BrowserRouter>
  );
};

export default Router;
