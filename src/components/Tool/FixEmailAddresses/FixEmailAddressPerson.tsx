import React, { Fragment } from 'react';
import { mdiDelete, mdiLock, mdiStar, mdiStarOutline } from '@mdi/js';
import { Icon } from '@mdi/react';
import CheckIcon from '@mui/icons-material/Check';
import {
  Avatar,
  Box,
  Button,
  Grid,
  Hidden,
  Link,
  TextField,
  Theme,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import * as Yup from 'yup';
import { SetContactFocus } from 'pages/accountLists/[accountListId]/tools/useToolsHelper';
import { PersonEmailAddressInput } from 'src/graphql/types.generated';
import { useLocale } from 'src/hooks/useLocale';
import { dateFormatShort } from 'src/lib/intlFormat';
import theme from '../../../theme';
import { ConfirmButtonIcon } from '../ConfirmButtonIcon';

const PersonCard = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    border: `1px solid ${theme.palette.cruGrayMedium.main}`,
  },
}));

const Container = styled(Grid)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    border: `1px solid ${theme.palette.cruGrayMedium.main}`,
  },
}));

const EmailAddressListWrapper = styled(Grid)(({ theme }) => ({
  backgroundColor: theme.palette.cruGrayLight.main,
  width: '100%',
  [theme.breakpoints.down('xs')]: {
    paddingTop: theme.spacing(2),
  },
}));

const ConfirmButtonWrapper = styled(Box)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  '& .MuiButton-root': {
    backgroundColor: theme.palette.mpdxBlue.main,
    color: 'white',
  },
}));

const BoxWithResponsiveBorder = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.cruGrayMedium.main}`,
  },
}));

const ColumnHeaderWrapper = styled(Grid)(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const RowWrapper = styled(Grid)(({ theme }) => ({
  paddingBottom: theme.spacing(2),
}));

const HoverableIcon = styled(Icon)(({ theme }) => ({
  '&:hover': {
    color: theme.palette.mpdxBlue.main,
    cursor: 'pointer',
  },
}));

const useStyles = makeStyles()((theme: Theme) => ({
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
}));

interface FixEmailAddressPersonProps {
  name: string;
  emails: EmailValidationFormProps[];
  personId: string;
  toDelete: PersonEmailAddressInput[];
  contactId: string;
  handleChange: (
    personId: string,
    numberIndex: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleDelete: (personId: string, emailAddress: number) => void;
  handleAdd: (personId: string, email: string) => void;
  handleChangePrimary: (personId: string, emailIndex: number) => void;
  setContactFocus: SetContactFocus;
}

interface EmailValidationFormProps {
  email: string;
  isPrimary: boolean;
  updatedAt: string;
  source: string;
  personId: string; // Add the 'personId' property
  isValid: boolean;
}

const onSubmit = () => {};

const EmailValidationForm = ({
  emails: initialEmail = {
    email: '',
    isPrimary: false,
    updatedAt: '',
    source: '',
    personId: '',
    isValid: false,
  },
}: {
  emails?: EmailValidationFormProps;
  personId?: string;
  handleAdd: (personId: string, email: string) => void;
}) => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address format'),
  });

  // const handleButtonClick = (email) => {

  // };

  //TODO: Add button functionality to add email using graphql mutation

  return (
    <Formik
      initialValues={{
        email: initialEmail.email,
        isPrimary: initialEmail.isPrimary,
        updatedAt: '',
        source: '',
        personId: 'test',
        isValid: initialEmail.isValid,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isValid }) => (
        <Form>
          <Grid container>
            <div className="d-flex align-items-start">
              <Field
                type="email"
                name="email"
                data-testid={`personId-${initialEmail.personId}`}
              />
            </div>
            <div className="d-flex align-items-end">
              <Button
                style={{
                  maxWidth: '20px',
                  maxHeight: '20px',
                  minWidth: '20px',
                  minHeight: '20px',
                }}
                variant="contained"
                type="submit"
                disabled={!isValid}
                data-testid={`addButton-${initialEmail.personId}`}
                // onClick={() => handleButtonClick(values.email)}
              >
                <CheckIcon fontSize="small" />
              </Button>
            </div>
          </Grid>
          <ErrorMessage name="email" component="div" />
        </Form>
      )}
    </Formik>
  );
};

export const FixEmailAddressPerson: React.FC<FixEmailAddressPersonProps> = ({
  name,
  emails,
  personId,
  contactId,
  handleChange,
  handleDelete,
  handleChangePrimary,
  setContactFocus,
  handleAdd,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { classes } = useStyles();
  //TODO: Add button functionality
  //TODO: Make name pop up a modal to edit the person info

  // const updateNewEmailAddress = (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ): void => {
  //   setNewEmailAddress(event.target.value);
  // };

  // const addNewEmailAddress = (): void => {
  //   if (newEmailAddress) {
  //     handleAdd(personId, newEmailAddress);
  //     setNewEmailAddress('');
  //   }
  // };

  const handleContactNameClick = () => {
    setContactFocus(contactId);
  };

  return (
    <Container container>
      <Grid container>
        <Grid item md={10} xs={12}>
          <PersonCard display="flex" alignItems="center">
            <Grid container>
              <Grid item xs={12}>
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ height: '100%' }}
                  p={2}
                >
                  <Avatar src="" className={classes.avatar} />
                  <Box display="flex" flexDirection="column" ml={2}>
                    <Link underline="hover" onClick={handleContactNameClick}>
                      <Typography variant="h6">{name}</Typography>
                    </Link>
                  </Box>
                </Box>
              </Grid>
              <EmailAddressListWrapper item xs={12}>
                <Grid container>
                  <Hidden xsDown>
                    <ColumnHeaderWrapper item xs={12} sm={6}>
                      <Box display="flex" justifyContent="space-between" px={2}>
                        <Typography>
                          <strong>{t('Source')}</strong>
                        </Typography>
                        <Typography>
                          <strong>{t('Primary')}</strong>
                        </Typography>
                      </Box>
                    </ColumnHeaderWrapper>
                    <ColumnHeaderWrapper item xs={12} sm={6}>
                      <Box display="flex" justifyContent="flex-start" px={3.25}>
                        <Typography>
                          <strong>{t('Address')}</strong>
                        </Typography>
                      </Box>
                    </ColumnHeaderWrapper>
                  </Hidden>
                  {emails.map((email, index) => (
                    <Fragment key={index}>
                      <RowWrapper item xs={12} sm={6}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          px={2}
                        >
                          <Box>
                            <Hidden smUp>
                              <Typography display="inline">
                                <strong>{t('Source')}: </strong>
                              </Typography>
                            </Hidden>
                            <Typography display="inline">
                              {`${email.source} (${dateFormatShort(
                                DateTime.fromISO(email.updatedAt),
                                locale,
                              )})`}
                            </Typography>
                          </Box>
                          <Typography>
                            {email.isPrimary ? (
                              <Box
                                data-testid={`starIcon-${personId}-${index}`}
                              >
                                <HoverableIcon path={mdiStar} size={1} />
                              </Box>
                            ) : (
                              <Box
                                data-testid={`starOutlineIcon-${personId}-${index}`}
                                onClick={() =>
                                  handleChangePrimary(personId, index)
                                }
                              >
                                <HoverableIcon path={mdiStarOutline} size={1} />
                              </Box>
                            )}
                          </Typography>
                        </Box>
                      </RowWrapper>
                      <RowWrapper item xs={12} sm={6}>
                        <BoxWithResponsiveBorder
                          display="flex"
                          px={2}
                          justifyContent="flex-start"
                        >
                          <TextField
                            style={{ width: '100%' }}
                            inputProps={{
                              'data-testid': `textfield-${personId}-${index}`,
                            }}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>,
                            ) => handleChange(personId, index, event)}
                            value={email.email}
                            disabled={email.source !== 'MPDX'}
                          />

                          {email.source === 'MPDX' ? (
                            <Box
                              data-testid={`delete-${personId}-${index}`}
                              onClick={() => handleDelete(personId, index)}
                            >
                              <HoverableIcon path={mdiDelete} size={1} />
                            </Box>
                          ) : (
                            <Icon
                              path={mdiLock}
                              size={1}
                              style={{
                                color: theme.palette.cruGrayMedium.main,
                              }}
                            />
                          )}
                        </BoxWithResponsiveBorder>
                      </RowWrapper>
                    </Fragment>
                  ))}
                  <RowWrapper item xs={12} sm={6}>
                    <Box display="flex" justifyContent="space-between" px={2}>
                      <Box>
                        <Hidden smUp>
                          <Typography display="inline">
                            <strong>{t('Source')}: </strong>
                          </Typography>
                        </Hidden>
                        <Typography display="inline">MPDX</Typography>
                      </Box>
                    </Box>
                  </RowWrapper>
                  <RowWrapper item xs={12} sm={6}>
                    <BoxWithResponsiveBorder
                      display="flex"
                      justifyContent="flex-start"
                      px={3.5}
                    >
                      <EmailValidationForm handleAdd={handleAdd} />
                    </BoxWithResponsiveBorder>
                  </RowWrapper>
                </Grid>
              </EmailAddressListWrapper>
            </Grid>
          </PersonCard>
        </Grid>
        <Grid item xs={12} md={2}>
          <Box
            display="flex"
            flexDirection="column"
            style={{ paddingLeft: theme.spacing(1) }}
          >
            <ConfirmButtonWrapper>
              <Button variant="contained" style={{ width: '100%' }}>
                <ConfirmButtonIcon />
                {t('Confirm')}
              </Button>
            </ConfirmButtonWrapper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};
