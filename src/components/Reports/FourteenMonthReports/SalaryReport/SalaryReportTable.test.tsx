import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@material-ui/core';
import userEvent from '@testing-library/user-event';
import { FourteenMonthReportQuery } from '../GetFourteenMonthReport.generated';
import { SalaryReportTable } from './SalaryReportTable';
import { GqlMockedProvider } from '__tests__/util/graphqlMocking';
import theme from 'src/theme';

const accountListId = '111';
const title = 'test title';
const onNavListToggle = jest.fn();

//TODO: Need test coverage for error state

describe('SalaryReportTable', () => {
  it('loading', async () => {
    const { queryByTestId, getByText } = render(
      <ThemeProvider theme={theme}>
        <GqlMockedProvider<FourteenMonthReportQuery>>
          <SalaryReportTable
            accountListId={accountListId}
            isNavListOpen={true}
            title={title}
            onNavListToggle={onNavListToggle}
          />
        </GqlMockedProvider>
      </ThemeProvider>,
    );

    expect(getByText(title)).toBeInTheDocument();
    expect(queryByTestId('LoadingSalaryReport')).toBeInTheDocument();
    expect(queryByTestId('Notification')).toBeNull();
  });

  it('salary report loaded', async () => {
    const mocks = {
      FourteenMonthReport: {
        fourteenMonthReport: {
          currencyGroups: [
            {
              contacts: [
                {
                  id: 'contact-1',
                  months: [
                    {
                      month: '2020-10-01',
                      total: 35,
                    },
                    {
                      month: '2020-11-01',
                      total: 35,
                    },
                    {
                      month: '2020-12-01',
                      total: 35,
                    },
                    {
                      month: '2021-1-01',
                      total: 35,
                    },
                  ],
                  name: 'test name',
                },
              ],
              currency: 'cad',
              totals: {
                months: [
                  {
                    month: '2020-10-01',
                    total: 1836.32,
                  },
                  {
                    month: '2020-11-01',
                    total: 1836.32,
                  },
                  {
                    month: '2020-12-01',
                    total: 1836.32,
                  },
                  {
                    month: '2021-1-01',
                    total: 1836.32,
                  },
                ],
              },
            },
          ],
        },
      },
    };

    const { queryByTestId, getByTestId, getByText } = render(
      <ThemeProvider theme={theme}>
        <GqlMockedProvider<FourteenMonthReportQuery> mocks={mocks}>
          <SalaryReportTable
            accountListId={accountListId}
            isNavListOpen={true}
            title={title}
            onNavListToggle={onNavListToggle}
          />
        </GqlMockedProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(queryByTestId('LoadingSalaryReport')).not.toBeInTheDocument();
    });

    expect(getByText(title)).toBeInTheDocument();
    userEvent.click(getByTestId('ExpandUserInfoButton'));
    userEvent.click(getByTestId('PrintButton'));
  });

  it('empty', async () => {
    const mocks = {
      data: {
        fourteenMonthReport: {
          currencyGroups: [],
        },
      },
    };

    const { queryByTestId, getByText } = render(
      <ThemeProvider theme={theme}>
        <GqlMockedProvider<FourteenMonthReportQuery> mocks={mocks}>
          <SalaryReportTable
            accountListId={accountListId}
            isNavListOpen={true}
            title={title}
            onNavListToggle={onNavListToggle}
          />
        </GqlMockedProvider>
      </ThemeProvider>,
    );

    await waitFor(() => {
      expect(queryByTestId('LoadingSalaryReport')).not.toBeInTheDocument();
    });

    expect(getByText(title)).toBeInTheDocument();
    expect(queryByTestId('Notification')).toBeInTheDocument();
  });
});