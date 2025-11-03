/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMutation, useQuery } from '@tanstack/react-query';

import { loginUserForMobile, logoutUser, me } from '@/services/api/auth.service';
import { LoginUserForMobileData } from '@/types/models/auth';

export const useLoginUserForMobileMutation = () => {
  return useMutation({
    mutationKey: ['loginUserForMobile'],
    mutationFn: async (payload: LoginUserForMobileData) => {
      const res = await loginUserForMobile(payload);
      return res;
    },
  });
};

export const useMeQuery = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await me();
      return res;
    },
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useLogoutUserMutation = () => {
  return useMutation({
    mutationKey: ['logoutUser'],
    mutationFn: async () => {
      const res = await logoutUser();
      return res;
    },
  });
};
