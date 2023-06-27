import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import { NavReportsList } from './NavReportsList';
import TestRouter from '__tests__/util/TestRouter';
import { GqlMockedProvider } from '__tests__/util/graphqlMocking';
import theme from 'src/theme';
import { GetDesignationAccountsQuery } from '../DonationsReport/Table/Modal/EditDonation.generated';

const accountListId = 'account-list-1';
const selected = 'salaryCurrency';

const router = {
  query: { accountListId },
  isReady: true,
};

describe('NavReportsList', () => {
  it('default', async () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <TestRouter router={router}>
          <GqlMockedProvider>
            <NavReportsList
              selectedId={selected}
              isOpen={true}
              onClose={() => {}}
              designationAccounts={[]}
              setDesignationAccounts={() => {}}
            />
          </GqlMockedProvider>
        </TestRouter>
      </ThemeProvider>,
    );

    expect(getByText('Donations')).toBeInTheDocument();
    expect(getByText('14 Month Partner Report')).toBeInTheDocument();
    expect(getByText('14 Month Salary Report')).toBeInTheDocument();
    expect(getByText('Designation Accounts')).toBeInTheDocument();
    expect(getByText('Responsibility Centers')).toBeInTheDocument();
    expect(getByText('Expected Monthly Total')).toBeInTheDocument();
    expect(getByText('Partner Giving Analysis')).toBeInTheDocument();
    expect(getByText('Coaching')).toBeInTheDocument();
  });

  it('has designation account filter', async () => {
    const mocks = {
      GetDesignationAccounts: {
        designationAccounts: [
          {
            designationAccounts: [
              { id: 'account-1', name: 'Account 1' },
              { id: 'account-2', name: 'Account 2' },
              { id: 'account-3', name: 'Account 3' },
            ],
          },
        ],
      },
    };

    const designationAccounts = ['account-1'];
    const setDesignationAccounts = jest.fn();

    const mutationSpy = jest.fn();
    const { getAllByRole, getByRole, getByTestId } = render(
      <ThemeProvider theme={theme}>
        <TestRouter router={router}>
          <GqlMockedProvider<{
            GetDesignationAccounts: GetDesignationAccountsQuery;
          }>
            mocks={mocks}
            onCall={mutationSpy}
          >
            <NavReportsList
              selectedId={selected}
              isOpen={true}
              onClose={() => {}}
              designationAccounts={designationAccounts}
              setDesignationAccounts={setDesignationAccounts}
            />
          </GqlMockedProvider>
        </TestRouter>
      </ThemeProvider>,
    );

    await waitFor(() => expect(mutationSpy).toHaveBeenCalled());

    userEvent.click(getByRole('combobox', { name: 'Designation Account' }));
    expect(getAllByRole('option').map((option) => option.textContent)).toEqual([
      'Account 2',
      'Account 3',
    ]);
    userEvent.click(getByRole('option', { name: 'Account 2' }));
    expect(setDesignationAccounts).toHaveBeenLastCalledWith([
      'account-1',
      'account-2',
    ]);
    userEvent.click(getByTestId('CancelIcon'));
    expect(setDesignationAccounts).toHaveBeenLastCalledWith([]);
  });

  it('hides designation account filter when there is only one option', async () => {
    const mocks = {
      GetDesignationAccounts: {
        designationAccounts: [
          {
            designationAccounts: [{ id: 'account-1', name: 'Account 1' }],
          },
        ],
      },
    };

    const mutationSpy = jest.fn();
    const { queryByRole } = render(
      <ThemeProvider theme={theme}>
        <TestRouter router={router}>
          <GqlMockedProvider<{
            GetDesignationAccounts: GetDesignationAccountsQuery;
          }>
            mocks={mocks}
            onCall={mutationSpy}
          >
            <NavReportsList
              selectedId={selected}
              isOpen={true}
              onClose={() => {}}
              designationAccounts={[]}
              setDesignationAccounts={jest.fn()}
            />
          </GqlMockedProvider>
        </TestRouter>
      </ThemeProvider>,
    );

    await waitFor(() => expect(mutationSpy).toHaveBeenCalled());

    expect(
      queryByRole('combobox', { name: 'Designation Account' }),
    ).not.toBeInTheDocument();
  });
});
