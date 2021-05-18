import { Box, Button, Divider, styled, Typography } from '@material-ui/core';
import {
  CheckCircleOutline,
  Clear,
  DateRangeOutlined,
  Delete,
  FiberManualRecordOutlined,
} from '@material-ui/icons';
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { currencyFormat } from '../../../../../lib/intlFormat';
import { HandshakeIcon } from '../../ContactDetailsHeader/ContactHeaderSection/HandshakeIcon';
import { ContactDonorAccountsFragment } from '../ContactDonationsTab.generated';

const IconAndTextContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, 4),
  display: 'flex',
  padding: 0,
}));

const IconAndTextContainerCenter = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, 4),
  display: 'flex',
  alignItems: 'center',
  padding: 0,
}));

const LabelsAndText = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(0, 1),
  padding: 0,
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: '20',
  height: '20',
  margin: theme.spacing(0),
}));

const PartnershipInfoContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const AddAccountButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  color: theme.palette.text.secondary,
}));

const PartnershipTitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(1),
}));

interface PartnershipInfoProp {
  contact: ContactDonorAccountsFragment | null;
}

export const PartnershipInfo: React.FC<PartnershipInfoProp> = ({ contact }) => {
  const { t } = useTranslation();

  return (
    <PartnershipInfoContainer>
      <PartnershipTitle variant="h6">{t('Partnership')}</PartnershipTitle>
      <IconAndTextContainer>
        <IconContainer>
          <HandshakeIcon />
        </IconContainer>
        <Box style={{ margin: 0, padding: 0 }} role="cell">
          <LabelsAndText variant="subtitle1">{status}</LabelsAndText>
          <LabelsAndText variant="subtitle1">
            {`${currencyFormat(
              contact?.pledgeAmount ?? 0,
              contact?.pledgeCurrency ?? 'USD',
            )} ${contact?.pledgeFrequency ?? t('No Frequency Set')}`}
          </LabelsAndText>
          <LabelsAndText variant="subtitle1">{contact?.source}</LabelsAndText>
        </Box>
      </IconAndTextContainer>
      <IconAndTextContainerCenter>
        <IconContainer>
          {contact?.pledgeReceived ? (
            <CheckCircleOutline color="disabled" style={{ margin: 8 }} />
          ) : (
            <FiberManualRecordOutlined color="disabled" style={{ margin: 8 }} />
          )}
        </IconContainer>
        <LabelsAndText variant="subtitle1" color="textSecondary">
          {t('Commitment Recieved ')}
        </LabelsAndText>
        <LabelsAndText variant="subtitle1">
          {contact?.pledgeReceived ? t('Yes') : t('No')}
        </LabelsAndText>
      </IconAndTextContainerCenter>
      <IconAndTextContainerCenter>
        <IconContainer>
          <DateRangeOutlined color="disabled" style={{ margin: 8 }} />
        </IconContainer>
        <LabelsAndText variant="subtitle1" color="textSecondary">
          {t('Start Date')}
        </LabelsAndText>
        <LabelsAndText variant="subtitle1">
          {contact?.pledgeStartDate
            ? DateTime.fromISO(contact?.pledgeStartDate).toLocaleString()
            : t('No Date Available')}
        </LabelsAndText>
      </IconAndTextContainerCenter>
      <IconAndTextContainerCenter>
        <IconContainer>
          <DateRangeOutlined color="disabled" style={{ margin: 8 }} />
        </IconContainer>
        <LabelsAndText variant="subtitle1" color="textSecondary">
          {t('Last Gift')}
        </LabelsAndText>
        <LabelsAndText variant="subtitle1">
          {contact?.lastDonation?.donationDate
            ? DateTime.fromISO(
                contact?.lastDonation.donationDate,
              ).toLocaleString()
            : t('No Date Available')}
        </LabelsAndText>
      </IconAndTextContainerCenter>
      <IconAndTextContainerCenter>
        <IconContainer>
          <Clear style={{ color: 'transparent', margin: 8 }} />
        </IconContainer>
        <LabelsAndText variant="subtitle1" color="textSecondary">
          {t('Lifetime Gifts')}
        </LabelsAndText>
        <LabelsAndText variant="subtitle1">
          {currencyFormat(
            contact?.totalDonations ?? 0,
            contact?.pledgeCurrency ?? 'USD',
          )}
        </LabelsAndText>
      </IconAndTextContainerCenter>
      <IconAndTextContainerCenter>
        <IconContainer>
          <Clear style={{ color: 'transparent', margin: 8 }} />
        </IconContainer>
        <LabelsAndText variant="subtitle1" color="textSecondary">
          {t('Referred by ')}
        </LabelsAndText>
        <LabelsAndText variant="subtitle1">
          {contact?.contactReferralsToMe.nodes
            .map((referral) => {
              return referral.referredBy.name;
            })
            .toLocaleString()}
        </LabelsAndText>
      </IconAndTextContainerCenter>
      <IconAndTextContainerCenter>
        <IconContainer>
          <Clear style={{ color: 'transparent', margin: 8 }} />
        </IconContainer>
        <LabelsAndText variant="subtitle1" color="textSecondary">
          {t('Send Appeals')}
        </LabelsAndText>
        <LabelsAndText variant="subtitle1">
          {contact?.noAppeals ? t('No') : t('Yes')}
        </LabelsAndText>
      </IconAndTextContainerCenter>
      <IconAndTextContainerCenter>
        <IconContainer>
          <Clear style={{ color: 'transparent', margin: 8 }} />
        </IconContainer>
        <LabelsAndText variant="subtitle1" color="textSecondary">
          {t('Next Increase Ask')}
        </LabelsAndText>
        <LabelsAndText variant="subtitle1" role="textbox">
          {DateTime.fromISO(contact?.nextAsk ?? '').toLocaleString()}
        </LabelsAndText>
      </IconAndTextContainerCenter>
      <Divider />
      <PartnershipTitle variant="h6">{t('Partner Account')}</PartnershipTitle>
      {contact?.contactDonorAccounts.nodes.map((donor) => {
        return (
          <IconAndTextContainerCenter key={donor.id}>
            <IconContainer />
            <LabelsAndText variant="subtitle1" color="textSecondary">
              {t('Name Account')}
            </LabelsAndText>
            <LabelsAndText variant="subtitle1">
              {donor.donorAccount.displayName}
            </LabelsAndText>
            <IconContainer>
              <Delete color="disabled" style={{ flexGrow: 1 }} />
            </IconContainer>
          </IconAndTextContainerCenter>
        );
      })}
      <IconAndTextContainerCenter>
        <AddAccountButton variant="outlined" color="default">
          {t('Add Account')}
        </AddAccountButton>
      </IconAndTextContainerCenter>
    </PartnershipInfoContainer>
  );
};