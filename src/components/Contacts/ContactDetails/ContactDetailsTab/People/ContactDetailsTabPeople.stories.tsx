import { Box } from '@material-ui/core';
import React, { ReactElement } from 'react';
import { gqlMock } from '../../../../../../__tests__/util/graphqlMocking';
import { ContactDetailsTabPeople } from './ContactDetailsTabPeople';
import {
  ContactPeopleFragment,
  ContactPeopleFragmentDoc,
} from './ContactPeople.generated';

export default {
  title: 'Contacts/Tab/ContactDetailsTab/People',
  component: ContactDetailsTabPeople,
};

export const Default = (): ReactElement => {
  const mock = gqlMock<ContactPeopleFragment>(ContactPeopleFragmentDoc);
  return (
    <Box m={2}>
      <ContactDetailsTabPeople data={mock} />
    </Box>
  );
};