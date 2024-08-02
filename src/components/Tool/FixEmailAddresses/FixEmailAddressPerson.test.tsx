import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import userEvent from '@testing-library/user-event';
import { ApolloErgonoMockMap } from 'graphql-ergonomock';
import { DateTime } from 'luxon';
import TestWrapper from '__tests__/util/TestWrapper';
import { GqlMockedProvider } from '__tests__/util/graphqlMocking';
import { render, waitFor } from '__tests__/util/testingLibraryReactMock';
import { PersonEmailAddressInput } from 'src/graphql/types.generated';
import theme from '../../../theme';
import { EmailAddressesMutation } from './AddEmailAddress.generated';
import {
  FixEmailAddressPerson,
  FixEmailAddressPersonProps,
} from './FixEmailAddressPerson';
import { EmailAddressData, PersonEmailAddresses } from './FixEmailAddresses';
import { GetInvalidEmailAddressesQuery } from './FixEmailAddresses.generated';
import { mockInvalidEmailAddressesResponse } from './FixEmailAddressesMocks';

const testData = {
  name: 'Test Contact',
  personId: 'testid',
  contactId: 'contactTestId',
  emailAddresses: [
    {
      source: 'DonorHub',
      updatedAt: DateTime.fromISO('2021-06-21').toString(),
      email: 'test1@test1.com',
      primary: true,
      isValid: false,
      personId: 'testid',
    } as EmailAddressData,
    {
      source: 'MPDX',
      updatedAt: DateTime.fromISO('2021-06-22').toString(),
      email: 'test2@test1.com',
      primary: false,
      isValid: false,
      personId: 'testid',
    } as EmailAddressData,
  ],
} as FixEmailAddressPersonProps;

const setContactFocus = jest.fn();
const handleChangeMock = jest.fn();
const handleDeleteModalOpenMock = jest.fn();
const handleChangePrimaryMock = jest.fn();

const TestComponent = ({ mocks }: { mocks: ApolloErgonoMockMap }) => {
  const toDelete = [] as PersonEmailAddressInput[];
  const dataState = {
    id: {
      emailAddresses: testData.emailAddresses as EmailAddressData[],
      toDelete,
    },
  } as { [key: string]: PersonEmailAddresses };

  return (
    <ThemeProvider theme={theme}>
      <TestWrapper>
        <GqlMockedProvider<{
          GetInvalidEmailAddresses: GetInvalidEmailAddressesQuery;
          EmailAddresses: EmailAddressesMutation;
        }>
          mocks={mocks}
        >
          <FixEmailAddressPerson
            toDelete={toDelete}
            name={testData.name}
            key={testData.name}
            personId={testData.personId}
            dataState={dataState}
            contactId={testData.contactId}
            emailAddresses={testData.emailAddresses}
            handleChange={handleChangeMock}
            handleDelete={handleDeleteModalOpenMock}
            handleChangePrimary={handleChangePrimaryMock}
            setContactFocus={setContactFocus}
          />
        </GqlMockedProvider>
      </TestWrapper>
    </ThemeProvider>
  );
};

describe('FixEmailAddressPerson', () => {
  it('default', () => {
    const { getByText, getByTestId, getByDisplayValue } = render(
      <TestComponent
        mocks={{
          GetInvalidEmailAddresses: {
            people: {
              nodes: mockInvalidEmailAddressesResponse,
            },
          },
        }}
      />,
    );

    expect(getByText(testData.name)).toBeInTheDocument();
    expect(getByText('DonorHub (6/21/2021)')).toBeInTheDocument();
    expect(getByTestId('textfield-testid-0')).toBeInTheDocument();
    expect(getByDisplayValue('test1@test1.com')).toBeInTheDocument();
    expect(getByText('MPDX (6/22/2021)')).toBeInTheDocument();
    expect(getByTestId('textfield-testid-1')).toBeInTheDocument();
    expect(getByDisplayValue('test2@test1.com')).toBeInTheDocument();
    expect(getByTestId('starIcon-testid-0')).toBeInTheDocument();
  });

  it('input reset after adding an email address', async () => {
    const { getByTestId, getByLabelText } = render(
      <TestComponent
        mocks={{
          GetInvalidEmailAddresses: {
            people: {
              nodes: mockInvalidEmailAddressesResponse,
            },
          },
        }}
      />,
    );

    const addInput = getByLabelText('New Email Address');
    const addButton = getByTestId('addButton-testid');

    userEvent.type(addInput, 'new@new.com');
    await waitFor(() => {
      expect(addInput).toHaveValue('new@new.com');
    });
    userEvent.click(addButton);
    await waitFor(() => {
      expect(addInput).toHaveValue('');
    });
  });

  describe('validation', () => {
    it('should show an error message if there is no email', async () => {
      const { getByLabelText, getByTestId, getByText } = render(
        <TestComponent
          mocks={{
            GetInvalidEmailAddresses: {
              people: {
                nodes: mockInvalidEmailAddressesResponse,
              },
            },
          }}
        />,
      );

      const addInput = getByLabelText('New Email Address');
      userEvent.click(addInput);
      userEvent.tab();

      const addButton = getByTestId('addButton-testid');
      await waitFor(() => {
        expect(addButton).toBeDisabled();
        expect(getByText('Please enter a valid email address')).toBeVisible();
      });
    });

    it('should show an error message if there is an invalid email', async () => {
      const { getByLabelText, getByTestId, getByText } = render(
        <TestComponent
          mocks={{
            GetInvalidEmailAddresses: {
              people: {
                nodes: mockInvalidEmailAddressesResponse,
              },
            },
          }}
        />,
      );

      const addInput = getByLabelText('New Email Address');
      userEvent.type(addInput, 'ab');
      userEvent.tab();

      const addButton = getByTestId('addButton-testid');
      await waitFor(() => {
        expect(addButton).toBeDisabled();
        expect(getByText('Invalid Email Address Format')).toBeVisible();
      });
    });

    it('should not disable the add button', async () => {
      const { getByLabelText, getByTestId } = render(
        <TestComponent
          mocks={{
            GetInvalidEmailAddresses: {
              people: {
                nodes: mockInvalidEmailAddressesResponse,
              },
            },
          }}
        />,
      );

      const addInput = getByLabelText('New Email Address');
      userEvent.type(addInput, 'new@new.com');
      userEvent.tab();

      const addButton = getByTestId('addButton-testid');
      await waitFor(() => {
        expect(addButton).not.toBeDisabled();
      });
    });
  });
});
