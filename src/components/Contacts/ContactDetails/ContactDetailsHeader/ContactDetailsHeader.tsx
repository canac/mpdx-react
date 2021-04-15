import { Avatar, Box, IconButton, styled, Typography } from '@material-ui/core';
import { Close, MoreVert } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { useTranslation } from 'react-i18next';
import theme from '../../../../theme';

import { StarContactIcon } from '../../StarContactIcon/StarContactIcon';
import { useGetContactDetailsHeaderQuery } from './ContactDetailsHeader.generated';
import { ContactHeaderAddressSection } from './ContactHeaderSection/ContactHeaderAddressSection';
import { ContactHeaderPhoneSection } from './ContactHeaderSection/ContactHeaderPhoneSection';
import { ContactHeaderEmailSection } from './ContactHeaderSection/ContactHeaderEmailSection';
import { ContactHeaderStatusSection } from './ContactHeaderSection/ContactHeaderStatusSection';

interface Props {
  accountListId: string;
  contactId: string;
}

const HeaderBar = styled(Box)(({}) => ({
  display: 'flex',
  paddingBottom: theme.spacing(1),
}));
const HeaderBarContactWrap = styled(Box)(({}) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
}));
const HeaderBarButtonsWrap = styled(Box)(({}) => ({
  display: 'flex',
  alignItems: 'center',
}));
const ContactAvatar = styled(Avatar)(({}) => ({
  backgroundColor: theme.palette.secondary.dark,
  height: 64,
  width: 64,
  borderRadius: 32,
}));
const PrimaryContactName = styled(Typography)(({}) => ({
  display: 'inline',
  marginLeft: 18,
}));
const PrimaryText = styled(Typography)(({}) => ({
  display: 'inline',
  marginRight: 8,
}));
const ButtonWrap = styled(IconButton)(({}) => ({
  margin: 4,
  width: 32,
  height: 32,
}));
const MoreButtonIcon = styled(MoreVert)(({}) => ({
  width: 16,
  height: 16,
  color: theme.palette.text.primary,
}));
const CloseButtonIcon = styled(Close)(({}) => ({
  width: 14,
  height: 14,
  color: theme.palette.text.primary,
}));
const HeaderSectionWrap = styled(Box)(({}) => ({
  display: 'flex',
}));

export const ContactDetailsHeader: React.FC<Props> = ({
  accountListId,
  contactId,
}: Props) => {
  const { data, loading } = useGetContactDetailsHeaderQuery({
    variables: { accountListId, contactId },
  });
  const { t } = useTranslation();

  return (
    <Box style={{ padding: 24 }}>
      <HeaderBar>
        <ContactAvatar src={data?.contact?.avatar || ''} />
        <HeaderBarContactWrap>
          {loading ? (
            <Box role="Skeleton">
              <Skeleton
                variant="text"
                style={{
                  display: 'inline',
                  marginLeft: 18,
                  width: 240,
                  fontSize: 24,
                }}
              />
            </Box>
          ) : data?.contact ? (
            <>
              <PrimaryContactName role="ContactName" variant="h5">
                {`${data.contact.primaryPerson?.firstName} ${data.contact.primaryPerson?.lastName}`}
              </PrimaryContactName>
              <PrimaryText variant="subtitle1">{` - ${t(
                'Primary',
              )}`}</PrimaryText>
            </>
          ) : null}
        </HeaderBarContactWrap>
        <HeaderBarButtonsWrap>
          <ButtonWrap>
            <StarContactIcon hasStar={false} />
          </ButtonWrap>
          <ButtonWrap>
            <MoreButtonIcon />
          </ButtonWrap>
          <ButtonWrap>
            <CloseButtonIcon />
          </ButtonWrap>
        </HeaderBarButtonsWrap>
      </HeaderBar>
      <HeaderSectionWrap>
        <Box flex={1}>
          <ContactHeaderAddressSection
            loading={loading}
            contact={data?.contact}
          />
          <ContactHeaderPhoneSection
            loading={loading}
            contact={data?.contact}
          />
          <ContactHeaderEmailSection
            loading={loading}
            contact={data?.contact}
          />
        </Box>
        <Box flex={1}>
          <ContactHeaderStatusSection
            loading={loading}
            contact={data?.contact}
          />
        </Box>
      </HeaderSectionWrap>
    </Box>
  );
};