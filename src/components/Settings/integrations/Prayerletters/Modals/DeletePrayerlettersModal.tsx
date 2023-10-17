import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import { DialogContent, DialogActions, Typography } from '@mui/material';
import Modal from 'src/components/common/Modal/Modal';
import {
  SubmitButton,
  CancelButton,
} from 'src/components/common/Modal/ActionButtons/ActionButtons';
import { useDeletePrayerlettersAccountMutation } from '../PrayerlettersAccount.generated';

interface DeletePrayerlettersAccountModalProps {
  handleClose: () => void;
  accountListId: string;
  refetchPrayerlettersAccount: () => void;
}

const StyledDialogActions = styled(DialogActions)(() => ({
  justifyContent: 'space-between',
}));

export const DeletePrayerlettersAccountModal: React.FC<
  DeletePrayerlettersAccountModalProps
> = ({ handleClose, accountListId, refetchPrayerlettersAccount }) => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [deletePrayerlettersAccount] = useDeletePrayerlettersAccountMutation();

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await deletePrayerlettersAccount({
        variables: {
          input: {
            accountListId: accountListId,
          },
        },
        update: () => refetchPrayerlettersAccount(),
      });
      enqueueSnackbar(t('MPDX removed your integration with Prayer Letters'), {
        variant: 'success',
      });
    } catch {
      enqueueSnackbar(
        t("MPDX couldn't save your configuration changes for Prayer Letters"),
        {
          variant: 'error',
        },
      );
    }
    setIsSubmitting(false);
    handleClose();
  };

  return (
    <Modal
      isOpen={true}
      title={t('Confirm to Disconnect Prayer Letters Account')}
      handleClose={handleClose}
      size={'sm'}
    >
      <DialogContent>
        <Typography>
          {t(
            `Are you sure you wish to disconnect this Prayer Letters account?`,
          )}
        </Typography>
      </DialogContent>

      <StyledDialogActions>
        <CancelButton onClick={handleClose} disabled={isSubmitting} />
        <SubmitButton disabled={isSubmitting} onClick={handleDelete}>
          {t('Confirm')}
        </SubmitButton>
      </StyledDialogActions>
    </Modal>
  );
};