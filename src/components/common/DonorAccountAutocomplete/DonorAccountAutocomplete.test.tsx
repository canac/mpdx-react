import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../theme';
import { GqlMockedProvider } from '../../../../__tests__/util/graphqlMocking';
import { DonorAccountAutocomplete } from './DonorAccountAutocomplete';
import { GetDonorAccountsQuery } from './DonorAccountAutocomplete.generated';
import userEvent from '@testing-library/user-event';

const accountListId = 'account-list-id';
const onChange = jest.fn();

const mocks = {
  GetDonorAccounts: {
    accountListDonorAccounts: [
      { id: 'donor-1', displayName: 'Donor 1' },
      { id: 'donor-2', displayName: 'Donor 2' },
      { id: 'donor-3', displayName: 'Donor 3' },
    ],
  },
};

describe('DonorAccountAutocomplete', () => {
  it('shows the initial donor', () => {
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <GqlMockedProvider>
          <DonorAccountAutocomplete
            accountListId={accountListId}
            value={'donor-1'}
            preloadedDonors={[{ id: 'donor-1', name: 'Donor 1' }]}
            onChange={onChange}
          />
        </GqlMockedProvider>
      </ThemeProvider>,
    );

    expect(getByRole('combobox')).toHaveValue('Donor 1');
  });

  it('loads donors from the server on type', async () => {
    const mutationSpy = jest.fn();
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <GqlMockedProvider<GetDonorAccountsQuery>
          mocks={mocks}
          onCall={mutationSpy}
        >
          <DonorAccountAutocomplete
            accountListId={accountListId}
            value={'donor-1'}
            preloadedDonors={[{ id: 'donor-1', name: 'Donor 1' }]}
            onChange={onChange}
          />
        </GqlMockedProvider>
      </ThemeProvider>,
    );

    userEvent.type(getByRole('combobox'), 'Donor');
    await waitFor(() => expect(mutationSpy).toHaveBeenCalledTimes(1));

    expect(mutationSpy.mock.calls[0][0].operation.variables).toEqual({
      accountListId,
      searchTerm: 'Donor',
    });
  });

  it('debounces loading donors from the server on type', async () => {
    const mutationSpy = jest.fn();
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <GqlMockedProvider<GetDonorAccountsQuery>
          mocks={mocks}
          onCall={mutationSpy}
        >
          <DonorAccountAutocomplete
            accountListId={accountListId}
            value={'donor-1'}
            preloadedDonors={[{ id: 'donor-1', name: 'Donor 1' }]}
            onChange={onChange}
          />
        </GqlMockedProvider>
      </ThemeProvider>,
    );

    userEvent.type(getByRole('combobox'), 'D');
    await new Promise((resolve) => setTimeout(resolve, 500));
    userEvent.type(getByRole('combobox'), 'o');
    await new Promise((resolve) => setTimeout(resolve, 500));
    userEvent.type(getByRole('combobox'), 'n');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    expect(mutationSpy).toHaveBeenCalledTimes(1);
    expect(mutationSpy.mock.calls[0][0].operation.variables).toEqual({
      accountListId,
      searchTerm: 'Don',
    });

    userEvent.type(getByRole('combobox'), 'o');
    await new Promise((resolve) => setTimeout(resolve, 500));
    userEvent.type(getByRole('combobox'), 'r');
    await new Promise((resolve) => setTimeout(resolve, 1200));
    expect(mutationSpy).toHaveBeenCalledTimes(2);
    expect(mutationSpy.mock.calls[1][0].operation.variables).toEqual({
      accountListId,
      searchTerm: 'Donor',
    });
  });

  it('deduplicates preloaded and server-loaded donors', async () => {
    const mutationSpy = jest.fn();
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <GqlMockedProvider<GetDonorAccountsQuery>
          mocks={mocks}
          onCall={mutationSpy}
        >
          <DonorAccountAutocomplete
            accountListId={accountListId}
            value={'donor-1'}
            preloadedDonors={[{ id: 'donor-1', name: 'Donor 1' }]}
            onChange={onChange}
          />
        </GqlMockedProvider>
      </ThemeProvider>,
    );

    const combobox = getByRole('combobox');
    expect(combobox).toHaveValue('Donor 1');
    userEvent.clear(combobox);
    userEvent.type(combobox, 'Donor');
    await waitFor(() => expect(mutationSpy).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(
        Array.from(getByRole('listbox').children).map(
          (child) => child.innerHTML,
        ),
      ).toEqual(['Donor 1', 'Donor 2', 'Donor 3']),
    );
  });
});
