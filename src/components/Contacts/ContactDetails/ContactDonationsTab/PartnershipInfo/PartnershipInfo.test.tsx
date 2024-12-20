import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import { ThemeProvider } from '@mui/material/styles';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import userEvent from '@testing-library/user-event';
import { DateTime } from 'luxon';
import { SnackbarProvider } from 'notistack';
import { gqlMock } from '__tests__/util/graphqlMocking';
import { render, waitFor } from '__tests__/util/testingLibraryReactMock';
import { PledgeFrequencyEnum, StatusEnum } from 'src/graphql/types.generated';
import theme from '../../../../../theme';
import {
  ContactDonorAccountsFragment,
  ContactDonorAccountsFragmentDoc,
} from '../ContactDonationsTab.generated';
import { PartnershipInfo } from './PartnershipInfo';

const mock = gqlMock<ContactDonorAccountsFragment>(
  ContactDonorAccountsFragmentDoc,
  {
    mocks: {
      status: StatusEnum.PartnerFinancial,
      nextAsk: DateTime.local().plus({ month: 3 }).toISO(),
      pledgeCurrency: 'CAD',
      pledgeStartDate: DateTime.local().toISO(),
      pledgeFrequency: PledgeFrequencyEnum.Annual,
      pledgeAmount: 55,
      lastDonation: {
        donationDate: DateTime.local().toISO(),
        amount: {
          currency: 'CAD',
        },
      },
    },
  },
);

const emptyMock = gqlMock<ContactDonorAccountsFragment>(
  ContactDonorAccountsFragmentDoc,
  {
    mocks: {
      status: null,
    },
  },
);

jest.mock('next/router', () => ({
  useRouter: () => {
    return {
      query: { accountListId: 'abc' },
      isReady: true,
    };
  },
}));

describe('PartnershipInfo', () => {
  it('test renderer', async () => {
    const { getByText, findByText } = render(
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <MockedProvider>
              <PartnershipInfo contact={mock} />
            </MockedProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SnackbarProvider>,
    );

    await waitFor(() => {
      expect(getByText('CA$55 - Annual')).toBeInTheDocument();
    });
    expect(await findByText('Partner - Financial')).toBeInTheDocument();
  });

  it('renders No Status', async () => {
    const { findByText } = render(
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <MockedProvider>
              <PartnershipInfo contact={emptyMock} />
            </MockedProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SnackbarProvider>,
    );

    expect(await findByText('No Status')).toBeInTheDocument();
  });

  it('should open edit partnership information modal', () => {
    const { getByText, getByLabelText } = render(
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <MockedProvider>
              <PartnershipInfo contact={mock} />
            </MockedProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SnackbarProvider>,
    );

    userEvent.click(getByLabelText('Edit Icon'));
    expect(getByText('Edit Partnership')).toBeInTheDocument();
  });

  it('should close edit partnership information modal', async () => {
    const { getByText, getByLabelText, queryByText } = render(
      <SnackbarProvider>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <MockedProvider>
              <PartnershipInfo contact={mock} />
            </MockedProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SnackbarProvider>,
    );

    userEvent.click(getByLabelText('Edit Icon'));
    expect(getByText('Edit Partnership')).toBeInTheDocument();
    userEvent.click(getByLabelText('Close'));
    await waitFor(() =>
      expect(queryByText('Edit Partnership')).not.toBeInTheDocument(),
    );
  });
});
