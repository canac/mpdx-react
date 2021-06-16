import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  DialogContentText,
  Divider,
  styled,
  Typography,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import { Skeleton } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import {
  ContactsDocument,
  ContactsQuery,
} from '../../../../../pages/accountLists/[accountListId]/contacts/Contacts.generated';
import Modal from '../../../common/Modal/Modal';
import {
  useContactDetailsTabQuery,
  useDeleteContactMutation,
} from './ContactDetailsTab.generated';
import { ContactDetailsTabMailing } from './Mailing/ContactDetailsTabMailing';
import { ContactDetailsOther } from './Other/ContactDetailsOther';
import { ContactDetailsTabPeople } from './People/ContactDetailsTabPeople';
import { ContactTags } from './Tags/ContactTags';

const ContactDetailsTabContainer = styled(Box)(() => ({
  width: '100%',
  padding: '0 5%',
}));

const ContactDetailSectionContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(0),
  paddingTop: '4px',
  margin: 0,
  alignContent: 'start',
}));

const ContactDetailHeadingContainer = styled(Box)(() => ({
  display: 'flex',
  alignContent: 'center',
}));

const ContactDetailHeadingIcon = styled(CreateIcon)(({ theme }) => ({
  width: '18px',
  height: '18px',
  margin: theme.spacing(0),
  color: theme.palette.cruGrayMedium.main,
}));

const ContactDeleteButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(5, 'auto'),
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const DialogDeleteButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const ContactDetailHeadingText = styled(Typography)(() => ({
  flexGrow: 5,
}));

const ContactDetailLoadingPlaceHolder = styled(Skeleton)(({ theme }) => ({
  width: '100%',
  height: '24px',
  margin: theme.spacing(2, 0),
}));

const LoadingIndicator = styled(CircularProgress)(({ theme }) => ({
  margin: theme.spacing(0, 1, 0, 0),
}));

interface ContactDetailTabProps {
  accountListId: string;
  contactId: string;
}

export const ContactDetailsTab: React.FC<ContactDetailTabProps> = ({
  accountListId,
  contactId,
}) => {
  const { data, loading } = useContactDetailsTabQuery({
    variables: { accountListId, contactId },
  });

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { push, query } = useRouter();
  const [deleteContact, { loading: deleting }] = useDeleteContactMutation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { contactId: _, searchTerm, ...queryWithoutContactId } = query;

  const handleDeleteContact = () => {
    try {
      deleteContact({
        variables: {
          accountListId,
          contactId,
        },
        update: (cache, { data: deletedContactData }) => {
          const deletedContactId = deletedContactData?.deleteContact?.id;
          const query = {
            query: ContactsDocument,
            variables: {
              accountListId,
              searchTerm,
            },
          };

          const dataFromCache = cache.readQuery<ContactsQuery>(query);

          if (dataFromCache) {
            const data = {
              ...dataFromCache,
              contacts: {
                ...dataFromCache.contacts,
                nodes: dataFromCache.contacts.nodes.filter(
                  (contact) => contact.id !== deletedContactId,
                ),
              },
            };
            cache.writeQuery({ ...query, data });

            push({
              pathname: '/accountLists/[accountListId]/contacts',
              query: { searchTerm, ...queryWithoutContactId },
            });
            enqueueSnackbar(t('Contact successfully deleted'), {
              variant: 'success',
            });
          }
        },
      });
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      throw error;
    }
  };

  const renderDeleteContactDialog = () => {
    return (
      <Modal
        isOpen={deleteDialogOpen}
        title={t('Delete Contact')}
        content={
          <DialogContentText>
            {t(
              'Are you sure you want to permanently delete this contact? Doing so will permanently delete this contacts information, as well as task history. This cannot be undone. If you wish to keep this information, you can try hiding this contact instead.',
            )}
          </DialogContentText>
        }
        customActionSection={
          <>
            <Button
              disabled={deleting}
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t('Cancel')}
            </Button>
            <DialogDeleteButton
              size="large"
              variant="contained"
              disabled={deleting}
              onClick={handleDeleteContact}
            >
              {deleting && <LoadingIndicator size={20} />}
              {t('delete contact')}
            </DialogDeleteButton>
          </>
        }
        handleClose={() => setDeleteDialogOpen(false)}
      />
    );
  };

  return (
    <>
      <ContactDetailsTabContainer>
        {
          // Tag Section
        }
        <ContactDetailHeadingContainer>
          {loading || !data ? (
            <ContactDetailLoadingPlaceHolder variant="rect" />
          ) : (
            <ContactTags
              accountListId={accountListId}
              contactId={data.contact.id}
              contactTags={data.contact.tagList}
            />
          )}
        </ContactDetailHeadingContainer>
        <Divider />
        {
          // People Section
        }
        <ContactDetailSectionContainer>
          <ContactDetailHeadingContainer>
            <ContactDetailHeadingText variant="h6">
              {loading || !data ? t('Loading') : data.contact.name}
            </ContactDetailHeadingText>
            <ContactDetailHeadingIcon />
          </ContactDetailHeadingContainer>
          {loading || !data ? (
            <>
              <ContactDetailLoadingPlaceHolder variant="rect" />
              <ContactDetailLoadingPlaceHolder variant="rect" />
              <ContactDetailLoadingPlaceHolder variant="rect" />
            </>
          ) : (
            <ContactDetailsTabPeople data={data?.contact} />
          )}
        </ContactDetailSectionContainer>
        <Divider />
        {
          // Mailing Section
        }
        <ContactDetailSectionContainer>
          <ContactDetailHeadingContainer>
            <ContactDetailHeadingText variant="h6">
              {t('Mailing')}
            </ContactDetailHeadingText>
            <ContactDetailHeadingIcon />
          </ContactDetailHeadingContainer>
          {loading || !data ? (
            <>
              <ContactDetailLoadingPlaceHolder variant="rect" />
              <ContactDetailLoadingPlaceHolder variant="rect" />
              <ContactDetailLoadingPlaceHolder variant="rect" />
            </>
          ) : (
            <ContactDetailsTabMailing data={data.contact} />
          )}
        </ContactDetailSectionContainer>
        <Divider />
        {
          // other Section
        }
        <ContactDetailSectionContainer>
          <ContactDetailHeadingContainer>
            <ContactDetailHeadingText variant="h6">
              {t('Other')}
            </ContactDetailHeadingText>
            <ContactDetailHeadingIcon />
          </ContactDetailHeadingContainer>
          {loading || !data ? (
            <>
              <ContactDetailLoadingPlaceHolder variant="rect" />
              <ContactDetailLoadingPlaceHolder variant="rect" />
              <ContactDetailLoadingPlaceHolder variant="rect" />
            </>
          ) : (
            <ContactDetailsOther contact={data.contact} />
          )}
        </ContactDetailSectionContainer>
        <Divider />
        <ContactDeleteButton
          variant="contained"
          size="large"
          onClick={() => setDeleteDialogOpen(true)}
        >
          {t('delete contact')}
        </ContactDeleteButton>
      </ContactDetailsTabContainer>
      {renderDeleteContactDialog()}
    </>
  );
};
