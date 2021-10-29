import { Avatar, Box, styled, Typography } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import theme from '../../../../../src/theme';
import { StatusEnum } from '../../../../../graphql/types.generated';
import { StarContactIconButton } from '../../StarContactIconButton/StarContactIconButton';

interface Props {
  accountListId: string;
  id: string;
  name: string;
  status: StatusEnum | 'NULL';
  starred: boolean;
  onContactSelected: (contactId: string) => void;
  columnWidth?: number;
}

const ContactLink = styled(Typography)(() => ({
  color: theme.palette.mpdxBlue.main,
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
}));

const DraggableBox = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  '&:hover': {
    cursor: 'move',
  },
}));

export const ContactFlowRow: React.FC<Props> = ({
  accountListId,
  id,
  name,
  status,
  starred,
  onContactSelected,
  columnWidth,
}: Props) => {
  const [, drag, preview] = useDrag(() => ({
    type: 'contact',
    item: {
      id,
      status,
      name,
      starred,
      width: columnWidth,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <Box
      {...{ ref: drag }} //TS gives an error if you try to pass a ref normally, seems to be a MUI issue
      display="flex"
      width="100%"
      style={{
        background: 'white',
      }}
    >
      <DraggableBox>
        <Box display="flex" alignItems="center" width="100%">
          <Avatar
            src=""
            style={{
              width: theme.spacing(4),
              height: theme.spacing(4),
            }}
          />
          <Box display="flex" flexDirection="column" ml={2} draggable>
            <ContactLink onClick={() => onContactSelected(id)}>
              {name}
            </ContactLink>
            <Typography>{status || 'NULL'}</Typography>
          </Box>
        </Box>
        <Box display="flex">
          <StarContactIconButton
            accountListId={accountListId}
            contactId={id}
            isStarred={starred || false}
          />
        </Box>
      </DraggableBox>
    </Box>
  );
};