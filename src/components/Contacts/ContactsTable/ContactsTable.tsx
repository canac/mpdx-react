import React, { useState } from 'react';
import {
  Box,
  Table,
  colors,
  TableHead,
  TableBody,
  TableContainer,
} from '@material-ui/core';
import { ContactRow } from '../ContactRow/ContactRow';
import { ContactsHeader } from '../ContactsHeader/ContactsHeader';
import { useContactsQuery } from '../../../../pages/accountLists/[accountListId]/contacts/Contacts.generated';

interface Props {
  accountListId: string;
  onContactSelected: (contactId: string) => void;
  onSearchTermChange: (searchTerm?: string) => void;
  activeFilters: boolean;
  filterPanelOpen: boolean;
  toggleFilterPanel: () => void;
}

export const ContactsTable: React.FC<Props> = ({
  accountListId,
  onContactSelected,
  onSearchTermChange,
  activeFilters,
  filterPanelOpen,
  toggleFilterPanel,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>();

  const { data, loading, error } = useContactsQuery({
    variables: { accountListId, searchTerm },
  });

  const renderLoading = () => (
    <Box
      height="100%"
      alignItems="center"
      justifyContent="center"
      bgcolor={colors.green[600]}
    >
      Loading
    </Box>
  );

  const renderEmpty = () => (
    <Box height="100%" bgcolor={colors.yellow[600]}>
      No Data
    </Box>
  );

  const renderError = () => (
    <Box bgcolor={colors.red[600]}>Error: {error?.toString()}</Box>
  );

  const handleOnContactSelected = (id: string) => {
    onContactSelected(id);
  };

  const handleSetSearchTerm = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    onSearchTermChange(searchTerm);
  };

  return (
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <ContactsHeader
            activeFilters={activeFilters}
            filterPanelOpen={filterPanelOpen}
            toggleFilterPanel={toggleFilterPanel}
            onSearchTermChanged={handleSetSearchTerm}
            totalContacts={data?.contacts.nodes.length}
          />
        </TableHead>
        <TableBody>
          {error && renderError()}
          {loading ? (
            renderLoading()
          ) : !(data && data.contacts.nodes.length > 0) ? (
            renderEmpty()
          ) : (
            <div data-testid="ContactRows">
              {data.contacts.nodes?.map((contact) => (
                <ContactRow
                  accountListId={accountListId}
                  key={contact.id}
                  contact={contact}
                  onContactSelected={handleOnContactSelected}
                />
              ))}
            </div>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
