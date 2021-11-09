import { Box, Typography } from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React from 'react';
import { useDrop } from 'react-dnd';
import { useTranslation } from 'react-i18next';
import theme from '../../../../../src/theme';
import { ContactsDocument } from '../../../../../pages/accountLists/[accountListId]/contacts/Contacts.generated';
import { IdValue, StatusEnum } from '../../../../../graphql/types.generated';
import { useUpdateContactOtherMutation } from '../../ContactDetails/ContactDetailsTab/Other/EditContactOtherModal/EditContactOther.generated';
import { DraggedContact } from '../ContactFlowRow/ContactFlowRow';

interface Props {
  status: {
    __typename?: 'IdValue' | undefined;
  } & Pick<IdValue, 'id' | 'value'>;
  accountListId: string;
}

export const ContactFlowDropZone: React.FC<Props> = ({
  status,
  accountListId,
}: Props) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'contact',
    canDrop: (contact) => String(contact.status.id) !== String(status.id),
    drop: (contact: DraggedContact) => {
      String(contact.status.id) !== String(status.id)
        ? changeContactStatus(contact.id)
        : null;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }));
  const [updateContactOther] = useUpdateContactOtherMutation();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const changeContactStatus = async (id: string): Promise<void> => {
    const attributes = {
      id,
      status: (status.id as unknown) as StatusEnum,
    };
    await updateContactOther({
      variables: {
        accountListId,
        attributes,
      },
      refetchQueries: [
        { query: ContactsDocument, variables: { accountListId } },
      ],
    });
    enqueueSnackbar(t('Contact status info updated!'), {
      variant: 'success',
    });
  };

  return (
    <Box
      key={status.id}
      {...{ ref: drop }}
      display="flex"
      style={{
        border: canDrop
          ? `3px dashed ${theme.palette.mpdxBlue.main}`
          : `3px solid ${theme.palette.cruGrayMedium.main}`,
        height: '100%',
        width: '100%',
        backgroundColor: canDrop
          ? isOver
            ? theme.palette.mpdxYellow.main
            : theme.palette.common.white
          : theme.palette.cruGrayLight.main,
      }}
      justifyContent="center"
      alignItems="center"
    >
      <Typography variant="h5">{status.value}</Typography>
    </Box>
  );
};
