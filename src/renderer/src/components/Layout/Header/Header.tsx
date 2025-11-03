import { useCommonStore } from '@/stores/useCommonStore';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  NavbarItem,
} from '@heroui/react';

import { ROUTES } from '@/constants/index';
import { useLogoutUserMutation } from '@/services/query/useAuthQuery';
import { useAuthStore } from '@/stores/useAuthStore';

import Icon from '@/components/Common/Icon';

const Header = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, setCurrentUser } = useAuthStore();
  const { setVisibleOverlayLoading } = useCommonStore();
  const { isNavigationDrawerOpen, setIsNavigationDrawerOpen } = useCommonStore();
  const getHeaderTitle = (): string => {
    const pathName = location.pathname;

    const route = Object.values(ROUTES).find((route) => route.path === pathName);

    return route?.title || '';
  };

  const { mutateAsync: logoutUser } = useLogoutUserMutation();

  const handleLogout = async (): Promise<void> => {
    try {
      setVisibleOverlayLoading(true);

      await logoutUser();
    } catch (error) {
      console.error(error);
    } finally {
      setVisibleOverlayLoading(false);

      setCurrentUser(null);
      navigate(ROUTES.LOGIN.path, { replace: true });
    }
  };

  return (
    <>
      <Navbar
        className="shadow-sm w-full"
        isBordered
      >
        <NavbarContent justify="start">
          <button
            className="border-1 border-gray-300 bg-base-200 rounded-md p-2"
            onClick={() => setIsNavigationDrawerOpen(!isNavigationDrawerOpen)}
          >
            <Icon
              iconName="Bars3Icon"
              className="size-6"
            />
          </button>
        </NavbarContent>
        <NavbarContent
          className="hidden sm:flex gap-4"
          justify="center"
        >
          <NavbarItem>
            <span className="text-lg font-bold">{getHeaderTitle()}</span>
          </NavbarItem>
        </NavbarContent>

        <NavbarContent
          as="div"
          className="items-center"
          justify="end"
        >
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                className="text-primary"
                radius="full"
                size="sm"
                variant="flat"
              >
                <Icon
                  iconName="UserIcon"
                  className="size-6"
                />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              disabledKeys={['profile']}
            >
              <DropdownItem
                isReadOnly
                key="profile"
                className="h-14 gap-2"
              >
                <p className="font-semibold">로그인한 계정</p>
                <p className="font-semibold">{currentUser?.loginId}</p>
              </DropdownItem>
              <DropdownItem
                key="settings"
                onClick={() => navigate(ROUTES.MY_INFO.path)}
              >
                내 정보
              </DropdownItem>
              <DropdownItem
                key="logout"
                color="danger"
                onClick={handleLogout}
              >
                로그아웃
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </>
  );
};

export default Header;
