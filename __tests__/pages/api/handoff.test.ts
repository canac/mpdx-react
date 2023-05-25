import { createMocks } from 'node-mocks-http';
import { getToken } from 'next-auth/jwt';
import handoff from '../../../pages/api/handoff.page';
import { ssrClient } from 'src/lib/client';
import { reportError } from 'pages/api/utils/RollBar';

jest.mock('next-auth/jwt', () => ({ getToken: jest.fn() }));
jest.mock('src/lib/client', () => ({ ssrClient: jest.fn() }));

interface createMocksRequests {
  req: any;
  res: any;
}

describe('/api/handoff', () => {
  it('returns 422', async () => {
    const { req, res }: createMocksRequests = createMocks({ method: 'GET' });
    await handoff(req, res);

    expect(res._getStatusCode()).toBe(422);
  });

  describe('session', () => {
    const defaultAccountList = 'defaultAccountList';
    beforeEach(() => {
      (getToken as jest.Mock).mockReturnValue({
        apiToken: 'accessToken',
        userID: 'sessionUserID',
      });
      (ssrClient as jest.Mock).mockReturnValue({
        query: jest.fn().mockReturnValue({
          data: { user: { defaultAccountList } },
        }),
      });
      reportError as jest.Mock;
    });

    it('returns redirect', async () => {
      const { req, res }: createMocksRequests = createMocks({
        method: 'GET',
        query: {
          accountListId: 'accountListId',
          userId: 'userId',
          path: 'path',
        },
      });
      await handoff(req, res);

      expect(res._getStatusCode()).toBe(302);
      expect(res._getRedirectUrl()).toBe(
        'https://stage.mpdx.org/handoff?accessToken=accessToken&accountListId=accountListId&userId=userId&path=path',
      );
    });

    it('returns redirect but gets session userID', async () => {
      const { req, res }: createMocksRequests = createMocks({
        method: 'GET',
        query: {
          accountListId: 'accountListId',
          userId: '',
          path: 'path',
        },
      });
      await handoff(req, res);

      expect(res._getStatusCode()).toBe(302);
      expect(res._getRedirectUrl()).toBe(
        `https://stage.mpdx.org/handoff?accessToken=accessToken&accountListId=accountListId&userId=sessionUserID&path=path`,
      );
    });

    it('returns redirect but gets defaultAccountList', async () => {
      const { req, res }: createMocksRequests = createMocks({
        method: 'GET',
        query: {
          accountListId: '',
          userId: 'userId',
          path: 'path',
        },
      });
      await handoff(req, res);

      expect(res._getStatusCode()).toBe(302);
      expect(res._getRedirectUrl()).toBe(
        `https://stage.mpdx.org/handoff?accessToken=accessToken&accountListId=${defaultAccountList}&userId=userId&path=path`,
      );
    });

    it('returns redirect but gets first accountList id', async () => {
      (ssrClient as jest.Mock).mockReturnValue({
        query: jest.fn().mockReturnValue({
          data: {
            user: { defaultAccountList: '' },
            accountLists: { nodes: [{ id: 'accountID' }] },
          },
        }),
      });
      const { req, res }: createMocksRequests = createMocks({
        method: 'GET',
        query: {
          accountListId: '',
          userId: 'userId',
          path: 'path',
        },
      });
      await handoff(req, res);

      expect(res._getStatusCode()).toBe(302);
      expect(res._getRedirectUrl()).toBe(
        `https://stage.mpdx.org/handoff?accessToken=accessToken&accountListId=accountID&userId=userId&path=path`,
      );
    });

    it('returns redirect for auth', async () => {
      const { req, res }: createMocksRequests = createMocks({
        method: 'GET',
        query: {
          path: 'auth/user/admin',
          auth: 'true',
        },
      });
      await handoff(req, res);

      expect(res._getStatusCode()).toBe(302);
      expect(res._getRedirectUrl()).toBe(
        'https://auth.stage.mpdx.org/auth/user/admin?access_token=accessToken',
      );
    });

    describe('SITE_URL set', () => {
      const OLD_ENV = process.env;

      beforeEach(() => {
        jest.resetModules();
        process.env = { ...OLD_ENV, SITE_URL: 'https://next.mpdx.org' };
      });

      afterAll(() => {
        process.env = OLD_ENV;
      });

      it('returns redirect', async () => {
        const { req, res }: createMocksRequests = createMocks({
          method: 'GET',
          query: {
            accountListId: 'accountListId',
            userId: 'userId',
            path: 'path',
          },
        });
        await handoff(req, res);

        expect(res._getStatusCode()).toBe(302);
        expect(res._getRedirectUrl()).toBe(
          'https://mpdx.org/handoff?accessToken=accessToken&accountListId=accountListId&userId=userId&path=path',
        );
      });

      it('returns redirect for auth', async () => {
        const { req, res }: createMocksRequests = createMocks({
          method: 'GET',
          query: {
            path: 'auth/user/admin',
            auth: 'true',
          },
        });
        await handoff(req, res);

        expect(res._getStatusCode()).toBe(302);
        expect(res._getRedirectUrl()).toBe(
          'https://auth.mpdx.org/auth/user/admin?access_token=accessToken',
        );
      });
    });
  });
});
