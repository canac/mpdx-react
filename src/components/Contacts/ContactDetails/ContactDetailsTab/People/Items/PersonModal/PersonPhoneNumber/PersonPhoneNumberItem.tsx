import { Grid, MenuItem, Select, styled, Checkbox } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FormikErrors, getIn } from 'formik';
import { Lock } from '@material-ui/icons';
import { ModalSectionContainer } from '../ModalSectionContainer/ModalSectionContainer';
import { ModalSectionDeleteIcon } from '../ModalSectionDeleteIcon/ModalSectionDeleteIcon';
import {
  InputMaybe,
  PersonCreateInput,
  PersonPhoneNumberInput,
  PersonUpdateInput,
} from '../../../../../../../../../graphql/types.generated';
import {
  ContactInputField,
  NewSocial,
  PrimaryControlLabel,
} from '../PersonModal';

interface Props {
  phoneNumber: PersonPhoneNumberInput & { source?: string };
  index: number;
  primaryIndex: number;
  phoneNumbers: InputMaybe<PersonPhoneNumberInput[]> | undefined;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => void;
  errors: FormikErrors<(PersonUpdateInput | PersonCreateInput) & NewSocial>;
  handleChangePrimary: (index: number) => void;
  sources:
    | {
        id: string;
        source: string;
      }[]
    | undefined;
}

const PhoneNumberSelect = styled(Select)(
  ({ destroyed }: { destroyed: boolean }) => ({
    textDecoration: destroyed ? 'line-through' : 'none',
  }),
);

export const PersonPhoneNumberItem: React.FC<Props> = ({
  phoneNumber,
  index,
  primaryIndex,
  phoneNumbers,
  setFieldValue,
  errors,
  handleChangePrimary,
  sources,
}) => {
  const { t } = useTranslation();

  const [isPrimaryChecked, setIsPrimaryChecked] = React.useState(false);

  const source = sources?.find((number) => number.id === phoneNumber.id)
    ?.source;

  const locked = source !== 'MPDX' && source !== undefined;

  React.useEffect(() => {
    setIsPrimaryChecked(index === primaryIndex);
  }, [primaryIndex]);

  const handleChange = () => {
    handleChangePrimary(index);
  };

  return (
    <>
      <ModalSectionContainer key={index}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ContactInputField
              destroyed={phoneNumber.destroy ?? false}
              value={phoneNumber.number}
              onChange={(event) =>
                setFieldValue(
                  `phoneNumbers.${index}.number`,
                  event.target.value,
                )
              }
              disabled={!!phoneNumber.destroy || locked}
              inputProps={{ 'aria-label': t('Phone Number') }}
              InputProps={{
                ...(locked
                  ? {
                      endAdornment: (
                        <Lock
                          titleAccess={t('Synced with Donation Services')}
                        />
                      ),
                    }
                  : {}),
              }}
              error={getIn(errors, `phoneNumbers.${index}`)}
              helperText={
                getIn(errors, `phoneNumbers.${index}`) &&
                getIn(errors, `phoneNumbers.${index}`).number
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <PhoneNumberSelect
              destroyed={phoneNumber.destroy ?? false}
              value={phoneNumber.location ?? ''}
              onChange={(event) =>
                setFieldValue(
                  `phoneNumbers.${index}.location`,
                  event.target.value,
                )
              }
              disabled={!!phoneNumber.destroy || locked}
              inputProps={{
                'aria-label': t('Phone Number Type'),
              }}
              fullWidth
            >
              <MenuItem selected value=""></MenuItem>
              <MenuItem value="Mobile" aria-label={t('Mobile')}>
                {t('Mobile')}
              </MenuItem>
              <MenuItem value="Work" aria-label={t('Work')}>
                {t('Work')}
              </MenuItem>
            </PhoneNumberSelect>
          </Grid>
          <Grid item xs={12} md={3}>
            <PrimaryControlLabel
              label={t('Primary')}
              control={
                <Checkbox
                  value={phoneNumber.id}
                  checked={isPrimaryChecked}
                  onChange={handleChange}
                />
              }
              destroyed={phoneNumber.destroy ?? false}
            />
          </Grid>
          <ModalSectionDeleteIcon
            disabled={locked}
            handleClick={
              phoneNumber.id
                ? () =>
                    setFieldValue(
                      `phoneNumbers.${index}.destroy`,
                      !phoneNumber.destroy,
                    )
                : () => {
                    const temp = phoneNumbers;
                    temp?.splice(index, 1);
                    setFieldValue('phoneNumbers', temp);
                  }
            }
          />
        </Grid>
      </ModalSectionContainer>
    </>
  );
};
