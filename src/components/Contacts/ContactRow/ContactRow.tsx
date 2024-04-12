import Link from 'next/link';
import React from 'react';
import {
  Box,
  ButtonBase,
  Checkbox,
  Grid,
  Hidden,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  ContactsContext,
  ContactsType,
} from 'pages/accountLists/[accountListId]/contacts/ContactsContext';
import { CelebrationIcons } from '../CelebrationIcons/CelebrationIcons';
import { ContactPartnershipStatus } from '../ContactPartnershipStatus/ContactPartnershipStatus';
import { ContactUncompletedTasksCount } from '../ContactUncompletedTasksCount/ContactUncompletedTasksCount';
import { StarContactIconButton } from '../StarContactIconButton/StarContactIconButton';
import { ContactRowFragment } from './ContactRow.generated';

interface Props {
  contact: ContactRowFragment;
  useTopMargin?: boolean;
}

export const ContactRow: React.FC<Props> = ({ contact, useTopMargin }) => {
  const {
    accountListId,
    isRowChecked: isChecked,
    contactDetailsOpen,
    toggleSelectionById: onContactCheckToggle,
    getContactUrl,
  } = React.useContext(ContactsContext) as ContactsType;

  const ListItemBox = styled(ButtonBase)(({ theme }) => ({
    flex: '1 1 auto',
    textAlign: 'left',
    marginTop: useTopMargin ? '16px' : '0',
    padding: theme.spacing(0, 0.5, 0, 2),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(0, 0.5),
    },
    ...(isChecked(contactId)
      ? { backgroundColor: theme.palette.cruGrayLight.main }
      : {}),
  }));

  const StyledCheckbox = styled(Checkbox, {
    shouldForwardProp: (prop) => prop !== 'value',
  })(() => ({
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  }));

  const {
    id: contactId,
    lateAt,
    name,
    pledgeAmount,
    pledgeCurrency,
    pledgeFrequency,
    pledgeReceived,
    primaryAddress,
    starred,
    status,
    uncompletedTasksCount,
  } = contact;

  const { contactUrl } = getContactUrl(contactId);

  return (
    <Link
      href={contactUrl}
      scroll={false}
      prefetch={false}
      shallow={true}
      legacyBehavior
      passHref
      style={{ width: '100%', color: 'initial' }}
      data-testid="contactRowLink"
    >
      <ListItemBox>
        <Hidden xsDown>
          <ListItemIcon>
            <StyledCheckbox
              checked={isChecked(contact.id)}
              color="secondary"
              onClick={(event) => event.stopPropagation()}
              onChange={() => onContactCheckToggle(contact.id)}
              value={isChecked}
            />
          </ListItemIcon>
        </Hidden>
        <Grid container alignItems="center">
          <Grid item xs={10} md={6} style={{ paddingRight: 16 }}>
            <ListItemText
              primary={
                <Typography component="span" variant="h6" noWrap>
                  <Box component="span" display="flex" alignItems="center">
                    {name}
                    <CelebrationIcons contact={contact} />
                  </Box>
                </Typography>
              }
              secondary={
                primaryAddress && (
                  <Hidden smDown>
                    <Typography component="span" variant="body2">
                      {[
                        primaryAddress.street,
                        primaryAddress.city,
                        primaryAddress.state,
                        primaryAddress.postalCode,
                      ].join(', ')}
                    </Typography>
                  </Hidden>
                )
              }
            />
          </Grid>
          <Grid item xs={2} md={6}>
            <ContactPartnershipStatus
              contactDetailsOpen={contactDetailsOpen}
              lateAt={lateAt}
              pledgeAmount={pledgeAmount}
              pledgeCurrency={pledgeCurrency}
              pledgeFrequency={pledgeFrequency}
              pledgeReceived={pledgeReceived}
              status={status}
            />
          </Grid>
        </Grid>
        <Hidden xsDown>
          <Box>
            <ContactUncompletedTasksCount
              uncompletedTasksCount={uncompletedTasksCount}
              contactId={contactId}
            />
          </Box>
          <ListItemSecondaryAction
            style={{ position: 'static', top: 0, transform: 'none' }}
          >
            <StarContactIconButton
              accountListId={accountListId ?? ''}
              contactId={contactId}
              isStarred={starred || false}
            />
          </ListItemSecondaryAction>
        </Hidden>
      </ListItemBox>
    </Link>
  );
};
