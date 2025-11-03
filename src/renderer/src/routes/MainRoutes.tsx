import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants/index';
import { setNavigator } from '@/libs/navigator';
import { useMeQuery } from '@/services/query/useAuthQuery';
import { useAuthStore } from '@/stores/useAuthStore';
import { useCommonStore } from '@/stores/useCommonStore';
import { getRouteInfo } from '@/utils/router';

import OverlayLoading from '@/components/Common/OverlayLoading';
import Header from '@/components/Layout/Header/Header';
import NavigationDrawer from '@/components/Layout/NavigationDrawer/NavigationDrawer';

import Login from '@/pages/Login/Login';

const MainRoutes = (): React.JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  const isMounted = useRef(false);
  const { isAuthenticating, currentUser, setIsAuthenticating, setCurrentUser } = useAuthStore();
  const { isNavigationDrawerOpen } = useCommonStore();

  const me = useMeQuery();

  useEffect(() => {
    setNavigator(navigate);
  }, [navigate]);

  useEffect(() => {
    isMounted.current = true;
    setIsAuthenticating(true);

    const doAuthenticate = async (): Promise<void> => {
      try {
        const routeInfo = getRouteInfo(location.pathname);

        if (routeInfo?.requireAuth && !currentUser) {
          // TODO : me 호출하여 로그인 데이터 검증하기
          const { isError, data } = await me.refetch();

          if (isError) {
            if (isMounted.current) {
              setCurrentUser(null);
              navigate(ROUTES.LOGIN.path);
            }
          }
          if (data?.me) {
            if (isMounted.current) {
              setCurrentUser(data.me);
              navigate(ROUTES.MAIN.path);
            }
          }
        }
      } catch (error) {
        if (isMounted.current) {
          console.log(error);
          setCurrentUser(null);
        }
      } finally {
        if (isMounted.current) {
          setIsAuthenticating(false);
        }
      }
    };

    doAuthenticate();

    return () => {
      isMounted.current = false;
      setIsAuthenticating(false);
    };
  }, [location.pathname]);

  const renderRoutes = (): React.JSX.Element => {
    if (isAuthenticating) {
      return <OverlayLoading visible={isAuthenticating} />;
    }

    // TODO : 로그인 상태일 때 라우트 처리
    if (currentUser && currentUser.accessToken) {
      return (
        <div className="flex flex-row h-[var(--height-content)]">
          <div
            className={`drawer h-[var(--height-content)] border-r-1 grow-0 border-gray-200 overflow-hidden ${isNavigationDrawerOpen ? 'w-0' : 'w-80'} transition-all duration-300`}
          >
            <NavigationDrawer />
          </div>
          <div className="overflow-hidden w-full flex-row">
            <Header />
            <div
              className="w-full h-screen overflow-y-auto"
              style={{ height: 'calc(100vh - 64px)' }}
            >
              <Routes>
                <Route
                  path={ROUTES.MAIN.path}
                  element={<div>Authenticated</div>}
                />
                <Route
                  path="*"
                  element={<Navigate to={ROUTES.MAIN.path} />}
                />
              </Routes>
            </div>
          </div>
        </div>
      );
    } else {
      // TODO : 로그인 상태가 아닐 때 라우트 처리
      return (
        <Routes>
          <Route
            path={ROUTES.LOGIN.path}
            element={<Login />}
          />
          <Route
            path="*"
            element={<Navigate to={ROUTES.LOGIN.path} />}
          />
        </Routes>
      );
    }
  };

  return <>{renderRoutes()}</>;
};

export default MainRoutes;
