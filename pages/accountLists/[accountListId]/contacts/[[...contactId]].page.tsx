import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { Box, styled } from '@material-ui/core';
import NullState from '../../../../src/components/Shared/Filters/NullState/NullState';
import { ContactFilters } from '../../../../src/components/Contacts/ContactFilters/ContactFilters';
import { InfiniteList } from '../../../../src/components/InfiniteList/InfiniteList';
import { ContactDetails } from '../../../../src/components/Contacts/ContactDetails/ContactDetails';
import Loading from '../../../../src/components/Loading';
import { SidePanelsLayout } from '../../../../src/components/Layouts/SidePanelsLayout';
import { useAccountListId } from '../../../../src/hooks/useAccountListId';
import { ContactFilterSetInput } from '../../../../graphql/types.generated';
import {
  ContactCheckBoxState,
  ContactsHeader,
} from '../../../../src/components/Contacts/ContactsHeader/ContactsHeader';
import { ContactRow } from '../../../../src/components/Contacts/ContactRow/ContactRow';
import { useContactsQuery } from './Contacts.generated';

const WhiteBackground = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
}));

const ContactsPage: React.FC = () => {
  const { t } = useTranslation();
  const accountListId = useAccountListId();
  const { query, push, replace, isReady, pathname } = useRouter();

  const [contactDetailsOpen, setContactDetailsOpen] = useState(false);
  const [contactDetailsId, setContactDetailsId] = useState<string>();

  const { contactId, searchTerm } = query;

  if (contactId !== undefined && !Array.isArray(contactId)) {
    throw new Error('contactId should be an array or undefined');
  }

  if (searchTerm !== undefined && !Array.isArray(searchTerm)) {
    throw new Error('searchTerm should be an array or undefined');
  }

  useEffect(() => {
    if (isReady && contactId) {
      setContactDetailsId(contactId[0]);
      setContactDetailsOpen(true);
    }
  }, [isReady, contactId]);

  const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<ContactFilterSetInput>({});
  const [selectedContacts, setSelectedContacts] = useState<Array<string>>([]);

  const { data, loading, fetchMore } = useContactsQuery({
    variables: {
      accountListId: accountListId ?? '',
      contactsFilters: { ...activeFilters, wildcardSearch: searchTerm?.[0] },
    },
    skip: !accountListId,
  });

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
    id && setContactDetailsId(id);
    setContactDetailsOpen(!!id);
  };

  const handleCheckOneContact = (
    event: React.ChangeEvent<HTMLInputElement>,
    contactId: string,
  ): void => {
    if (!selectedContacts.includes(contactId)) {
      setSelectedContacts((prevSelected) => [...prevSelected, contactId]);
    } else {
      setSelectedContacts((prevSelected) =>
        prevSelected.filter((id) => id !== contactId),
      );
    }
  };

  const handleCheckAllContacts = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setSelectedContacts(
      event.target.checked
        ? data?.contacts.nodes.map((contact) => contact.id) ?? []
        : [],
    );
  };

  const isSelectedSomeContacts =
    selectedContacts.length > 0 &&
    selectedContacts.length < (data?.contacts.nodes.length ?? 0);
  const isSelectedAllContacts =
    selectedContacts.length === data?.contacts.nodes.length;

  const setSearchTerm = (searchTerm?: string) => {
    const { searchTerm: _, ...oldQuery } = query;
    replace({
      pathname,
      query: {
        ...oldQuery,
        ...(searchTerm && { searchTerm }),
      },
    });
  };

  return (
    <>
      <Head>
        <title>MPDX | {t('Contacts')}</title>
      </Head>
      {accountListId ? (
        <WhiteBackground>
          <SidePanelsLayout
            leftPanel={
              <ContactFilters
                accountListId={accountListId}
                onClose={toggleFilterPanel}
                onSelectedFiltersChanged={setActiveFilters}
              />
            }
            leftOpen={filterPanelOpen}
            leftWidth="290px"
            mainContent={
              <>
                <ContactsHeader
                  activeFilters={Object.keys(activeFilters).length > 0}
                  filterPanelOpen={filterPanelOpen}
                  toggleFilterPanel={toggleFilterPanel}
                  onCheckAllContacts={handleCheckAllContacts}
                  onSearchTermChanged={setSearchTerm}
                  totalContacts={data?.contacts.totalCount}
                  contactCheckboxState={
                    isSelectedSomeContacts
                      ? ContactCheckBoxState.partial
                      : isSelectedAllContacts
                      ? ContactCheckBoxState.checked
                      : ContactCheckBoxState.unchecked
                  }
                />
                <InfiniteList
                  loading={loading}
                  data={data?.contacts.nodes}
                  totalCount={data?.contacts.totalCount}
                  style={{ height: 'calc(100vh - 160px)' }}
                  itemContent={(index, contact) => (
                    <ContactRow
                      accountListId={accountListId}
                      key={index}
                      contact={contact}
                      isChecked={selectedContacts.includes(contact.id)}
                      onContactSelected={setContactFocus}
                      onContactCheckToggle={handleCheckOneContact}
                    />
                  )}
                  endReached={() =>
                    data?.contacts.pageInfo.hasNextPage &&
                    fetchMore({
                      variables: { after: data.contacts.pageInfo.endCursor },
                    })
                  }
                  EmptyPlaceholder={
                    <NullState
                      page="contact"
                      totalCount={data?.contacts.totalCount || 0}
                      filtered={
                        Object.keys(activeFilters).length > 0 ||
                        Object.values(activeFilters).filter(
                          (filter) => filter !== [],
                        ).length > 0
                      }
                    />
                  }
                />
              </>
            }
            rightPanel={
              contactDetailsId ? (
                <ContactDetails
                  accountListId={accountListId}
                  contactId={contactDetailsId}
                  onClose={() => setContactFocus(undefined)}
                />
              ) : (
                <></>
              )
            }
            rightOpen={contactDetailsOpen}
            rightWidth="45%"
          />
        </WhiteBackground>
      ) : (
        <Loading loading />
      )}
    </>
  );
};

export default ContactsPage;
