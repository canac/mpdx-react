import Router from 'next/router';
import { getSession } from 'next-auth/react';
import { getQueryParam } from 'src/utils/queryParam';

export const getOauthUrl = async (
  organizationId: string,
  route = 'preferences/integrations?selectedTab=organization',
) => {
  const session = await getSession();
  const redirectUrl = encodeURIComponent(`${window.location.origin}/${route}`);
  const token = session?.user.apiToken;
  const accountListId = getQueryParam(Router.query, 'accountListId');
  return (
    `${process.env.OAUTH_URL}/auth/user/donorhub?account_list_id=${accountListId}` +
    `&redirect_to=${redirectUrl}` +
    `&access_token=${token}` +
    `&organization_id=${organizationId}`
  );
};