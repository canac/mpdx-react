import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TestRouter from '__tests__/util/TestRouter';
import { GqlMockedProvider } from '__tests__/util/graphqlMocking';
import { GetUserOptionsQuery } from 'src/components/Contacts/ContactFlow/GetUserOptions.generated';
import { MailchimpAccountQuery } from 'src/components/Settings/integrations/Mailchimp/MailchimpAccount.generated';
import { GetUsersOrganizationsAccountsQuery } from 'src/components/Settings/integrations/Organization/Organizations.generated';
import { PrayerlettersAccountQuery } from 'src/components/Settings/integrations/Prayerletters/PrayerlettersAccount.generated';
import { SetupStageQuery } from 'src/components/Setup/Setup.generated';
import { SetupProvider } from 'src/components/Setup/SetupProvider';
import useGetAppSettings from 'src/hooks/useGetAppSettings';
import theme from 'src/theme';
import Integrations from './index.page';

const accountListId = 'account-list-1';

const mockEnqueue = jest.fn();
const mutationSpy = jest.fn();
const push = jest.fn();

const router = {
  query: { accountListId },
  pathname: '/accountLists/[accountListId]/settings/integrations',
  isReady: true,
  push,
};

jest.mock('src/hooks/useGetAppSettings');
jest.mock('notistack', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueue,
    };
  },
}));
interface MocksProvidersProps {
  children: JSX.Element;
  setup?: string;
}

const MocksProviders: React.FC<MocksProvidersProps> = ({ children, setup }) => (
  <ThemeProvider theme={theme}>
    <TestRouter router={router}>
      <GqlMockedProvider<{
        GetUsersOrganizationsAccounts: GetUsersOrganizationsAccountsQuery;
        MailchimpAccount: MailchimpAccountQuery;
        PrayerlettersAccount: PrayerlettersAccountQuery;
        GetUserOptions: GetUserOptionsQuery;
        SetupStage: SetupStageQuery;
      }>
        mocks={{
          GetUsersOrganizationsAccounts: {
            userOrganizationAccounts: [
              {
                organization: {},
              },
              {
                organization: {},
              },
            ],
          },
          MailchimpAccount: { mailchimpAccount: [] },
          PrayerlettersAccount: { prayerlettersAccount: [] },
          SetupStage: {
            user: {
              setup: null,
            },
            userOptions: [
              {
                key: 'setup_position',
                value: setup || '',
              },
            ],
          },
        }}
        onCall={mutationSpy}
      >
        <SetupProvider>{children}</SetupProvider>
      </GqlMockedProvider>
    </TestRouter>
  </ThemeProvider>
);

describe('Connect Services page', () => {
  beforeEach(() => {
    (useGetAppSettings as jest.Mock).mockReturnValue({
      appName: 'MPDX',
    });
  });
  it('should render', async () => {
    const { findByText } = render(
      <MocksProviders>
        <Integrations />
      </MocksProviders>,
    );
    expect(await findByText('Connect Services')).toBeInTheDocument();
    expect(await findByText('Organization')).toBeInTheDocument();
  });

  describe('Setup Tour', () => {
    it('should not show setup banner and accordions should not be disabled', async () => {
      const { queryByText, queryByRole, findByText, getByText } = render(
        <MocksProviders>
          <Integrations />
        </MocksProviders>,
      );

      await waitFor(() => {
        expect(
          queryByText('Make MPDX a part of your everyday life'),
        ).not.toBeInTheDocument();
        expect(
          queryByRole('button', { name: 'Next Step' }),
        ).not.toBeInTheDocument();
      });

      //Accordions should be clickable
      userEvent.click(await findByText('Organization'));
      await waitFor(() => {
        expect(
          getByText(
            'Add or change the organizations that sync donation information with this MPDX account. Removing an organization will not remove past information, but will prevent future donations and contacts from syncing.',
          ),
        ).toBeVisible();
      });
    });

    it('should show setup banner and open google', async () => {
      const { findByText, getByRole, getByText } = render(
        <MocksProviders setup="preferences.integrations">
          <Integrations />
        </MocksProviders>,
      );
      expect(
        await findByText('Make MPDX a part of your everyday life'),
      ).toBeInTheDocument();

      //Accordions should be disabled
      await waitFor(() => {
        const label = getByText('Organization');
        expect(() => userEvent.click(label)).toThrow();
      });

      const nextButton = getByRole('button', { name: 'Next Step' });

      // Start with Google
      expect(await findByText(/Add Account/i)).toBeInTheDocument();

      // Moves to MailChimp
      userEvent.click(nextButton);
      expect(await findByText(/Connect MailChimp/i)).toBeInTheDocument();

      // PrayerLetters.com
      await waitFor(() => userEvent.click(nextButton));
      await waitFor(() =>
        expect(
          getByText(
            'prayerletters.com is a significant way to save valuable ministry time while more effectively connecting with your partners. Keep your physical newsletter list up to date in MPDX and then sync it to your prayerletters.com account with this integration.',
          ),
        ).toBeInTheDocument(),
      );

      // Move to finish
      userEvent.click(nextButton);
      await waitFor(() => {
        expect(mutationSpy).toHaveGraphqlOperation('UpdateUserOptions', {
          key: 'setup_position',
          value: 'finish',
        });
        expect(push).toHaveBeenCalledWith(
          '/accountLists/account-list-1/setup/finish',
        );
      });
    });
  });
});