import fs from 'fs';
import { loadInitialPage, main } from './lighthouse-auth.mjs';

describe('Lighthouse Pre-Login Steps', () => {
  const OLD_ENV = process.env;
  const previewUrl = 'https://pr-908.d3dytjb8adxkk5.amplifyapp.com';

  const browser = {
    newPage: jest.fn(),
  };
  const initialPage = {
    goto: jest.fn(),
    $: jest.fn(),
    waitForNavigation: jest.fn(),
    waitForSelector: jest.fn(),
    close: jest.fn(),
  };

  browser.newPage.mockImplementation(() => {
    return Promise.resolve(initialPage);
  });

  const successResult = {
    lhr: {
      categories: {
        performance: { score: 0.79 },
        accessibility: { score: 0.98 },
        'best-practices': { score: 0.96 },
        seo: { score: 1 },
        pwa: { score: 1 },
      },
      audits: {
        'largest-contentful-paint': {
          id: 'largest-contentful-paint',
          title: 'Largest Contentful Paint',
          numericValue: 2309.1237499999997,
          displayValue: '2.3 s',
          scoringOptions: {
            p10: 2500,
            median: 4000,
          },
        },
        'cumulative-layout-shift': {
          id: 'cumulative-layout-shift',
          title: 'Cumulative Layout Shift',
          numericValue: 0.029442302042286688,
          displayValue: '0.029',
          scoringOptions: {
            p10: 0.1,
            median: 0.25,
          },
        },
      },
    },
  };

  const mockLighthouse = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    jest.mock('fs', () => ({ appendFile: jest.fn() }));
    jest.spyOn(fs, 'appendFile').mockImplementation(() => {});
    process.env = { ...OLD_ENV };
  });

  describe('main', () => {
    it('should write the results to a file', async () => {
      const initialResponse = {
        status: 200,
      };

      initialPage.goto.mockImplementation(() => {
        return Promise.resolve(initialResponse);
      });

      successfulTestMock();

      await main(
        mockLighthouse,
        browser,
        'http://localhost:3000/accountLists',
        'http://localhost:3000',
      );
      expect(fs.appendFile).toHaveBeenCalledTimes(1);
    });
  });

  describe('loadInitialPage', () => {
    it('should load the initial page right away', async () => {
      process.env.PREVIEW_URL = previewUrl;
      const initialResponse = {
        status: 200,
      };

      initialPage.goto.mockImplementation(() => {
        return Promise.resolve(initialResponse);
      });

      successfulTestMock();

      await loadInitialPage(initialPage, `${previewUrl}/accountLists`, 500);
      expect(initialPage.goto).toHaveBeenCalledTimes(1);
    });

    it('should wait until the page is available', async () => {
      process.env.PREVIEW_URL = previewUrl;
      const initialResponse = {
        status: 404,
      };

      initialPage.goto
        .mockImplementationOnce(() => {
          return Promise.resolve(initialResponse);
        })
        .mockImplementationOnce(() => {
          return Promise.resolve({ status: 200 });
        });

      successfulTestMock();

      await loadInitialPage(initialPage, `${previewUrl}/accountLists`, 500);
      expect(initialPage.goto).toHaveBeenCalledTimes(2);
    });
  });

  const successfulTestMock = () => {
    initialPage.$.mockImplementation((selector) => {
      if (selector === '#sign-in-button') {
        return Promise.resolve({
          click: jest.fn(),
        });
      }
      return Promise.resolve({});
    });

    initialPage.waitForSelector.mockImplementation((selector) => {
      let element;
      if (
        selector === '#okta-signin-username' ||
        selector === 'input[type="password"]'
      ) {
        element = {
          type: jest.fn(),
          press: jest.fn(),
        };
      } else if (selector === '#okta-signin-submit') {
        element = {
          click: jest.fn(),
        };
      }
      return Promise.resolve(element);
    });

    mockLighthouse.mockImplementation(() => {
      return Promise.resolve(successResult);
    });
  };

  afterAll(() => {
    process.env = OLD_ENV;
  });
});
