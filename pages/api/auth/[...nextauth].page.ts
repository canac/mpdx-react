import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { DefaultSession, NextAuthOptions } from 'next-auth';
import { Provider } from 'next-auth/providers';
import OktaProvider from 'next-auth/providers/okta';
import Rollbar from 'rollbar';
import client from '../../../src/lib/client';
import {
  OktaSignInDocument,
  OktaSignInMutation,
  OktaSignInMutationVariables,
} from './oktaSignIn.generated';
import {
  ApiOauthSignInDocument,
  ApiOauthSignInMutation,
  ApiOauthSignInMutationVariables,
} from './apiOauthSignIn';

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_SERVER_ACCESS_TOKEN,
  environment: `react_${process.env.NODE_ENV}_server`,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      apiToken?: string;
    };
  }
  interface User {
    apiToken?: string;
  }
}

const AUTH_PROVIDER = process.env.AUTH_PROVIDER,
  OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID,
  OKTA_CLIENT_SECRET = process.env.OKTA_CLIENT_SECRET,
  OKTA_ISSUER = process.env.OKTA_ISSUER,
  API_OAUTH_CLIENT_ID = process.env.API_OAUTH_CLIENT_ID,
  API_OAUTH_CLIENT_SECRET = process.env.API_OAUTH_CLIENT_SECRET,
  API_OAUTH_ISSUER = process.env.API_OAUTH_ISSUER;

if (AUTH_PROVIDER !== 'OKTA' && AUTH_PROVIDER !== 'API_OAUTH') {
  throw new Error(
    'AUTH_PROVIDER environment variable needs to equal either "OKTA" or "API_OAUTH"',
  );
}

if (
  AUTH_PROVIDER === 'OKTA' &&
  (!OKTA_CLIENT_ID || !OKTA_CLIENT_SECRET || !OKTA_ISSUER)
) {
  throw new Error(
    'OKTA_CLIENT_ID, OKTA_CLIENT_SECRET or OKTA_ISSUER envs not defined',
  );
}
if (
  AUTH_PROVIDER === 'API_OAUTH' &&
  (!API_OAUTH_CLIENT_ID || !API_OAUTH_CLIENT_SECRET || !API_OAUTH_ISSUER)
) {
  throw new Error(
    'API_OAUTH_CLIENT_ID, API_OAUTH_CLIENT_SECRET or API_OAUTH_ISSUER envs not defined',
  );
}

const providersArray: Provider[] = [];

if (AUTH_PROVIDER === 'OKTA') {
  providersArray.push(
    OktaProvider({
      clientId: OKTA_CLIENT_ID ?? '',
      clientSecret: OKTA_CLIENT_SECRET ?? '',
      issuer: OKTA_ISSUER ?? '',
      authorization: { params: { scope: 'openid email profile' } },
      token: { params: { scope: 'openid email profile' } },
      userinfo: { params: { scope: 'openid email profile' } },
    }),
  );
}

if (AUTH_PROVIDER === 'API_OAUTH') {
  providersArray.push({
    id: 'apioauth',
    name: process.env.API_OAUTH_VISIBLE_NAME ?? 'SSO',
    type: 'oauth',
    clientId: API_OAUTH_CLIENT_ID ?? '',
    clientSecret: API_OAUTH_CLIENT_SECRET ?? '',
    authorization: {
      url: `${API_OAUTH_ISSUER}/oauth/authorize`,
      params: { scope: 'read write', response_type: 'code' },
    },
    token: {
      url: `${API_OAUTH_ISSUER}/oauth/token`,
      params: { scope: 'read write', response_type: 'code' },
    },
    userinfo: {
      async request() {
        // Our API doesn't use the auth/userInfo endpoint,  but NextAuth requires it to get the access token.
        // Since we pass the access_token to our API, which returns a JWT, user and authenicates via Graph QL
        // We can just return a object with hardcoded info, as it doesn't get used anywhere.
        return {
          sub: '83692',
          name: 'Alice Adams',
          given_name: 'Alice',
          family_name: 'Adams',
          email: 'alice.adams@gmail.cpm',
          picture: 'https://example.com/83692/photo.jpg',
        };
      },
    },
    idToken: false,
    profile(profile) {
      return {
        id: profile?.sub,
        email: profile?.email,
      };
    },
    checks: ['pkce', 'state'],
  });
}

const options: NextAuthOptions = {
  providers: providersArray,
  secret: process.env.JWT_SECRET,
  callbacks: {
    signIn: async ({ user, account }) => {
      const { access_token } = account;

      if (!access_token) {
        throw new Error(
          `${account.provider} sign in failed to return an access_token`,
        );
      }

      if (account.provider === 'apioauth') {
        const { data } = await client.mutate<
          ApiOauthSignInMutation,
          ApiOauthSignInMutationVariables
        >({
          mutation: ApiOauthSignInDocument,
          variables: {
            accessToken: access_token,
          },
        });

        if (data?.apiOauthSignIn?.token) {
          user.apiToken = data.apiOauthSignIn.token;
          return true;
        }
        throw new Error('ApiOauthSignIn mutation failed to return a token');
      }

      const { data } = await client.mutate<
        OktaSignInMutation,
        OktaSignInMutationVariables
      >({
        mutation: OktaSignInDocument,
        variables: {
          accessToken: access_token,
        },
      });
      if (data?.oktaSignIn?.token) {
        user.apiToken = data.oktaSignIn.token;
        return true;
      }
      throw new Error('oktaSignIn mutation failed to return a token');
    },
    jwt: ({ token, user }) => {
      if (user) {
        return { ...token, apiToken: user?.apiToken };
      } else {
        return token;
      }
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: { ...session.user, apiToken: token.apiToken as string },
      };
    },
    redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url === 'signOut' && AUTH_PROVIDER === 'OKTA') {
        return `https://signon.okta.com/login/signout?fromURI=${encodeURIComponent(
          process.env.OKTA_SIGNOUT_REDIRECT_URL ?? '',
        )}`;
      }
      if (url.startsWith('/')) return new URL(url, baseUrl).toString();
      return baseUrl;
    },
  },
  logger: {
    error(code, metadata) {
      const errorMsg: Error | string =
        metadata instanceof Error
          ? metadata
          : metadata?.error instanceof Error
          ? metadata?.error
          : code;
      const customData = { code, ...metadata };
      if (process.env.NODE_ENV === 'production') {
        rollbar.error(errorMsg, customData);
      } else {
        // eslint-disable-next-line no-console
        console.error('NextAuth error :', customData);
      }
    },
  },
};

const Auth = (req: NextApiRequest, res: NextApiResponse): Promise<void> =>
  NextAuth(req, res, options);

export default Auth;
