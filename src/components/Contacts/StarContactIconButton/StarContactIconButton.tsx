import { IconButton, styled } from '@material-ui/core';
import React from 'react';
import { StarredItemIcon } from '../../common/StarredItemIcon/StarredItemIcon';
import { useSetContactStarredMutation } from './SetContactStarred.generated';

interface Props {
  accountListId: string;
  contactId: string;
  isStarred: boolean;
}

const StarButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(1),
}));

export const StarContactIconButton: React.FC<Props> = ({
  accountListId,
  contactId,
  isStarred,
}) => {
  const [setContactStarred] = useSetContactStarredMutation();

  const toggleStarred = () => {
    setContactStarred({
      variables: { accountListId, contactId, starred: !isStarred },
    });
  };

  return (
    <StarButton onClick={toggleStarred}>
      <StarredItemIcon isStarred={isStarred} />
    </StarButton>
  );
};