import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import { useTranslation } from 'react-i18next';
import { StatusEnum } from 'src/graphql/types.generated';
import { getLocalizedContactStatus } from 'src/utils/functions/getLocalizedContactStatus';
import theme from '../../../../../theme';

const StatusRow = styled(Box)(() => ({
  padding: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.cruGrayMedium.main}`,
  '&:hover': {
    backgroundColor: theme.palette.mpdxYellow.main,
    cursor: 'move',
    boxShadow: `inset 0px 0px 0px 3px  ${theme.palette.progressBarYellow.main}`,
  },
}));

interface Status {
  id: StatusEnum;
  value: string;
}

interface Props {
  status: Status;
  columnWidth: number;
  columnIndex: number;
}

export interface ContactFlowSetupItemDrag {
  status: StatusEnum;
  columnWidth: number;
  originIndex: number;
}

export const ContactFlowSetupStatusRow: React.FC<Props> = ({
  status,
  columnWidth,
  columnIndex,
}: Props) => {
  const { t } = useTranslation();
  const item: ContactFlowSetupItemDrag = {
    status: status.id,
    columnWidth,
    originIndex: columnIndex,
  };
  const [, drag, preview] = useDrag(() => ({
    type: 'status',
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, []);

  return (
    <StatusRow ref={drag} data-testid={status.id}>
      <Typography>{getLocalizedContactStatus(t, status.id)}</Typography>
    </StatusRow>
  );
};
