import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import { GqlMockedProvider } from '../../../../__tests__/util/graphqlMocking';
import TestRouter from '../../../../__tests__/util/TestRouter';
import theme from '../../../../src/theme';
import { GetAppealsQuery } from '../../../../pages/accountLists/[accountListId]/tools/GetAppeals.generated';
import Appeals from './Appeals';

const accountListId = 'test121';

const router = {
  query: { accountListId },
  isReady: true,
};

const testAppealPrimary = {
  id: '1',
  name: 'Test Primary',
  amount: 100,
  amountCurrency: 'CAD',
  pledgesAmountNotReceivedNotProcessed: 10,
  pledgesAmountReceivedNotProcessed: 20,
  pledgesAmountProcessed: 30,
  pledgesAmountTotal: 40,
};

const testAppeal = {
  id: '2',
  name: 'Test Appeal',
  amount: 200,
  amountCurrency: 'CAD',
  pledgesAmountNotReceivedNotProcessed: 5,
  pledgesAmountReceivedNotProcessed: 15,
  pledgesAmountProcessed: 25,
  pledgesAmountTotal: 55,
};

describe('AppealsTest', () => {
  it('show titles', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <TestRouter router={router}>
          <GqlMockedProvider>
            <Appeals />
          </GqlMockedProvider>
        </TestRouter>
      </ThemeProvider>,
    );
    expect(getByText('Primary Appeal')).toBeInTheDocument();
    expect(getByText('Appeals')).toBeInTheDocument();
  });

  it('should render an appeal', async () => {
    const { getByText, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <TestRouter router={router}>
          <GqlMockedProvider<GetAppealsQuery>
            mocks={{
              GetPrimaryAppeal: {
                appeals: {
                  nodes: [testAppealPrimary],
                },
              },
              GetAppeals: {
                appeals: {
                  nodes: [testAppeal],
                },
              },
            }}
          >
            <Appeals />
          </GqlMockedProvider>
        </TestRouter>
      </ThemeProvider>,
    );
    await waitFor(() => expect(getByText('Test Primary')).toBeInTheDocument());
    await waitFor(() => expect(getByText('Test Appeal')).toBeInTheDocument());
    await waitFor(() =>
      expect(getByTestId('TypographyShowing').textContent).toEqual(
        'Showing 2 of 2',
      ),
    );
  });
});
