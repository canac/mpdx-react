import {
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import CalendarToday from '@mui/icons-material/CalendarToday';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { Formik } from 'formik';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import {
  LikelyToGiveEnum,
  SendNewsletterEnum,
  StatusEnum,
} from '../../../../../graphql/types.generated';
import Modal from '../../../common/Modal/Modal';
import { useMassActionsUpdateContactFieldsMutation } from './MassActionsUpdateContacts.generated';
import theme from 'src/theme';
import { useLoadConstantsQuery } from 'src/components/Constants/LoadConstants.generated';
import { useGetDataForTaskDrawerQuery } from 'src/components/Task/Drawer/Form/TaskDrawer.generated';
import { ContactsDocument } from 'pages/accountLists/[accountListId]/contacts/Contacts.generated';

interface MassActionsEditFieldsModalProps {
  ids: string[];
  accountListId: string;
  handleClose: () => void;
}

const StarredMap = {
  Starred: true,
  Unstarred: false,
};

const NoAppealsMap = {
  No: true, // true means we do not want appeals
  Yes: false,
};

const PledgeReceivedMap = {
  Yes: true,
  No: false,
};

const MassActionsEditFieldsSchema = yup.object({
  status: yup.string().nullable(),
  likelyToGive: yup.string().nullable(),
  starred: yup.string().nullable(),
  noAppeals: yup.string().nullable(),
  sendNewsletter: yup.string().nullable(),
  nextAsk: yup.string().nullable(),
  pledgeReceived: yup.string().nullable(),
  pledgeCurrency: yup.string().nullable(),
  locale: yup.string().nullable(),
  churchName: yup.string().nullable(),
  userId: yup.string().nullable(),
});

export const MassActionsEditFieldsModal: React.FC<
  MassActionsEditFieldsModalProps
> = ({ handleClose, accountListId, ids }) => {
  const { t } = useTranslation();

  const [updateContacts] = useMassActionsUpdateContactFieldsMutation();

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (fields: any) => {
    const formattedFields: { [key: string]: any } = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value) {
        formattedFields[key] =
          key === 'starred' || key === 'noAppeals' || key === 'pledgeReceived'
            ? value === 'true'
            : value;
      }
    }
    const attributes = ids.map((id) => ({
      id,
      ...formattedFields,
    }));
    await updateContacts({
      variables: {
        accountListId,
        attributes,
      },
      refetchQueries: [
        {
          query: ContactsDocument,
          variables: { accountListId },
        },
      ],
    });
    enqueueSnackbar(t('Contacts updated!'), {
      variant: 'success',
    });
    handleClose();
  };

  const { data, loading } = useGetDataForTaskDrawerQuery({
    variables: {
      accountListId,
    },
  });
  const { data: constants, loading: loadingConstants } =
    useLoadConstantsQuery();

  return (
    <Modal title={t('Edit Fields')} isOpen={true} handleClose={handleClose}>
      <Formik
        initialValues={{
          status: '',
          likelyToGive: '',
          starred: '',
          noAppeals: '',
          sendNewsletter: '',
          nextAsk: null,
          pledgeReceived: '',
          pledgeCurrency: '',
          locale: '',
          churchName: '',
          userId: '',
        }}
        onSubmit={onSubmit}
        validationSchema={MassActionsEditFieldsSchema}
      >
        {({
          values: {
            status,
            likelyToGive,
            starred,
            noAppeals,
            sendNewsletter,
            nextAsk,
            pledgeReceived,
            pledgeCurrency,
            locale,
            churchName,
            userId,
          },
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
          isValid,
        }): ReactElement => (
          <form onSubmit={handleSubmit} noValidate>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="activityType">{t('Status')}</InputLabel>
                    <Select
                      label={t('Status')}
                      labelId="activityType"
                      value={status}
                      onChange={(e) => setFieldValue('status', e.target.value)}
                    >
                      <MenuItem value={undefined}>{t('None')}</MenuItem>
                      {Object.values(StatusEnum).map((val) => (
                        <MenuItem key={val} value={val}>
                          {t(val) /* manually added to translation file */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="activityType">
                      {t('Likely To Give')}
                    </InputLabel>
                    <Select
                      label={t('Likely To Give')}
                      labelId="likelyToGive"
                      value={likelyToGive}
                      onChange={(e) =>
                        setFieldValue('likelyToGive', e.target.value)
                      }
                    >
                      <MenuItem value={undefined}>{t('None')}</MenuItem>
                      {Object.values(LikelyToGiveEnum).map((val) => (
                        <MenuItem key={val} value={val}>
                          {t(val) /* manually added to translation file */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="starred">{t('Starred')}</InputLabel>
                    <Select
                      label={t('Starred')}
                      labelId="starred"
                      value={starred}
                      onChange={(e) => setFieldValue('starred', e.target.value)}
                    >
                      <MenuItem value={undefined}>{t('None')}</MenuItem>
                      {Object.entries(StarredMap).map(([key, val]) => (
                        <MenuItem key={key} value={String(val)}>
                          {t(key) /* manually added to translation file */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="noAppeals">{t('Send Appeals?')}</InputLabel>
                    <Select
                      label={t('Send Appeals?')}
                      labelId="noAppeals"
                      value={noAppeals}
                      onChange={(e) =>
                        setFieldValue('noAppeals', e.target.value)
                      }
                    >
                      <MenuItem value={undefined}>{t('None')}</MenuItem>
                      {Object.entries(NoAppealsMap).map(([key, val]) => (
                        <MenuItem key={key} value={String(val)}>
                          {t(key) /* manually added to translation file */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="sendNewsletter">
                      {t('Newsletter')}
                    </InputLabel>
                    <Select
                      label={t('Newsletter')}
                      labelId="sendNewsletter"
                      value={sendNewsletter}
                      onChange={(e) =>
                        setFieldValue('sendNewsletter', e.target.value)
                      }
                    >
                      <MenuItem value={undefined}>{t('None')}</MenuItem>
                      {Object.values(SendNewsletterEnum).map((val) => (
                        <MenuItem key={val} value={val}>
                          {t(val) /* manually added to translation file */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <MobileDatePicker
                      renderInput={(params) => (
                        <TextField fullWidth {...params} />
                      )}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <CalendarToday
                              style={{
                                color: theme.palette.cruGrayMedium.main,
                              }}
                            />
                          </InputAdornment>
                        ),
                      }}
                      inputFormat="MMM dd, yyyy"
                      closeOnSelect
                      label={t('Next Increase Ask')}
                      value={nextAsk}
                      onChange={(date): void => setFieldValue('nextAsk', date)}
                      componentsProps={{
                        actionBar: { actions: ['clear', 'cancel', 'accept'] },
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="pledgeReceived">
                      {t('Commitment Received')}
                    </InputLabel>
                    <Select
                      label={t('Commitment Received')}
                      labelId="pledgeReceived"
                      value={pledgeReceived}
                      onChange={(e) =>
                        setFieldValue('pledgeReceived', e.target.value)
                      }
                    >
                      <MenuItem value={undefined}>{t('None')}</MenuItem>
                      {Object.entries(PledgeReceivedMap).map(([key, val]) => (
                        <MenuItem key={key} value={String(val)}>
                          {t(key) /* manually added to translation file */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="pledgeCurrency">
                      {t('Commitment Currency')}
                    </InputLabel>
                    <Select
                      label={t('Commitment Currency')}
                      labelId="pledgeCurrency"
                      value={pledgeCurrency}
                      onChange={(e) =>
                        setFieldValue('pledgeCurrency', e.target.value)
                      }
                    >
                      <MenuItem value={undefined}>{t('None')}</MenuItem>
                      {!loadingConstants &&
                        constants?.constant?.pledgeCurrencies?.map((val) => (
                          <MenuItem key={val.id} value={val.id || ''}>
                            {
                              t(
                                val.value || '',
                              ) /* manually added to translation file */
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="locale">{t('Language')}</InputLabel>
                    <Select
                      label={t('Language')}
                      labelId="locale"
                      value={locale}
                      onChange={(e) => setFieldValue('locale', e.target.value)}
                    >
                      <MenuItem value={undefined}>{t('None')}</MenuItem>
                      {!loadingConstants &&
                        constants?.constant?.languages?.map((val) => (
                          <MenuItem key={val.id} value={val.id || ''}>
                            {
                              t(
                                val.value || '',
                              ) /* manually added to translation file */
                            }
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <TextField
                      label={t('Church')}
                      value={churchName}
                      onChange={handleChange('churchName')}
                      fullWidth
                      multiline
                      inputProps={{ 'aria-label': 'Church' }}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} lg={6}>
                  <FormControl fullWidth>
                    <InputLabel id="userId">{t('Assignee')}</InputLabel>
                    <Select
                      label={t('Assignee')}
                      labelId="userId"
                      value={userId}
                      onChange={(e) => setFieldValue('userId', e.target.value)}
                      style={{ marginBottom: theme.spacing(2) }}
                    >
                      {!loading ? (
                        [
                          <MenuItem key="" value={undefined}>
                            {t('None')}
                          </MenuItem>,
                          data?.accountListUsers?.nodes &&
                            data.accountListUsers.nodes.map((val) => (
                              <MenuItem key={val.id} value={val.user.id}>
                                {`${val.user?.firstName} ${val.user?.lastName}`}
                              </MenuItem>
                            )),
                        ]
                      ) : (
                        <CircularProgress size={20} />
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleClose}
                disabled={isSubmitting}
                variant="text"
                color="inherit"
              >
                {t('Cancel')}
              </Button>
              <Button
                color="primary"
                type="submit"
                variant="contained"
                disabled={!isValid || isSubmitting}
              >
                {/* {updating && <LoadingIndicator color="primary" size={20} />} */}
                {t('Save')}
              </Button>
            </DialogActions>
          </form>
        )}
      </Formik>
    </Modal>
  );
};
