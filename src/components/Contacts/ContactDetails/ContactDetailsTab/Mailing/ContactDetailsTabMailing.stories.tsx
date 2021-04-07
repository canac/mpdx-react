import { Box, CssBaseline, MuiThemeProvider } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { gqlMock } from '../../../../../../__tests__/util/graphqlMocking';
import theme from '../../../../../theme';
import {
  ContactDetailsTabDocument,
  ContactDetailsTabQuery,
  ContactDetailsTabQueryVariables,
} from '../ContactDetailsTab.generated';
import { ContactDetailsTabMailing } from './ContactDetailsTabMailing';

export default {
  title: 'Contacts/Tab/ContactDetailsTab/Mailing',
};

export const Default = (): ReactElement => {
  const mock = gqlMock<ContactDetailsTabQuery, ContactDetailsTabQueryVariables>(
    ContactDetailsTabDocument,
    { variables: { accountListId: '111', contactId: '222' } },
  );
  return (
    <Box m={2}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <ContactDetailsTabMailing data={mock} />
      </MuiThemeProvider>
    </Box>
  );
};
