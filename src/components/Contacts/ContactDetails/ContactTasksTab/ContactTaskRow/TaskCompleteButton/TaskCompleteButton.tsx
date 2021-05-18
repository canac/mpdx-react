import { Button, styled, Theme } from '@material-ui/core';
import { Check } from '@material-ui/icons';
import React from 'react';

const ButtonWrap = styled(Button)(
  ({ theme, isComplete }: { theme: Theme; isComplete: boolean }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isComplete ? theme.palette.mpdxGreen.main : 'transparent',
    height: 24,
    width: 55,
    borderRadius: 26,
    border: `2px solid ${theme.palette.mpdxGreen.main}`,
    margin: theme.spacing(2),
  }),
);

const TaskCheckIcon = styled(Check)(
  ({ theme, isComplete }: { theme: Theme; isComplete: boolean }) => ({
    color: isComplete
      ? theme.palette.common.white
      : theme.palette.mpdxGreen.main,
  }),
);

interface TaskCompleteButtonProps {
  isComplete: boolean;
  onClick: () => void;
}

export const TaskCompleteButton: React.FC<TaskCompleteButtonProps> = ({
  isComplete,
  onClick,
}) => {
  return (
    <ButtonWrap isComplete={isComplete} onClick={() => onClick()}>
      <TaskCheckIcon titleAccess="Check Icon" isComplete={isComplete} />
    </ButtonWrap>
  );
};