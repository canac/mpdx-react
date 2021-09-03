import React from 'react';
import { Box, Typography, styled } from '@material-ui/core';
import { mdiEmailOutline } from '@mdi/js';
import { useTranslation } from 'react-i18next';
import Icon from '@mdi/react';

const StyledBox = styled(Box)(({ theme }) => ({
  width: '100%',
  border: '1px solid',
  borderColor: theme.palette.cruGrayMedium.main,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  backgroundColor: theme.palette.cruGrayLight.main,
  paddingTop: theme.spacing(7),
  paddingBottom: theme.spacing(7),
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  textAlign: 'center',
  boxShadow: `0px 0px 5px ${theme.palette.cruGrayMedium.main} inset`,
}));

const NoContacts: React.FC = () => {
  const { t } = useTranslation();
  return (
    <StyledBox>
      <Icon path={mdiEmailOutline} size={1.5} />
      <Typography variant="h5">
        {t('No people with email addresses need attention')}
      </Typography>
      <Typography>
        {t(
          'People with new email addresses or multiple primary email addresses will appear here.',
        )}
      </Typography>
    </StyledBox>
  );
};

export default NoContacts;
