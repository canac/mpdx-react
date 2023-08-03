import fetchMock from 'jest-fetch-mock';
import React from 'react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { signOut, useSession } from 'next-auth/react';
import TestRouter from '../../../../../../../__tests__/util/TestRouter';
import {
  render,
  waitFor,
} from '../../../../../../../__tests__/util/testingLibraryReactMock';
import {
  getTopBarMock,
  getTopBarMockWithMultipleAccountLists,
} from '../../TopBar.mock';
import TestWrapper from '../../../../../../../__tests__/util/TestWrapper';
import theme from '../../../../../../theme';
import ProfileMenu from './ProfileMenu';

const session = {
  expires: '2021-10-28T14:48:20.897Z',
  user: {
    email: 'Chair Library Bed',
    image: null,
    name: 'Dung Tapestry',
    token: 'superLongJwtString',
    impersonating: false,
  },
};

jest.mock('next-auth/react', () => {
  return {
    signOut: jest.fn().mockImplementation(() => Promise.resolve()),
    getSession: jest.fn().mockImplementation(() => Promise.resolve(session)),
    useSession: jest.fn().mockImplementation(() => Promise.resolve(session)),
  };
});

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

const router = {
  pathname: '/accountLists/[accountListId]/test',
  query: { accountListId: '1' },
  isReady: true,
  push: jest.fn(),
};

const routerNoAccountListId = {
  pathname: '/accountLists/',
  isReady: true,
  push: jest.fn(),
};

describe('ProfileMenu', () => {
  it('default', async () => {
    const { getByTestId, queryByText, getByText } = render(
      <ThemeProvider theme={theme}>
        <TestWrapper mocks={[getTopBarMock()]}>
          <ProfileMenu />
        </TestWrapper>
      </ThemeProvider>,
    );
    await waitFor(() => expect(getByText('John Smith')).toBeInTheDocument());
    userEvent.click(getByTestId('profileMenuButton'));
    expect(queryByText('Manage Organizations')).toBeInTheDocument();
    expect(queryByText('Admin Console')).toBeInTheDocument();
    expect(queryByText('Backend Admin')).toBeInTheDocument();
    expect(queryByText('Sidekiq')).toBeInTheDocument();
  });

  it('should change account list in the router', async () => {
    const { getByTestId, getByText } = render(
      <ThemeProvider theme={theme}>
        <TestWrapper mocks={[getTopBarMock()]}>
          <TestRouter router={router}>
            <ProfileMenu />
          </TestRouter>
        </TestWrapper>
      </ThemeProvider>,
    );
    await waitFor(() => expect(getByText('John Smith')).toBeInTheDocument());
    userEvent.click(getByTestId('profileMenuButton'));
    userEvent.click(getByTestId('accountListSelector'));
    userEvent.click(getByTestId('accountListButton-1'));
    await waitFor(() => expect(router.push).toHaveBeenCalled());
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/accountLists/[accountListId]/test',
      query: {
        accountListId: '1',
      },
    });
  });

  it('should change account list in the router and persist query parameters', async () => {
    const { getByTestId, getByText } = render(
      <ThemeProvider theme={theme}>
        <TestWrapper mocks={[getTopBarMock()]}>
          <TestRouter
            router={{
              ...router,
              pathname: '/accountLists/[accountListId]/test?searchTerm=Cool',
              query: { ...router.query, searchTerm: 'Cool' },
            }}
          >
            <ProfileMenu />
          </TestRouter>
        </TestWrapper>
      </ThemeProvider>,
    );
    await waitFor(() => expect(getByText('John Smith')).toBeInTheDocument());
    userEvent.click(getByTestId('profileMenuButton'));
    userEvent.click(getByTestId('accountListSelector'));
    userEvent.click(getByTestId('accountListButton-1'));
    await waitFor(() => expect(router.push).toHaveBeenCalled());
    expect(router.push).toHaveBeenCalledWith({
      pathname: '/accountLists/[accountListId]/test?searchTerm=Cool',
      query: {
        searchTerm: 'Cool',
        accountListId: '1',
      },
    });
  });

  it('should route to path with account list', async () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <TestWrapper mocks={[getTopBarMock()]}>
          <TestRouter router={routerNoAccountListId}>
            <ProfileMenu />
          </TestRouter>
        </TestWrapper>
      </ThemeProvider>,
    );
    await waitFor(() => expect(getByText('John Smith')).toBeInTheDocument());
    expect(queryByTestId('accountListName')).not.toBeInTheDocument();
    userEvent.click(getByTestId('profileMenuButton'));
    userEvent.click(getByTestId('accountListSelector'));
    userEvent.click(getByTestId('accountListButton-1'));
    await waitFor(() => expect(routerNoAccountListId.push).toHaveBeenCalled());
    expect(routerNoAccountListId.push).toHaveBeenCalledWith({
      pathname: '/accountLists/[accountListId]/',
      query: {
        accountListId: '1',
      },
    });
  });

  it('should display account name if user has two or more account lists', async () => {
    const { getByTestId, getByText } = render(
      <ThemeProvider theme={theme}>
        <TestWrapper mocks={[getTopBarMockWithMultipleAccountLists()]}>
          <TestRouter router={router}>
            <ProfileMenu />
          </TestRouter>
        </TestWrapper>
      </ThemeProvider>,
    );
    await waitFor(() => expect(getByText('John Smith')).toBeInTheDocument());
    expect(getByTestId('accountListName')).toBeInTheDocument();
    expect(getByText('Staff Account')).toBeInTheDocument();
  });

  it('Ensure Sign Out is called with callback', async () => {
    const { getByTestId, getByText, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <TestWrapper mocks={[getTopBarMock()]}>
          <TestRouter router={routerNoAccountListId}>
            <ProfileMenu />
          </TestRouter>
        </TestWrapper>
      </ThemeProvider>,
    );
    await waitFor(() => expect(getByText('John Smith')).toBeInTheDocument());
    expect(queryByTestId('accountListName')).not.toBeInTheDocument();
    userEvent.click(getByTestId('profileMenuButton'));
    await waitFor(() =>
      expect(queryByTestId('profileMenu')).toBeInTheDocument(),
    );
    await waitFor(() => expect(getByText(/sign out/i)).toBeInTheDocument());
    userEvent.click(getByText(/sign out/i));
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: 'signOut' });
  });
});

describe('ProfileMenu while Impersonating', () => {
  fetchMock.enableMocks();
  window = Object.create(window);
  const url = 'https://mpdx.org';
  Object.defineProperty(window, 'location', {
    value: {
      href: url,
    },
    writable: true,
  });

  beforeEach(() => {
    session.user.impersonating = true;
    (useSession as jest.Mock).mockReturnValue({
      data: {
        ...session,
      },
      status: 'authenticated',
    });
  });

  it('Should remove impersonating cookies and redirect user to Angular MPDX', async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponses([
      JSON.stringify({ status: 'success' }),
      { status: 200 },
    ]);

    const { getByTestId, getByText, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <TestWrapper mocks={[getTopBarMock()]}>
          <TestRouter router={router}>
            <ProfileMenu />
          </TestRouter>
        </TestWrapper>
      </ThemeProvider>,
    );
    await waitFor(() =>
      expect(getByText('Impersonating John Smith')).toBeInTheDocument(),
    );
    expect(queryByTestId('accountListName')).not.toBeInTheDocument();
    userEvent.click(getByTestId('profileMenuButton'));
    await waitFor(() =>
      expect(queryByTestId('profileMenu')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(getByText(/stop impersonating/i)).toBeInTheDocument(),
    );
    userEvent.click(getByText(/stop impersonating/i));

    await waitFor(() =>
      expect(mockEnqueue).toHaveBeenCalledWith(
        'Redirecting you to the legacy MPDX"',
        {
          variant: 'success',
        },
      ),
    );

    await waitFor(() =>
      expect(window.location.href).toEqual(
        `${process.env.SITE_URL}/api/handoff?accountListId=1&userId=user-1&path=%2Flogout`,
      ),
    );
  });

  it('Should return an error while trying to remove impersonating cookies', async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponses([
      JSON.stringify({ status: 'failed' }),
      { status: 201 },
    ]);

    const { getByTestId, getByText, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <TestWrapper mocks={[getTopBarMock()]}>
          <TestRouter router={router}>
            <ProfileMenu />
          </TestRouter>
        </TestWrapper>
      </ThemeProvider>,
    );
    await waitFor(() =>
      expect(getByText('Impersonating John Smith')).toBeInTheDocument(),
    );
    expect(queryByTestId('accountListName')).not.toBeInTheDocument();
    userEvent.click(getByTestId('profileMenuButton'));
    await waitFor(() =>
      expect(queryByTestId('profileMenu')).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(getByText(/stop impersonating/i)).toBeInTheDocument(),
    );
    userEvent.click(getByText(/stop impersonating/i));

    await waitFor(() =>
      expect(mockEnqueue).toHaveBeenCalledWith('Failed to stop impersonating', {
        variant: 'error',
      }),
    );
  });
});
