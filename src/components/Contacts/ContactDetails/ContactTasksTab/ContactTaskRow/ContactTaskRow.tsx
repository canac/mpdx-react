import { Box, styled, Typography } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { TFunction } from 'i18next';
import { DateTime } from 'luxon';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityTypeEnum,
  ResultEnum,
} from '../../../../../../graphql/types.generated';
import useTaskDrawer from '../../../../../hooks/useTaskDrawer';
import theme from '../../../../../theme';
import { StarredItemIcon } from '../../../../common/StarredItemIcon/StarredItemIcon';
import { TaskDrawerTabsEnum } from '../../../../Task/Drawer/Drawer';
import { ContactCheckBox } from '../../../ContactCheckBox/ContactCheckBox';
import { StarTaskIconButton } from '../StarTaskIconButton/StarTaskIconButton';
import { ContactTaskRowFragment } from './ContactTaskRow.generated';
import { TaskCommentsButton } from './TaskCommentsButton/TaskCommentsButton';
import { TaskCompleteButton } from './TaskCompleteButton/TaskCompleteButton';
import { TaskDueDate } from './TaskDueDate/TaskDueDate';

const TaskRowWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: theme.spacing(1),
}));

const TaskItemWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  margin: theme.spacing(1),
}));

const TaskType = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

const TaskDescription = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.text.primary,
  marginLeft: theme.spacing(0.5),
}));

const ContactName = styled(Typography)(({ theme }) => ({
  fontSize: 14,
  color: theme.palette.text.primary,
  margin: theme.spacing(1),
}));

const StarIconWrap = styled(Box)(({ theme }) => ({
  margin: theme.spacing(1),
}));

const FieldLoadingState = styled(Skeleton)(
  ({ width, margin }: { width: number; margin: number }) => ({
    width,
    height: '24px',
    margin: margin,
  }),
);

const getLocalizedTaskType = (
  t: TFunction,
  taskType: ActivityTypeEnum | null | undefined,
): string => {
  if (!taskType) {
    return '';
  }

  switch (taskType) {
    case ActivityTypeEnum.Appointment:
      return t('Appointment');

    case ActivityTypeEnum.Call:
      return t('Call');

    case ActivityTypeEnum.Email:
      return t('Email');

    case ActivityTypeEnum.FacebookMessage:
      return t('Facebook Message');

    case ActivityTypeEnum.Letter:
      return t('Letter');

    case ActivityTypeEnum.NewsletterEmail:
      return t('Newsletter - Email');

    case ActivityTypeEnum.NewsletterPhysical:
      return t('Newsletter - Physical');

    case ActivityTypeEnum.None:
      return '';

    case ActivityTypeEnum.PrayerRequest:
      return t('Prayer Request');

    case ActivityTypeEnum.PreCallLetter:
      return t('Pre-Call Letter');

    case ActivityTypeEnum.ReminderLetter:
      return t('Reminder Letter');

    case ActivityTypeEnum.SupportLetter:
      return t('Support Letter');

    case ActivityTypeEnum.TalkToInPerson:
      return t('Talk To In Person');

    case ActivityTypeEnum.TextMessage:
      return t('Text Message');

    case ActivityTypeEnum.Thank:
      return t('Thank');

    case ActivityTypeEnum.ToDo:
      return t('To Do');
  }
};

interface ContactTaskRowProps {
  accountListId: string;
  task?: ContactTaskRowFragment;
}

export const ContactTaskRow: React.FC<ContactTaskRowProps> = ({
  accountListId,
  task,
}) => {
  const { t } = useTranslation();

  const { openTaskDrawer } = useTaskDrawer();

  const handleContactCheckPressed = () => {
    //select contact for actions
  };

  const handleCompleteButtonPressed = () => {
    openTaskDrawer({ taskId: task?.id, showCompleteForm: true });
  };

  const handleCommentButtonPressed = () => {
    openTaskDrawer({
      taskId: task?.id,
      specificTab: TaskDrawerTabsEnum.comments,
    });
  };

  if (!task) {
    return (
      <TaskRowWrap data-testid="loadingRow">
        <TaskItemWrap>
          <ContactCheckBox />
          <FieldLoadingState width={55} margin={theme.spacing(2)} />
          <FieldLoadingState width={200} margin={theme.spacing(0.5)} />
        </TaskItemWrap>
        <TaskItemWrap>
          <FieldLoadingState width={120} margin={theme.spacing(1)} />
          <FieldLoadingState width={80} margin={theme.spacing(1)} />
          <FieldLoadingState width={58} margin={theme.spacing(2)} />
          <StarIconWrap>
            <StarredItemIcon isStarred={false} />
          </StarIconWrap>
        </TaskItemWrap>
      </TaskRowWrap>
    );
  }

  const { activityType, contacts, comments, result, startAt, subject } = task;

  const dueDate = (startAt && DateTime.fromISO(startAt)) || null;

  const contactName = contacts.nodes[0].name;

  const isComplete = result === ResultEnum.Completed;

  return (
    <TaskRowWrap>
      <TaskItemWrap>
        <ContactCheckBox onClick={handleContactCheckPressed} />
        <TaskCompleteButton
          isComplete={isComplete}
          onClick={handleCompleteButtonPressed}
        />
        <TaskType>{getLocalizedTaskType(t, activityType)}</TaskType>
        <TaskDescription>{subject}</TaskDescription>
      </TaskItemWrap>
      <TaskItemWrap>
        <ContactName>{contactName}</ContactName>
        <TaskDueDate isComplete={isComplete} dueDate={dueDate} />
        <TaskCommentsButton
          isComplete={isComplete}
          numberOfComments={comments?.totalCount}
          onClick={handleCommentButtonPressed}
        />
        <StarTaskIconButton
          accountListId={accountListId}
          taskId={task.id}
          isStarred={task.starred}
        />
      </TaskItemWrap>
    </TaskRowWrap>
  );
};
