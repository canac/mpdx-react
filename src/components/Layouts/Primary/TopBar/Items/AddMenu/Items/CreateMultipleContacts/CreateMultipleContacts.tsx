import {
  Box,
  Button,
  CircularProgress,
  DialogActions,
  DialogContent,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@material-ui/core';
import { Field, FieldArray, FieldProps, Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import React, { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { useCreateContactMutation } from '../CreateContact/CreateContact.generated';

const InputRow = styled(TableRow)(() => ({
  '&:nth-child(odd)': {
    backgroundColor: '#f9f9f9',
  },
}));

const DialogContentContainer = styled(DialogContent)(() => ({
  padding: '0 !important',
}));

interface Props {
  accountListId: string;
  handleClose: () => void;
}

interface ContactInputInterface {
  firstName?: string;
  spouseName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface InitialContactInterface {
  contacts: ContactInputInterface[];
}

const contactsSchema = yup.object().shape({
  contacts: yup.array().of(
    yup.object().shape({
      firstName: yup.string(),
      spouseName: yup.string(),
      lastName: yup.string(),
      address: yup.string(),
      phone: yup.string(),
      email: yup.string(),
    }),
  ),
});

export const CreateMultipleContacts = ({
  accountListId,
  handleClose,
}: Props): ReactElement<Props> => {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const initialContacts: InitialContactInterface = {
    contacts: new Array(10).fill({
      firstName: undefined,
      spouseName: undefined,
      lastName: undefined,
      address: undefined,
      phone: undefined,
      email: undefined,
    }),
  };

  const [createContact, { loading: creating }] = useCreateContactMutation();

  const onSubmit = async (attributes: InitialContactInterface) => {
    const filteredContacts = attributes.contacts.filter(
      (contact) => contact.firstName,
    );
    if (filteredContacts.length > 0) {
      const createdContacts = await Promise.all(
        filteredContacts.map(async (contact) => {
          const { data } = await createContact({
            variables: {
              accountListId,
              attributes: {
                name: contact.lastName
                  ? contact.spouseName
                    ? `${contact.lastName}, ${contact.firstName} and ${contact.spouseName}`
                    : `${contact.lastName}, ${contact.firstName}`
                  : contact.spouseName
                  ? `${contact.firstName} and ${contact.spouseName}`
                  : `${contact.firstName}`,
              },
            },
          });
          return data?.createContact?.contact.id;
        }),
      );

      if (createdContacts.length > 0) {
        enqueueSnackbar(
          createdContacts.length > 1
            ? t(`${createdContacts.length} Contacts successfully created`)
            : t('Contact successfully created'),
          {
            variant: 'success',
          },
        );
      }
    }

    handleClose();
  };

  return (
    <Formik
      initialValues={initialContacts}
      validationSchema={contactsSchema}
      validateOnChange={false}
      onSubmit={onSubmit}
    >
      {({
        values: { contacts },
        isValid,
        isSubmitting,
        setFieldValue,
      }): ReactElement => (
        <Form>
          <DialogContentContainer dividers>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">{t('First')}</TableCell>
                    <TableCell align="left">{t('Spouse')}</TableCell>
                    <TableCell align="left">{t('Last')}</TableCell>
                    <TableCell align="left">{t('Address')}</TableCell>
                    <TableCell align="left">{t('Phone')}</TableCell>
                    <TableCell align="left">{t('Email')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <FieldArray
                    name="contacts"
                    render={() => (
                      <>
                        {contacts.map((contact, index) => (
                          <InputRow key={index}>
                            <TableCell>
                              <Field name="firstName">
                                {({ field }: FieldProps) => (
                                  <Box width="100%">
                                    <TextField
                                      {...field}
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      type="text"
                                      inputProps={{
                                        'aria-label': t('First'),
                                      }}
                                      value={contact.firstName}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `contacts.${index}.firstName`,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </Box>
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name="spouseName">
                                {({ field }: FieldProps) => (
                                  <Box width="100%">
                                    <TextField
                                      {...field}
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      type="text"
                                      inputProps={{
                                        'aria-label': t('Spouse'),
                                      }}
                                      value={contact.spouseName}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `contacts.${index}.spouseName`,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </Box>
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name="lastName">
                                {({ field }: FieldProps) => (
                                  <Box width="100%">
                                    <TextField
                                      {...field}
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      type="text"
                                      inputProps={{
                                        'aria-label': t('Last'),
                                      }}
                                      value={contact.lastName}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `contacts.${index}.lastName`,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </Box>
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              {/* TODO: Connect to Google Autocomplete? */}
                              <Field name="address">
                                {({ field }: FieldProps) => (
                                  <Box width="100%">
                                    <TextField
                                      {...field}
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      type="text"
                                      inputProps={{
                                        'aria-label': t('Address'),
                                      }}
                                      value={contact.address}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `contacts.${index}.address`,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </Box>
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name="phone">
                                {({ field }: FieldProps) => (
                                  <Box width="100%">
                                    <TextField
                                      {...field}
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      type="text"
                                      inputProps={{
                                        'aria-label': t('Phone'),
                                      }}
                                      value={contact.phone}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `contacts.${index}.phone`,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </Box>
                                )}
                              </Field>
                            </TableCell>
                            <TableCell>
                              <Field name="email">
                                {({ field }: FieldProps) => (
                                  <Box width="100%">
                                    <TextField
                                      {...field}
                                      variant="outlined"
                                      size="small"
                                      fullWidth
                                      type="text"
                                      inputProps={{
                                        'aria-label': t('Email'),
                                      }}
                                      value={contact.email}
                                      onChange={(e) =>
                                        setFieldValue(
                                          `contacts.${index}.email`,
                                          e.target.value,
                                        )
                                      }
                                    />
                                  </Box>
                                )}
                              </Field>
                            </TableCell>
                          </InputRow>
                        ))}
                      </>
                    )}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContentContainer>
          <DialogActions>
            <Button
              onClick={handleClose}
              disabled={isSubmitting}
              variant="text"
            >
              {t('Cancel')}
            </Button>
            <Button
              color="primary"
              type="submit"
              variant="contained"
              disabled={
                !isValid ||
                isSubmitting ||
                contacts.filter((c) => c.firstName).length <= 0
              }
            >
              {creating ? (
                <CircularProgress color="secondary" size={20} />
              ) : (
                t('Save')
              )}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
};