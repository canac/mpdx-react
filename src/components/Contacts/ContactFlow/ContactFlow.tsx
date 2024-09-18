import React, { useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { ContactsDocument } from 'pages/accountLists/[accountListId]/contacts/Contacts.generated';
import { PhaseEnum } from 'pages/api/graphql-rest.page.generated';
import { TaskModalEnum } from 'src/components/Task/Modal/TaskModal';
import {
  ContactFilterSetInput,
  ContactFilterStatusEnum,
  IdValue,
  StatusEnum,
  TaskSortEnum,
} from 'src/graphql/types.generated';
import { useContactPartnershipStatuses } from 'src/hooks/useContactPartnershipStatuses';
import useTaskModal from 'src/hooks/useTaskModal';
import { getActivitiesByPhaseType } from 'src/utils/phases/taskActivityTypes';
import theme from '../../../theme';
import Loading from '../../Loading';
import { useUpdateContactOtherMutation } from '../ContactDetails/ContactDetailsTab/Other/EditContactOtherModal/EditContactOther.generated';
import { useHasActiveTaskLazyQuery } from './ContactFlow.generated';
import { ContactFlowColumn } from './ContactFlowColumn/ContactFlowColumn';
import { ContactFlowDragLayer } from './ContactFlowDragLayer/ContactFlowDragLayer';
import { useGetUserOptionsQuery } from './GetUserOptions.generated';
import { getDefaultFlowOptions } from './contactFlowDefaultOptions';

interface Props {
  accountListId: string;
  selectedFilters: ContactFilterSetInput;
  searchTerm?: string | string[];
  onContactSelected: (
    contactId: string,
    openDetails: boolean,
    flows: boolean,
  ) => void;
}

export interface ContactFlowOption {
  id: string;
  name: string;
  statuses: string[];
  color: string;
}

export const colorMap: { [key: string]: string } = {
  'color-danger': theme.palette.error.main,
  'color-warning': theme.palette.progressBarYellow.main,
  'color-success': theme.palette.success.main,
  'color-info': theme.palette.mpdxBlue.main,
  'color-text': theme.palette.cruGrayDark.main,
};

export const ContactFlow: React.FC<Props> = ({
  accountListId,
  selectedFilters,
  onContactSelected,
  searchTerm,
}: Props) => {
  const { data: userOptions, loading: loadingUserOptions } =
    useGetUserOptionsQuery({});

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { openTaskModal } = useTaskModal();
  const { statusMap, contactStatuses } = useContactPartnershipStatuses();

  const userFlowOptions: ContactFlowOption[] = JSON.parse(
    userOptions?.userOptions.find((option) => option.key === 'flows')?.value ||
      '[]',
  );

  const flowOptions = useMemo(() => {
    if (loadingUserOptions) {
      return [];
    }
    if (userFlowOptions.length) {
      return userFlowOptions;
    }

    return getDefaultFlowOptions(t, contactStatuses);
  }, [userFlowOptions, loadingUserOptions]);

  const [updateContactOther] = useUpdateContactOtherMutation();
  const [hasActiveTask] = useHasActiveTaskLazyQuery();

  const changeContactStatus = async (
    id: string,
    status: {
      __typename?: 'IdValue' | undefined;
    } & Pick<IdValue, 'id' | 'value'>,
    contactPhase?: PhaseEnum | null,
  ): Promise<void> => {
    const attributes = {
      id,
      status: status.id as StatusEnum,
    };
    let newContactPhase;
    await updateContactOther({
      variables: {
        accountListId,
        attributes,
      },
      update: (_, { data }) => {
        newContactPhase = data?.updateContact?.contact.contactPhase;
      },
      refetchQueries: () =>
        flowOptions.map((flowOption) => ({
          query: ContactsDocument,
          variables: {
            accountListId,
            contactsFilters: {
              status: flowOption.statuses.map(
                (status) => statusMap[status] as ContactFilterStatusEnum,
              ),
              ...selectedFilters,
            },
          },
        })),
    });
    enqueueSnackbar(t('Contact status updated!'), {
      variant: 'success',
    });

    switch (contactPhase) {
      case PhaseEnum.Initiation:
      case PhaseEnum.Appointment:
      case PhaseEnum.FollowUp:
      case PhaseEnum.PartnerCare:
        await hasActiveTask({
          variables: {
            accountListId,
            sortBy: TaskSortEnum.StartAtAsc,
            first: 1,
            tasksFilter: {
              completed: false,
              contactIds: [id],
              activityType: contactPhase
                ? getActivitiesByPhaseType(contactPhase)
                : [],
            },
          },
          onCompleted(data) {
            const taskId = data.tasks.nodes[0]?.id || undefined;
            if (taskId) {
              openTaskModal({
                view: TaskModalEnum.Complete,
                taskId,
                showFlowsMessage: true,
              });
            } else {
              if (
                newContactPhase &&
                newContactPhase !== PhaseEnum.Connection &&
                newContactPhase !== PhaseEnum.Archive
              ) {
                openTaskModal({
                  view: TaskModalEnum.Log,
                  showFlowsMessage: true,
                  defaultValues: {
                    taskPhase: newContactPhase,
                    contactIds: [id],
                  },
                });
              }
            }
          },
        });
        break;

      case PhaseEnum.Connection:
        if (
          newContactPhase &&
          newContactPhase !== PhaseEnum.Connection &&
          newContactPhase !== PhaseEnum.Archive
        ) {
          openTaskModal({
            view: TaskModalEnum.Add,
            showFlowsMessage: true,
            defaultValues: {
              taskPhase: newContactPhase,
              contactIds: [id],
            },
          });
        }
        break;

      default:
        break;
    }
  };

  const ref = useRef<HTMLElement | null>(null);

  return loadingUserOptions ? (
    <Loading loading={loadingUserOptions} />
  ) : (
    flowOptions && (
      <DndProvider backend={HTML5Backend}>
        <ContactFlowDragLayer containerRef={ref} />
        <Box
          display="grid"
          minWidth="100%"
          gridTemplateColumns={`repeat(${flowOptions.length}, minmax(300px, 1fr)); minmax(300px, 1fr)`}
          gridAutoFlow="column"
          gap={theme.spacing(1)}
          overflow="auto"
          style={{ overflowX: 'auto' }}
          gridAutoColumns="300px"
          data-testid="contactsFlow"
          ref={ref}
        >
          {flowOptions.map((column) => (
            <Box
              width={'100%'}
              minWidth={300}
              p={2}
              key={column.name}
              data-testid={`contactsFlow${column.name}`}
            >
              <ContactFlowColumn
                accountListId={accountListId}
                title={column.name}
                selectedFilters={selectedFilters}
                color={colorMap[column.color]}
                onContactSelected={onContactSelected}
                statuses={column.statuses.map(
                  (status) => statusMap[status] as ContactFilterStatusEnum,
                )}
                changeContactStatus={changeContactStatus}
                searchTerm={searchTerm}
              />
            </Box>
          ))}
        </Box>
      </DndProvider>
    )
  );
};
