import React from 'react';
import { useTranslation } from 'react-i18next';
import { Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { PersPrefField } from '../shared/PersPrefForms';
import { info } from '../DemoContent';

const StyledGridItem = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    '&:not(:last-child) .MuiFormControl-root': {
      marginBottom: 0,
    },
  },
}));

const StyledGrid = styled(Grid)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

export const PersPrefModalName: React.FC = () => {
  const { t } = useTranslation();

  return (
    <StyledGrid container spacing={2}>
      <StyledGridItem item xs={12} sm={2}>
        <PersPrefField label={t('Title')} inputValue={info.title} />
      </StyledGridItem>
      <StyledGridItem item xs={12} sm={4}>
        <PersPrefField
          label={t('First Name')}
          inputValue={info.first_name}
          required
        />
      </StyledGridItem>
      <StyledGridItem item xs={12} sm={4}>
        <PersPrefField
          label={t('Last Name')}
          inputValue={info.last_name}
          required
        />
      </StyledGridItem>
      <StyledGridItem item xs={12} sm={2}>
        <PersPrefField label={t('Suffix')} inputValue={info.suffix} />
      </StyledGridItem>
    </StyledGrid>
  );
};
