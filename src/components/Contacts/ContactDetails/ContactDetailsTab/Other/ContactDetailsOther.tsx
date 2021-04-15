import React from 'react';
import { Box, styled, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ContactOtherFragment } from './ContactOther.generated';

const ContactOtherContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1, 1, 1, 5),
}));

const ContactOtherTextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginLeft: theme.spacing(2),
}));

const ContactOtherTextLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.hint,
  marginRight: '5px',
}));

interface ContactDetailsOtherProp {
  contact: ContactOtherFragment;
}

export const ContactDetailsOther: React.FC<ContactDetailsOtherProp> = ({
  contact,
}) => {
  const { t } = useTranslation();
  const {
    name,
    preferredContactMethod,
    locale,
    timezone,
    churchName,
    website,
  } = contact;
  return (
    <Box>
      <Typography variant="h6">{t('Other')}</Typography>
      <ContactOtherContainer>
        <ContactOtherTextContainer>
          <ContactOtherTextLabel variant="subtitle1">
            {t('Assignee')}
          </ContactOtherTextLabel>
          <Typography variant="subtitle1">{name}</Typography>
        </ContactOtherTextContainer>
        <ContactOtherTextContainer>
          <ContactOtherTextLabel variant="subtitle1">
            {t('Preferred Contact Method')}
          </ContactOtherTextLabel>
          <Typography variant="subtitle1">{preferredContactMethod}</Typography>
        </ContactOtherTextContainer>
        <ContactOtherTextContainer>
          <ContactOtherTextLabel variant="subtitle1">
            {t('Language')}
          </ContactOtherTextLabel>
          <Typography variant="subtitle1">{locale}</Typography>
        </ContactOtherTextContainer>
        <ContactOtherTextContainer>
          <Typography variant="subtitle1">{timezone}</Typography>
        </ContactOtherTextContainer>
        <ContactOtherTextContainer>
          <ContactOtherTextLabel variant="subtitle1">
            {t('Church')}
          </ContactOtherTextLabel>
          <Typography variant="subtitle1">{churchName}</Typography>
        </ContactOtherTextContainer>
        <ContactOtherTextContainer>
          <Typography variant="subtitle1">{website}</Typography>
        </ContactOtherTextContainer>
      </ContactOtherContainer>
    </Box>
  );
};