import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import TestRouter from '__tests__/util/TestRouter';
import { GqlMockedProvider } from '__tests__/util/graphqlMocking';
import { GetAppealsQuery } from 'pages/accountLists/[accountListId]/tools/GetAppeals.generated';
import theme from '../../../../theme';
import Appeals from './Appeals';

const accountListId = 'test121';

const router = {
  query: { accountListId },
  isReady: true,
};

const testAppeal = {
  id: '1',
  name: 'Test Appeal',
  amount: 200,
  primary: false,
  amountCurrency: 'CAD',
  pledgesAmountNotReceivedNotProcessed: 5,
  pledgesAmountReceivedNotProcessed: 15,
  pledgesAmountProcessed: 25,
  pledgesAmountTotal: 55,
};

const mocks = {
  GetAppeals: {
    primaryAppeal: {
      nodes: [testAppeal],
      totalCount: 1,
    },
    regularAppeals: {
      nodes: [testAppeal],
      totalCount: 1,
      pageInfo: {
        hasNextPage: false,
      },
    },
  },
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

describe('AppealsTest', () => {
  it('show titles', () => {
    const { getByText } = render(
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <TestRouter router={router}>
            <GqlMockedProvider>
              <Appeals accountListId={accountListId} />
            </GqlMockedProvider>
          </TestRouter>
        </ThemeProvider>
      </SnackbarProvider>,
    );
    expect(getByText('Primary Appeal')).toBeInTheDocument();
    expect(getByText('Appeals')).toBeInTheDocument();
  });

  it('should render an appeal', async () => {
    const { getByText, findByText, findByTestId } = render(
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <TestRouter router={router}>
            <GqlMockedProvider<{ GetAppeals: GetAppealsQuery }> mocks={mocks}>
              <Appeals accountListId={accountListId} />
            </GqlMockedProvider>
          </TestRouter>
        </ThemeProvider>
      </SnackbarProvider>,
    );

    expect(await findByText('Primary Appeal')).toBeInTheDocument();
    expect(getByText('Appeals')).toBeInTheDocument();
    expect(await findByTestId('TypographyShowing')).toHaveTextContent(
      'Showing 2 of 2',
    );
  });

  it('should set appeal to primary', async () => {
    const { findByTestId } = render(
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <TestRouter router={router}>
            <GqlMockedProvider<{ GetAppeals: GetAppealsQuery }> mocks={mocks}>
              <Appeals accountListId={accountListId} />
            </GqlMockedProvider>
          </TestRouter>
        </ThemeProvider>
      </SnackbarProvider>,
    );
    const setPrimaryButton = await findByTestId('setPrimary-1');
    expect(setPrimaryButton).toBeInTheDocument();
    userEvent.click(setPrimaryButton);
    await waitFor(() => {
      expect(setPrimaryButton).not.toBeInTheDocument();
      expect(mockEnqueue).toHaveBeenCalled();
    });
  });
});
