import { MockedProvider } from '@apollo/client/testing';
import { CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React, { ReactElement } from 'react';

import { GqlMockedProvider } from '../../../../../__tests__/util/graphqlMocking';
import theme from '../../../../theme';

import { ContactTasksTab } from './ContactTasksTab';
import {
  ContactTasksTabDocument,
  ContactTasksTabQuery,
} from './ContactTasksTab.generated';

export default {
  title: 'Contacts/Tab/ContactTasksTab',
  component: ContactTasksTab,
};

const accountListId = 'abc';
const contactId = 'contact-1';

export const Default = (): ReactElement => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GqlMockedProvider<ContactTasksTabQuery>>
        <ContactTasksTab accountListId={accountListId} contactId={contactId} />
      </GqlMockedProvider>
    </MuiThemeProvider>
  );
};

export const Loading = (): ReactElement => {
  return (
    <MockedProvider
      mocks={[
        {
          request: {
            query: ContactTasksTabDocument,
            variables: {
              accountListId: accountListId,
              contactId: contactId,
            },
          },
          result: {},
          delay: 8640000,
        },
      ]}
    >
      <ContactTasksTab accountListId={accountListId} contactId={contactId} />
    </MockedProvider>
  );
};