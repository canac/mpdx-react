import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../../../../theme';
import { GqlMockedProvider } from '../../../../../../__tests__/util/graphqlMocking';
import TestRouter from '__tests__/util/TestRouter';
import { SnackbarProvider } from 'notistack';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import {
  DeleteDonationMutation,
  UpdateDonationMutation,
} from './EditDonation.generated';
import { EditDonationModal } from './EditDonationModal';
import { Donation } from '../DonationsReportTable';

const time = new Date('2021-03-25');
const router = {
  query: { accountListId: 'aaa' },
  isReady: true,
};

const handleClose = jest.fn();

const donation: Donation = {
  appeal: null,
  contactId: 'contact1',
  convertedAmount: 100.0,
  currency: 'CAD',
  date: time,
  designation: 'Designation (0000)',
  foreignAmount: 100.0,
  foreignCurrency: 'CAD',
  id: 'abc',
  method: 'BRANK_TRANS',
  partner: 'partner',
  partnerId: '123',
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

describe('DonationsReportTable', () => {
  it('renders with data', async () => {
    const mutationSpy = jest.fn();
    const { getByText, getByRole } = render(
      <SnackbarProvider>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={theme}>
            <TestRouter router={router}>
              <GqlMockedProvider<UpdateDonationMutation> onCall={mutationSpy}>
                <EditDonationModal
                  donation={donation}
                  open={true}
                  handleClose={handleClose}
                  startDate={time.toString()}
                  endDate={time.toString()}
                />
              </GqlMockedProvider>
            </TestRouter>
          </ThemeProvider>
        </LocalizationProvider>
      </SnackbarProvider>,
    );
    await waitFor(() => expect(getByText('Edit Donation')).toBeInTheDocument());
    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(getByRole('textbox', { name: 'Amount' })).toHaveValue('100');
  });

  it('renders with no donation', async () => {
    const mutationSpy = jest.fn();
    const { getByText, getByRole, queryByText } = render(
      <SnackbarProvider>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={theme}>
            <TestRouter router={router}>
              <GqlMockedProvider<UpdateDonationMutation> onCall={mutationSpy}>
                <EditDonationModal
                  open={true}
                  handleClose={handleClose}
                  startDate={time.toString()}
                  endDate={time.toString()}
                />
              </GqlMockedProvider>
            </TestRouter>
          </ThemeProvider>
        </LocalizationProvider>
      </SnackbarProvider>,
    );
    await waitFor(() => expect(getByText('Edit Donation')).toBeInTheDocument());
    expect(getByRole('textbox', { name: 'Amount' })).toHaveValue('');
    expect(queryByText('Field is required')).not.toBeInTheDocument();
    userEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(getByText('Field is required')).toBeInTheDocument(),
    );
    userEvent.type(getByRole('textbox', { name: 'Amount' }), '123');
    expect(getByRole('textbox', { name: 'Amount' })).toHaveValue('123');
    userEvent.click(getByRole('button', { name: 'Save' }));
    await waitFor(() =>
      expect(queryByText('Field is required')).not.toBeInTheDocument(),
    );
  });

  it('edits fields', async () => {
    const mutationSpy = jest.fn();
    const { getByText, getByRole } = render(
      <SnackbarProvider>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={theme}>
            <TestRouter router={router}>
              <GqlMockedProvider<UpdateDonationMutation> onCall={mutationSpy}>
                <EditDonationModal
                  donation={donation}
                  open={true}
                  handleClose={handleClose}
                  startDate={time.toString()}
                  endDate={time.toString()}
                />
              </GqlMockedProvider>
            </TestRouter>
          </ThemeProvider>
        </LocalizationProvider>
      </SnackbarProvider>,
    );
    await waitFor(() => expect(getByText('Edit Donation')).toBeInTheDocument());
    expect(getByRole('button', { name: 'Save' })).toBeInTheDocument();

    const amountTextbox = getByRole('textbox', {
      name: 'Amount',
    });
    expect(amountTextbox).toHaveValue('100');
    userEvent.type(amountTextbox, '2');
    expect(amountTextbox).toHaveValue('1002');

    const dateButton = getByRole('textbox', {
      name: 'Choose date, selected date is Mar 25, 2021',
    });
    expect(dateButton).toHaveValue('Mar 25, 2021');
    userEvent.click(dateButton);
    userEvent.click(getByRole('gridcell', { name: '27' }));
    expect(dateButton).toHaveValue('Mar 27, 2021');
  });

  it('clicks close button', async () => {
    const mutationSpy = jest.fn();
    const { getByText, getByRole } = render(
      <SnackbarProvider>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={theme}>
            <TestRouter router={router}>
              <GqlMockedProvider<UpdateDonationMutation> onCall={mutationSpy}>
                <EditDonationModal
                  donation={donation}
                  open={true}
                  handleClose={handleClose}
                  startDate={time.toString()}
                  endDate={time.toString()}
                />
              </GqlMockedProvider>
            </TestRouter>
          </ThemeProvider>
        </LocalizationProvider>
      </SnackbarProvider>,
    );

    await waitFor(() => expect(getByText('Edit Donation')).toBeInTheDocument());
    expect(handleClose).not.toHaveBeenCalled();
    userEvent.click(getByRole('button', { name: 'Cancel' }));
    expect(handleClose).toHaveBeenCalled();
  });

  it('opens and closes delete modal', async () => {
    const mutationSpy = jest.fn();
    const { getByText, getByRole, queryByText } = render(
      <SnackbarProvider>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <ThemeProvider theme={theme}>
            <TestRouter router={router}>
              <GqlMockedProvider<UpdateDonationMutation> onCall={mutationSpy}>
                <EditDonationModal
                  donation={donation}
                  open={true}
                  handleClose={handleClose}
                  startDate={time.toString()}
                  endDate={time.toString()}
                />
              </GqlMockedProvider>
            </TestRouter>
          </ThemeProvider>
        </LocalizationProvider>
      </SnackbarProvider>,
    );
    await waitFor(() => expect(getByText('Edit Donation')).toBeInTheDocument());
    expect(
      queryByText('Are you sure you wish to delete this donation?'),
    ).not.toBeInTheDocument();
    userEvent.click(getByRole('button', { name: 'Delete' }));
    expect(
      getByText('Are you sure you wish to delete this donation?'),
    ).toBeInTheDocument();
    userEvent.click(getByRole('button', { name: 'No' }));
    await waitFor(() =>
      expect(
        queryByText('Are you sure you wish to delete this donation?'),
      ).not.toBeInTheDocument(),
    );
  });

  it('clicks the delete confirmation', async () => {
    const mutationSpy = jest.fn();
    const { getByText, getByRole, queryByText, getByTestId, queryByTestId } =
      render(
        <SnackbarProvider>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <ThemeProvider theme={theme}>
              <TestRouter router={router}>
                <GqlMockedProvider<DeleteDonationMutation> onCall={mutationSpy}>
                  <EditDonationModal
                    donation={donation}
                    open={true}
                    handleClose={handleClose}
                    startDate={time.toString()}
                    endDate={time.toString()}
                  />
                </GqlMockedProvider>
              </TestRouter>
            </ThemeProvider>
          </LocalizationProvider>
        </SnackbarProvider>,
      );
    await waitFor(() => expect(getByText('Edit Donation')).toBeInTheDocument());
    expect(
      queryByText('Are you sure you wish to delete this donation?'),
    ).not.toBeInTheDocument();
    userEvent.click(getByRole('button', { name: 'Delete' }));
    expect(
      getByText('Are you sure you wish to delete this donation?'),
    ).toBeInTheDocument();
    expect(queryByTestId('loading-circle')).not.toBeInTheDocument();
    userEvent.click(getByRole('button', { name: 'Yes' }));
    expect(getByTestId('loading-circle')).toBeInTheDocument();
    await waitFor(() => expect(handleClose).toHaveBeenCalled());
    await waitFor(() =>
      expect(mockEnqueue).toHaveBeenCalledWith('Donation deleted!', {
        variant: 'success',
      }),
    );
  });
});
