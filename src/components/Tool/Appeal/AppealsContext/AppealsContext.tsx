import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { debounce, omit } from 'lodash';
import { useContactFiltersQuery } from 'pages/accountLists/[accountListId]/contacts/Contacts.generated';
import { PageEnum } from 'pages/accountLists/[accountListId]/tools/appeals/AppealsWrapper';
import { useUpdateUserOptionsMutation } from 'src/components/Contacts/ContactFlow/ContactFlowSetup/UpdateUserOptions.generated';
import { useGetUserOptionsQuery } from 'src/components/Contacts/ContactFlow/GetUserOptions.generated';
import {
  ContactsContextSavedFilters as AppealsContextSavedFilters,
  ContactsContextProps,
  ContactsType,
} from 'src/components/Contacts/ContactsContext/ContactsContext';
import { UserOptionFragment } from 'src/components/Shared/Filters/FilterPanel.generated';
import { useGetIdsForMassSelectionQuery } from 'src/hooks/GetIdsForMassSelection.generated';
import { useAccountListId } from 'src/hooks/useAccountListId';
import { useMassSelection } from 'src/hooks/useMassSelection';
import { sanitizeFilters } from 'src/lib/sanitizeFilters';
import { useContactsQuery } from './contacts.generated';
import { useContactsCountQuery } from './contactsCount.generated';

export enum AppealStatusEnum {
  Excluded = 'excluded',
  Asked = 'asked',
  NotReceived = 'not_received',
  ReceivedNotProcessed = 'received_not_processed',
  Processed = 'processed',
}

export enum TableViewModeEnum {
  List = 'list',
  Flows = 'flows',
}

export const shouldSkipContactCount = (
  filterPanelOpen: boolean,
  viewMode: TableViewModeEnum,
) => {
  if (viewMode === TableViewModeEnum.Flows) {
    return true;
  } else if (viewMode === TableViewModeEnum.List && !filterPanelOpen) {
    return false;
  } else {
    return false;
  }
};

export interface AppealsType
  extends Omit<
    ContactsType,
    | 'selected'
    | 'setSelected'
    | 'mapRef'
    | 'panTo'
    | 'mapData'
    | 'contactsQueryResult'
    | 'setContactFocus'
    | 'setViewMode'
  > {
  setViewMode: (mode: TableViewModeEnum) => void;
  setContactFocus: (id?: string | undefined, openDetails?: boolean) => void;
  contactsQueryResult: ReturnType<typeof useContactsQuery>;
  appealId: string | undefined;
  page: PageEnum | undefined;
  askedCountQueryResult: ReturnType<typeof useContactsCountQuery>;
  excludedCountQueryResult: ReturnType<typeof useContactsCountQuery>;
  committedCountQueryResult: ReturnType<typeof useContactsCountQuery>;
  givenCountQueryResult: ReturnType<typeof useContactsCountQuery>;
  receivedCountQueryResult: ReturnType<typeof useContactsCountQuery>;
}

export const AppealsContext = React.createContext<AppealsType | null>(null);

interface AppealsContextProps extends ContactsContextProps {
  appealId: string | undefined;
  page?: PageEnum;
}

export const AppealsProvider: React.FC<AppealsContextProps> = ({
  children,
  urlFilters,
  activeFilters,
  setActiveFilters,
  starredFilter,
  setStarredFilter,
  filterPanelOpen,
  setFilterPanelOpen,
  appealId,
  contactId,
  searchTerm,
  page,
}) => {
  const accountListId = useAccountListId() ?? '';
  const router = useRouter();
  const { query, push, replace, isReady, pathname } = router;

  const [contactDetailsOpen, setContactDetailsOpen] = useState(false);
  const [contactDetailsId, setContactDetailsId] = useState<string>();
  const [viewMode, setViewMode] = useState<TableViewModeEnum>(
    TableViewModeEnum.Flows,
  );

  const sanitizedFilters = useMemo(
    () => sanitizeFilters(activeFilters),
    [activeFilters],
  );

  if (contactId !== undefined && !Array.isArray(contactId)) {
    throw new Error('contactId should be an array or undefined');
  }

  //User options for display view
  const { loading: userOptionsLoading } = useGetUserOptionsQuery({
    onCompleted: ({ userOptions }) => {
      if (contactId?.includes('list')) {
        setViewMode(TableViewModeEnum.List);
        setFilterPanelOpen(true);
        setActiveFilters({
          appealStatus: AppealStatusEnum.Asked,
        });
      } else {
        const defaultView =
          (userOptions.find((option) => option.key === 'contacts_view')
            ?.value as TableViewModeEnum) || TableViewModeEnum.Flows;
        setViewMode(defaultView);

        if (defaultView === TableViewModeEnum.List) {
          setFilterPanelOpen(true);
          setActiveFilters({
            appealStatus: AppealStatusEnum.Asked,
          });
        }
      }
    },
  });

  const contactsFilters = useMemo(
    () => ({
      ...sanitizedFilters,
      ...starredFilter,
      wildcardSearch: searchTerm as string,
      ids: [],
      appeal: [appealId || ''],
    }),
    [sanitizedFilters, starredFilter, searchTerm, appealId],
  );

  const contactsQueryResult = useContactsQuery({
    variables: {
      accountListId: accountListId ?? '',
      contactsFilters,
      first: 25,
    },
    skip: !accountListId,
  });
  const { data, loading } = contactsQueryResult;

  //#region Mass Actions

  const contactCount = data?.contacts.totalCount ?? 0;
  const { data: allContacts } = useGetIdsForMassSelectionQuery({
    variables: {
      accountListId,
      first: contactCount,
      contactsFilters,
    },
    skip: contactCount === 0,
  });
  const allContactIds = useMemo(
    () => allContacts?.contacts.nodes.map((contact) => contact.id) ?? [],
    [allContacts],
  );

  const {
    ids,
    selectionType,
    isRowChecked,
    toggleSelectAll,
    toggleSelectionById,
    deselectAll,
  } = useMassSelection(
    contactCount,
    allContactIds,
    activeFilters,
    searchTerm as string,
    starredFilter,
  );
  //#endregion

  useEffect(() => {
    if (isReady && contactId) {
      if (
        contactId[contactId.length - 1] !== 'flows' &&
        contactId[contactId.length - 1] !== 'list'
      ) {
        setContactDetailsId(contactId[contactId.length - 1]);
        setContactDetailsOpen(true);
      }
    } else if (isReady && !contactId) {
      setContactDetailsId('');
      setContactDetailsOpen(false);
    }
  }, [isReady, contactId]);

  useEffect(() => {
    if (userOptionsLoading) {
      return;
    }

    setContactFocus(
      contactId &&
        contactId[contactId.length - 1] !== 'flows' &&
        contactId[contactId.length - 1] !== 'list'
        ? contactId[contactId.length - 1]
        : undefined,
      contactId ? true : false,
    );
  }, [loading, viewMode]);

  const { data: filterData, loading: filtersLoading } = useContactFiltersQuery({
    variables: { accountListId: accountListId ?? '' },
    skip: !accountListId,
    context: {
      doNotBatch: true,
    },
  });

  const nameSearch = searchTerm ? { wildcardSearch: searchTerm as string } : {};
  const defaultFilters = {
    appeal: [appealId || ''],
    ...nameSearch,
  };
  const skip = shouldSkipContactCount(filterPanelOpen, viewMode);

  const askedCountQueryResult = useContactsCountQuery({
    variables: {
      accountListId: accountListId || '',
      contactsFilter: {
        ...defaultFilters,
        appealStatus: AppealStatusEnum.Asked,
      },
    },
    skip,
  });

  const excludedCountQueryResult = useContactsCountQuery({
    variables: {
      accountListId: accountListId || '',
      contactsFilter: {
        ...defaultFilters,
        appealStatus: AppealStatusEnum.Excluded,
      },
    },
    skip,
  });

  const committedCountQueryResult = useContactsCountQuery({
    variables: {
      accountListId: accountListId || '',
      contactsFilter: {
        ...defaultFilters,
        appealStatus: AppealStatusEnum.NotReceived,
      },
    },
    skip,
  });

  const givenCountQueryResult = useContactsCountQuery({
    variables: {
      accountListId: accountListId || '',
      contactsFilter: {
        ...defaultFilters,
        appealStatus: AppealStatusEnum.Processed,
      },
    },
    skip,
  });

  const receivedCountQueryResult = useContactsCountQuery({
    variables: {
      accountListId: accountListId || '',
      contactsFilter: {
        ...defaultFilters,
        appealStatus: AppealStatusEnum.ReceivedNotProcessed,
      },
    },
    skip,
  });

  const toggleFilterPanel = () => {
    setFilterPanelOpen(!filterPanelOpen);
  };

  const handleClearAll = () => {
    setSearchTerm('');
  };

  const savedFilters: UserOptionFragment[] = AppealsContextSavedFilters(
    filterData,
    accountListId,
  );

  const isFiltered =
    Object.keys(urlFilters ?? {}).length > 0 ||
    Object.values(urlFilters ?? {}).some(
      (filter) => filter !== ([] as Array<string>),
    );
  //#endregion

  //#region User Actions
  const setContactFocus = (id?: string, openDetails = true) => {
    const {
      accountListId: _accountListId,
      contactId: _contactId,
      appealId: _appealId,
      ...filteredQuery
    } = query;
    if (urlFilters && urlFilters.ids) {
      const newFilters = omit(activeFilters, 'ids');
      if (Object.keys(newFilters).length > 0) {
        filteredQuery.filters = encodeURI(JSON.stringify(newFilters));
      } else {
        delete filteredQuery['filters'];
      }
    }

    let pathname = '';
    pathname = `/accountLists/${accountListId}/tools/appeals/appeal`;
    if (appealId) {
      pathname += `/${appealId}`;
    }
    if (viewMode === TableViewModeEnum.Flows) {
      pathname += '/flows';
    } else if (viewMode === TableViewModeEnum.List) {
      pathname += '/list';
    }
    if (id) {
      pathname += `/${id}`;
    }

    push({
      pathname,
      query: filteredQuery,
    });
    if (openDetails) {
      id && setContactDetailsId(id);
      setContactDetailsOpen(!!id);
    }
  };
  const setSearchTerm = useCallback(
    debounce((searchTerm: string) => {
      const { searchTerm: _, ...oldQuery } = query;
      if (searchTerm !== '') {
        replace(
          {
            pathname,
            query: {
              ...oldQuery,
              accountListId,
              ...(searchTerm && { searchTerm }),
            },
          },
          undefined,
          { shallow: true },
        );
      } else {
        replace(
          {
            pathname,
            query: {
              ...oldQuery,
              accountListId,
            },
          },
          undefined,
          { shallow: true },
        );
      }
    }, 500),
    [accountListId],
  );

  const handleViewModeChange = (_, view: string) => {
    setViewMode(view as TableViewModeEnum);
    updateOptions(view);
    setActiveFilters({});
    if (view === TableViewModeEnum.List) {
      setFilterPanelOpen(true);
      setActiveFilters({
        appealStatus: AppealStatusEnum.Asked,
      });
    }
  };
  //#endregion

  //#region JSX

  const [updateUserOptions] = useUpdateUserOptionsMutation();

  const updateOptions = async (view: string): Promise<void> => {
    await updateUserOptions({
      variables: {
        key: 'contacts_view',
        value: view,
      },
    });
  };

  return (
    <AppealsContext.Provider
      value={{
        accountListId: accountListId ?? '',
        contactId: contactId,
        searchTerm: searchTerm,
        contactsQueryResult: contactsQueryResult,
        selectionType: selectionType,
        isRowChecked: isRowChecked,
        toggleSelectAll: toggleSelectAll,
        toggleSelectionById: toggleSelectionById,
        filterData: filterData,
        filtersLoading: filtersLoading,
        toggleFilterPanel: toggleFilterPanel,
        handleClearAll: handleClearAll,
        savedFilters: savedFilters,
        setContactFocus: setContactFocus,
        setSearchTerm: setSearchTerm,
        handleViewModeChange: handleViewModeChange,
        activeFilters: activeFilters,
        sanitizedFilters,
        setActiveFilters: setActiveFilters,
        starredFilter: starredFilter,
        setStarredFilter: setStarredFilter,
        filterPanelOpen: filterPanelOpen,
        setFilterPanelOpen: setFilterPanelOpen,
        contactDetailsOpen: contactDetailsOpen,
        setContactDetailsOpen: setContactDetailsOpen,
        contactDetailsId: contactDetailsId,
        setContactDetailsId: setContactDetailsId,
        viewMode: viewMode,
        setViewMode: setViewMode,
        urlFilters: urlFilters,
        isFiltered: isFiltered,
        selectedIds: ids,
        deselectAll: deselectAll,
        userOptionsLoading: userOptionsLoading,
        appealId,
        page,
        askedCountQueryResult,
        excludedCountQueryResult,
        committedCountQueryResult,
        givenCountQueryResult,
        receivedCountQueryResult,
      }}
    >
      {children}
    </AppealsContext.Provider>
  );
};