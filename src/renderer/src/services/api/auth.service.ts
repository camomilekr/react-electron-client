import apolloClient from '@/libs/graphql-client';

import {
  LoginUserForMobileData,
  LoginUserForMobileGqlType,
  LogoutUserGqlType,
  MeGqlType,
} from '@/types/models/auth';

import loginUserForMobileGql from '@/services/api/graphql/mutation/loginUserForMobile.gql';
import logoutUserGql from '@/services/api/graphql/mutation/logoutUser.gql';
import meGql from '@/services/api/graphql/query/me.gql';

export const loginUserForMobile: LoginUserForMobileGqlType = async (
  payload: LoginUserForMobileData
) => {
  const { data } = await apolloClient.mutate({
    mutation: loginUserForMobileGql,
    variables: { data: payload },
  });

  return data;
};

export const me: MeGqlType = async () => {
  const { data } = await apolloClient.query({
    query: meGql,
  });

  return data;
};

export const logoutUser: LogoutUserGqlType = async () => {
  const { data } = await apolloClient.mutate({
    mutation: logoutUserGql,
  });

  return data;
};
