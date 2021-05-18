import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { Box } from '@material-ui/core';
import { ContactFilters } from '../../../../src/components/Contacts/ContactFilters/ContactFilters';
import { ContactsTable } from '../../../../src/components/Contacts/ContactsTable/ContactsTable';
import { ContactDetails } from '../../../../src/components/Contacts/ContactDetails/ContactDetails';
import Loading from '../../../../src/components/Loading';

const ContactsPage: React.FC = () => {
  const { t } = useTranslation();
  const { query, push, isReady } = useRouter();

  const [contactDetailsId, setContactDetailsId] = useState<string>();

  const { accountListId, contactId } = query;

  if (Array.isArray(accountListId)) {
    throw new Error('accountListId should not be an array');
  }
  if (contactId !== undefined && !Array.isArray(contactId)) {
    throw new Error('contactId should be an array or undefined');
  }

  useEffect(() => {
    if (isReady) {
      setContactDetailsId(contactId ? contactId[0] : undefined);
    }
  }, [isReady, query]);

  //TODO: Connect these to ContactFilters, and use actual filter data for activeFilters
  const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(true);
  const [activeFilters] = useState<boolean>(true);

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  const setContactFocus = (id?: string) => {
    const { contactId: _, ...queryWithoutContactId } = query;
    push(
      id
        ? {
            pathname: '/accountLists/[accountListId]/contacts/[contactId]',
            query: { ...queryWithoutContactId, contactId: id },
          }
        : {
            pathname: '/accountLists/[accountListId]/contacts/',
            query: queryWithoutContactId,
          },
    );
    setContactDetailsId(id);
  };

  return (
    <>
      <Head>
        <title>MPDX | {t('Contacts')}</title>
      </Head>
      {isReady && accountListId ? (
        <Box height="100vh" display="flex" overflow-y="scroll">
          <ContactFilters accountListId={accountListId} width="290px" />
          <Box flex={1}>
            <ContactsTable
              accountListId={accountListId}
              onContactSelected={setContactFocus}
              activeFilters={activeFilters}
              filterPanelOpen={filterPanelOpen}
              toggleFilterPanel={toggleFilterPanel}
            />
          </Box>
          {contactDetailsId ? (
            <Box flex={1}>
              <ContactDetails
                accountListId={accountListId}
                contactId={contactDetailsId}
                onClose={() => setContactFocus(undefined)}
              />
            </Box>
          ) : null}
        </Box>
      ) : (
        <Loading loading />
      )}
    </>
  );
};

export default ContactsPage;