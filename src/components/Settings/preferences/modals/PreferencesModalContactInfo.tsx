import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Checkbox,
  Grid,
  Hidden,
  MenuItem,
  Radio,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AddCircle, Cancel, Check } from '@mui/icons-material';
import {
  PersPrefFieldWrapper,
  StyledOutlinedInput,
  StyledSelect,
} from '../shared/PreferencesForms';
import { info } from '../DemoContent';
import {
  AddButtonBox,
  DeleteButton,
  EmptyIcon,
  HiddenSmLabel,
  OptionHeadings,
  SectionHeading,
  StyledDivider,
  StyledGridContainer,
  StyledGridItem,
} from './PreferencesModalShared';

const SharedFieldHoverStyles = ({ theme }: { theme: Theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
});

const StyledRadio = styled(Radio)(SharedFieldHoverStyles);
const StyledCheckbox = styled(Checkbox)(SharedFieldHoverStyles);

const GreenCheck = styled(Check)(({ theme }) => ({
  color: theme.palette.mpdxGreen.main,
}));

const RedCancel = styled(Cancel)(({ theme }) => ({
  color: theme.palette.mpdxRed.main,
}));

interface AddContactProps {
  current?: {
    value: string;
    type: string;
    primary: boolean;
    invalid: boolean;
  };
  isPhone: boolean;
  type: string;
  index?: number;
}

const AddContact: React.FC<AddContactProps> = ({
  current,
  isPhone,
  type,
  index,
}) => {
  const { t } = useTranslation();

  const contactTypes = isPhone
    ? [
        ['mobile', 'Mobile'],
        ['home', 'Home'],
        ['work', 'Work'],
        ['other', 'Other'],
      ]
    : [
        ['personal', 'Personal'],
        ['work', 'Work'],
        ['other', 'Other'],
      ];

  const value = current ? current.value : '';
  const category = current ? current.type : '';
  const primary = current ? current.primary : false;
  const invalid = current ? current.invalid : false;

  return (
    <StyledGridContainer container spacing={2} key={index}>
      {/* Input field */}
      <StyledGridItem item xs={12} sm={5}>
        <PersPrefFieldWrapper>
          <StyledOutlinedInput
            type={isPhone ? 'tel' : 'email'}
            placeholder={t(isPhone ? 'Phone' : 'Email') + ' *'}
            value={value}
            required
          />
        </PersPrefFieldWrapper>
      </StyledGridItem>

      {/* Contact category */}
      <StyledGridItem item xs={12} sm={4}>
        <PersPrefFieldWrapper>
          <StyledSelect value={category ? category : 'other'}>
            {contactTypes.map(([contactVal, contactLabel], index) => (
              <MenuItem value={contactVal} key={index}>
                {t(contactLabel)}
              </MenuItem>
            ))}
          </StyledSelect>
        </PersPrefFieldWrapper>
      </StyledGridItem>

      {/* Primary contact method selection */}
      <StyledGridItem item xs={12} sm={1}>
        <HiddenSmLabel>{t('Primary')}</HiddenSmLabel>
        <StyledRadio
          name={`primary-${type}`}
          value={`primary${index}`}
          icon={<EmptyIcon />}
          checkedIcon={<GreenCheck />}
          checked={primary}
          disableRipple
        />
      </StyledGridItem>

      {/* Inactive contact method */}
      <StyledGridItem item xs={12} sm={1}>
        <HiddenSmLabel>{t('Invalid')}</HiddenSmLabel>
        <StyledCheckbox
          icon={<EmptyIcon />}
          checkedIcon={<RedCancel />}
          checked={invalid}
          disableRipple
        />
      </StyledGridItem>

      {/* Delete contact method */}
      <StyledGridItem item xs={12} sm={1}>
        <DeleteButton />
      </StyledGridItem>
    </StyledGridContainer>
  );
};

const ContactMethods: React.FC<{ type: string }> = ({ type }) => {
  const { t } = useTranslation();
  const isPhone = type === 'phone' ? true : false;
  const data = isPhone ? info.phone : info.email;

  data.sort((x, y) => {
    return x.primary === true ? -1 : y.primary === true ? 1 : 0;
  });

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5}>
          <SectionHeading>
            {isPhone ? t('Phone Numbers') : t('Email Addresses')}
          </SectionHeading>
        </Grid>
        <Hidden xsDown>
          <OptionHeadings smallCols={4} align="flex-start">
            {t('Type')}
          </OptionHeadings>
          <OptionHeadings smallCols={1}>{t('Primary')}</OptionHeadings>
          <OptionHeadings smallCols={1}>{t('Invalid')}</OptionHeadings>
          <OptionHeadings smallCols={1}>{t('Delete')}</OptionHeadings>
        </Hidden>
      </Grid>
      {data.map((current, index) => (
        <AddContact
          current={current}
          isPhone={isPhone}
          type={type}
          index={index}
          key={index}
        />
      ))}
      <AddContact isPhone={isPhone} type={type} index={data.length} />
      <AddButtonBox>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddCircle />}
          disableRipple
        >
          {t('Add')} {t(type)}
        </Button>
      </AddButtonBox>
    </>
  );
};

export const PersPrefModalContact: React.FC = () => {
  return (
    <>
      <ContactMethods type="phone" />
      <StyledDivider />
      <ContactMethods type="email" />
    </>
  );
};