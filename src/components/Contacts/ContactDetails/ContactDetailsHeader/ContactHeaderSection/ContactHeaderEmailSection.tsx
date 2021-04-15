import { styled, Typography } from '@material-ui/core';
import { Email } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';

import React, { ReactElement } from 'react';
import theme from '../../../../../theme';
import { ContactHeaderEmailFragment } from './ContactHeaderEmail.generated';
import { ContactHeaderSection } from './ContactHeaderSection';

interface Props {
  loading: boolean;
  contact?: ContactHeaderEmailFragment;
}

const EmailIcon = styled(Email)(({}) => ({
  margin: 8,
  width: 20,
  height: 20,
  color: theme.palette.text.secondary,
}));
const TextSkeleton = styled(Skeleton)(({}) => ({
  display: 'inline',
  marginLeft: 18,
  width: 200,
  fontSize: 16,
}));

export const ContactHeaderEmailSection = ({
  loading,
  contact,
}: Props): ReactElement => {
  if (loading) {
    return (
      <ContactHeaderSection icon={<EmailIcon />}>
        <TextSkeleton variant="text" />
      </ContactHeaderSection>
    );
  } else if (contact) {
    const {
      primaryPerson: { primaryEmailAddress: { email } = {} } = {},
    } = contact;

    if (!!email) {
      return (
        <ContactHeaderSection icon={<EmailIcon />}>
          <Typography variant="subtitle1">{email}</Typography>
        </ContactHeaderSection>
      );
    }
  }

  return <ContactHeaderSection icon={<EmailIcon />} />;
};