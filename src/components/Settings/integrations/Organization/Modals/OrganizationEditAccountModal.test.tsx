import { render, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import TestRouter from '__tests__/util/TestRouter';
import { GqlMockedProvider } from '../../../../../../__tests__/util/graphqlMocking';
import theme from '../../../../../theme';
import { IntegrationsContextProvider } from 'pages/accountLists/[accountListId]/settings/integrations.page';
import { OrganizationEditAccountModal } from './OrganizationEditAccountModal';

jest.mock('next-auth/react');

const accountListId = 'account-list-1';
const organizationId = 'organization-1';
const contactId = 'contact-1';
const apiToken = 'apiToken';
const router = {
  query: { accountListId, contactId: [contactId] },
  isReady: true,
};

const mockEnqueue = jest.fn();
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

const Components = (children: React.ReactElement) => (
  <SnackbarProvider>
    <TestRouter router={router}>
      <ThemeProvider theme={theme}>
        <IntegrationsContextProvider apiToken={apiToken}>
          {children}
        </IntegrationsContextProvider>
      </ThemeProvider>
    </TestRouter>
  </SnackbarProvider>
);

const handleClose = jest.fn();
const refetchOrganizations = jest.fn();

describe('OrganizationEditAccountModal', () => {
  process.env.OAUTH_URL = 'https://auth.mpdx.org';

  beforeEach(() => {
    handleClose.mockClear();
    refetchOrganizations.mockClear();
  });
  it('should render modal', async () => {
    const { getByText, getByTestId } = render(
      Components(
        <GqlMockedProvider>
          <OrganizationEditAccountModal
            handleClose={handleClose}
            organizationId={organizationId}
          />
        </GqlMockedProvider>,
      ),
    );

    expect(getByText('Edit Organization Account')).toBeInTheDocument();

    userEvent.click(getByText(/cancel/i));
    expect(handleClose).toHaveBeenCalledTimes(1);
    userEvent.click(getByTestId('CloseIcon'));
    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it('should enter login details.', async () => {
    const mutationSpy = jest.fn();
    const { getByText, getByRole } = render(
      Components(
        <GqlMockedProvider onCall={mutationSpy}>
          <OrganizationEditAccountModal
            handleClose={handleClose}
            organizationId={organizationId}
          />
        </GqlMockedProvider>,
      ),
    );

    await waitFor(() => {
      expect(getByText('Username')).toBeInTheDocument();
      expect(getByText('Password')).toBeInTheDocument();
    });

    userEvent.type(
      getByRole('textbox', {
        name: /username/i,
      }),
      'MyUsername',
    );

    await waitFor(() => expect(getByText('Save')).toBeDisabled());

    // TODO Need a way to test the password field.
    // Currently React-testing-library has a bug which doesn't see password inputs.

    // await waitFor(() => expect(getByText('Add Account')).not.toBeDisabled());
    // userEvent.click(getByText('Add Account'));

    // await waitFor(() => {
    //   expect(mockEnqueue).toHaveBeenCalledWith(
    //     'MPDX added your organization account',
    //     { variant: 'success' },
    //   );
    //   expect(mutationSpy.mock.calls[1][0].operation.operationName).toEqual(
    //     'CreateOrganizationAccount',
    //   );

    //   expect(mutationSpy.mock.calls[1][0].operation.variables.input).toEqual({
    //     attributes: {
    //       organizationId: mocks.GetOrganizations.organizations[2].id,
    //       username: 'MyUsername',
    //       password: 'MyPassword',
    //     },
    //   });
    // });
  });
});