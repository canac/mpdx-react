import React from 'react';
import { render, within } from '@testing-library/react';
import {
  gqlMock,
  GqlMockedProvider,
} from '../../../../__tests__/util/graphqlMocking';
import { ContactRow } from './ContactRow';
import {
  ContactRowFragment,
  ContactRowFragmentDoc,
} from './ContactRow.generated';

const accountListId = 'abc';

it('should display contact name', () => {
  const name = 'Name';
  const contact = gqlMock<ContactRowFragment>(ContactRowFragmentDoc, {
    mocks: { name },
  });
  const { getByRole } = render(
    <GqlMockedProvider>
      <ContactRow
        accountListId={accountListId}
        contact={contact}
        onContactSelected={() => {}}
      />
    </GqlMockedProvider>,
  );
  expect(within(getByRole('row')).getByText(name)).toBeVisible();
});