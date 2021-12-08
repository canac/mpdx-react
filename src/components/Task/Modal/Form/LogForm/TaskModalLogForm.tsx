import React, { ReactElement, useState } from 'react';
import {
  TextField,
  Select,
  styled,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Grid,
  Box,
  CircularProgress,
  Button,
  Divider,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Dialog,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { Autocomplete } from '@material-ui/lab';

import { DatePicker, TimePicker } from '@material-ui/pickers';
import DeleteIcon from '@material-ui/icons/Delete';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { DateTime } from 'luxon';
import { CalendarToday, Schedule } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';
import { dateFormat } from '../../../../../lib/intlFormat/intlFormat';
import {
  ActivityTypeEnum,
  NotificationTimeUnitEnum,
  NotificationTypeEnum,
  TaskCreateInput,
  TaskUpdateInput,
  ResultEnum,
} from '../../../../../../graphql/types.generated';
import { GetTaskForTaskDrawerQuery } from '../../../Drawer/TaskDrawerTask.generated';
import { GetTasksForTaskListDocument } from '../../../List/TaskList.generated';
import { TaskFilter } from '../../../List/List';
import { GetThisWeekDocument } from '../../../../Dashboard/ThisWeek/GetThisWeek.generated';
import {
  useGetDataForTaskDrawerQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../../../Drawer/Form/TaskDrawer.generated';
import theme from '../../../../../../src/theme';
import { useCreateTaskCommentMutation } from '../../../Drawer/CommentList/Form/CreateTaskComment.generated';

export const ActionButton = styled(Button)(() => ({
  color: theme.palette.info.main,
  fontWeight: 550,
}));

const DeleteButton = styled(Button)(() => ({
  fontWeight: 550,
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const LoadingIndicator = styled(CircularProgress)(() => ({
  display: 'flex',
  margin: 'auto',
}));

const taskSchema: yup.SchemaOf<TaskCreateInput | TaskUpdateInput> = yup.object({
  id: yup.string().nullable(),
  activityType: yup.mixed<ActivityTypeEnum>(),
  subject: yup.string().required(),
  contactIds: yup.array().of(yup.string()).default([]),
  starred: yup.boolean().nullable(),
  startAt: yup.string().nullable(),
  completedAt: yup.string().nullable(),
  userId: yup.string().nullable(),
  tagList: yup.array().of(yup.string()).default([]),
  notificationTimeBefore: yup.number().nullable(),
  notificationType: yup.mixed<NotificationTypeEnum>(),
  result: yup.mixed<ResultEnum>(),
  nextAction: yup.mixed<ActivityTypeEnum>(),
  notificationTimeUnit: yup.mixed<NotificationTimeUnitEnum>(),
});

interface Props {
  accountListId: string;
  task?: GetTaskForTaskDrawerQuery['task'];
  onClose: () => void;
  defaultValues?: Partial<GetTaskForTaskDrawerQuery['task']>;
  filter?: TaskFilter;
  rowsPerPage: number;
}

const TaskModalLogForm = ({
  accountListId,
  task,
  onClose,
  defaultValues,
  filter,
  rowsPerPage,
}: Props): ReactElement => {
  const initialTask: TaskCreateInput | TaskUpdateInput = task
    ? {
        ...(({ user: _user, contacts: _contacts, ...task }) => task)(task),
        contactIds: task.contacts.nodes.map(({ id }) => id),
      }
    : {
        id: null,
        activityType: null,
        subject: '',
        startAt: null,
        completedAt: DateTime.local()
          .plus({ hours: 1 })
          .startOf('hour')
          .toISO(),
        tagList: [],
        contactIds: [],
        notificationTimeBefore: null,
        notificationType: null,
        notificationTimeUnit: null,
        result: null,
        nextAction: null,
        ...defaultValues,
      };
  const { t } = useTranslation();
  const [commentBody, changeCommentBody] = useState('');
  const [showMore, setShowMore] = useState<boolean>(false);
  const [removeDialogOpen, handleRemoveDialog] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { data, loading } = useGetDataForTaskDrawerQuery({
    variables: { accountListId },
  });
  const [createTask, { loading: creating }] = useCreateTaskMutation();
  const [updateTask, { loading: saving }] = useUpdateTaskMutation();
  const [deleteTask, { loading: deleting }] = useDeleteTaskMutation();
  const [createTaskComment] = useCreateTaskCommentMutation();
  const onSubmit = async (
    attributes: TaskCreateInput | TaskUpdateInput,
  ): Promise<void> => {
    const isUpdate = (
      attributes: TaskCreateInput | TaskUpdateInput,
    ): attributes is TaskUpdateInput => !!task;
    const body = commentBody.trim();
    if (isUpdate(attributes)) {
      await updateTask({
        variables: { accountListId, attributes },
      });
    } else {
      await createTask({
        variables: { accountListId, attributes },
        update: (_cache, { data }) => {
          if (data?.createTask?.task.id && body !== '') {
            const id = uuidv4();

            createTaskComment({
              variables: {
                accountListId,
                taskId: data.createTask.task.id,
                attributes: { id, body },
              },
            });
          }
        },
      });
    }
    enqueueSnackbar(t('Task saved successfully'), { variant: 'success' });
    onClose();
  };

  const onDeleteTask = async (): Promise<void> => {
    if (task) {
      const endOfDay = DateTime.local().endOf('day');
      await deleteTask({
        variables: {
          accountListId,
          id: task.id,
        },
        refetchQueries: [
          {
            query: GetTasksForTaskListDocument,
            variables: { accountListId, first: rowsPerPage, ...filter },
          },
          {
            query: GetThisWeekDocument,
            variables: {
              accountListId,
              endOfDay: endOfDay.toISO(),
              today: endOfDay.toISODate(),
              twoWeeksFromNow: endOfDay.plus({ weeks: 2 }).toISODate(),
              twoWeeksAgo: endOfDay.minus({ weeks: 2 }).toISODate(),
            },
          },
        ],
      });
      enqueueSnackbar(t('Task deleted successfully'), { variant: 'success' });
      handleRemoveDialog(false);
      onClose();
    }
  };

  const handleShowMoreChange = (): void => {
    setShowMore((prevState) => !prevState);
  };

  return (
    <Box>
      <Formik
        initialValues={initialTask}
        validationSchema={taskSchema}
        onSubmit={onSubmit}
      >
        {({
          values: {
            activityType,
            subject,
            userId,
            completedAt,
            tagList,
            contactIds,
            result,
            nextAction,
          },
          setFieldValue,
          handleChange,
          handleSubmit,
          isSubmitting,
          isValid,
          errors,
          touched,
        }): ReactElement => (
          <form onSubmit={handleSubmit} noValidate>
            <Box p={2} pb={4} width="75%" margin="auto">
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <TextField
                    label={t('Task Name')}
                    value={subject}
                    onChange={handleChange('subject')}
                    fullWidth
                    multiline
                    inputProps={{ 'aria-label': 'Subject' }}
                    error={!!errors.subject && touched.subject}
                    helperText={
                      errors.subject &&
                      touched.subject &&
                      t('Field is required')
                    }
                    required
                  />
                </Grid>
                <Grid item>
                  <FormControl fullWidth>
                    <InputLabel id="activityType">{t('Action')}</InputLabel>
                    <Select
                      labelId="activityType"
                      value={activityType}
                      onChange={handleChange('activityType')}
                    >
                      {Object.values(ActivityTypeEnum).map((val) => (
                        <MenuItem key={val} value={val}>
                          {t(val) /* manually added to translation file */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Autocomplete
                    multiple
                    options={
                      (
                        data?.contacts?.nodes &&
                        [...data.contacts.nodes].sort((a, b) =>
                          a.name.localeCompare(b.name),
                        )
                      )?.map(({ id }) => id) || []
                    }
                    getOptionLabel={(contactId) =>
                      data?.contacts.nodes.find(({ id }) => id === contactId)
                        ?.name ?? ''
                    }
                    loading={loading}
                    renderInput={(params): ReactElement => (
                      <TextField
                        {...params}
                        label={t('Contacts')}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {loading && (
                                <CircularProgress color="primary" size={20} />
                              )}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                    value={contactIds ?? undefined}
                    onChange={(_, contactIds): void =>
                      setFieldValue('contactIds', contactIds)
                    }
                    getOptionSelected={(option, value): boolean =>
                      option === value
                    }
                  />
                </Grid>
                <Grid item>
                  <FormControl fullWidth>
                    <InputLabel id="result">{t('Result')}</InputLabel>
                    <Select
                      labelId="result"
                      value={result}
                      onChange={handleChange('result')}
                    >
                      {Object.values(ResultEnum).map((val) => (
                        <MenuItem key={val} value={val}>
                          {t(val) /* manually added to translation file */}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl fullWidth>
                    <Grid container spacing={2}>
                      <Grid xs={6} item>
                        <DatePicker
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <CalendarToday
                                  style={{
                                    color: theme.palette.cruGrayMedium.main,
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          clearable
                          fullWidth
                          labelFunc={(date, invalidLabel) =>
                            date ? dateFormat(date) : invalidLabel
                          }
                          autoOk
                          label={t('Completed Date')}
                          value={completedAt}
                          onChange={(date): void =>
                            setFieldValue('completedAt', date)
                          }
                          okLabel={t('OK')}
                          todayLabel={t('Today')}
                          cancelLabel={t('Cancel')}
                          clearLabel={t('Clear')}
                        />
                      </Grid>
                      <Grid xs={6} item>
                        <TimePicker
                          clearable
                          fullWidth
                          autoOk
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Schedule
                                  style={{
                                    color: theme.palette.cruGrayMedium.main,
                                  }}
                                />
                              </InputAdornment>
                            ),
                          }}
                          label={t('Completed Time')}
                          value={completedAt}
                          onChange={(date): void =>
                            setFieldValue('completedAt', date)
                          }
                          okLabel={t('OK')}
                          todayLabel={t('Today')}
                          cancelLabel={t('Cancel')}
                          clearLabel={t('Clear')}
                        />
                      </Grid>
                    </Grid>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showMore}
                        onChange={handleShowMoreChange}
                      />
                    }
                    label={t('Show More')}
                  />
                  <AnimatePresence>
                    {showMore && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 193, opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <Grid item container>
                          <Grid item xs={12}>
                            <TextField
                              label={t('Comment')}
                              value={commentBody}
                              onChange={(event) =>
                                changeCommentBody(event.target.value)
                              }
                              fullWidth
                              multiline
                              inputProps={{ 'aria-label': 'Comment' }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Autocomplete
                              multiple
                              freeSolo
                              renderTags={(
                                value,
                                getTagProps,
                              ): ReactElement[] =>
                                value.map((option, index) => (
                                  <Chip
                                    color="primary"
                                    size="small"
                                    key={index}
                                    label={option}
                                    {...getTagProps({ index })}
                                  />
                                ))
                              }
                              renderInput={(params): ReactElement => (
                                <TextField {...params} label={t('Tags')} />
                              )}
                              onChange={(_, tagList): void =>
                                setFieldValue('tagList', tagList)
                              }
                              value={tagList ?? undefined}
                              options={data?.accountList?.taskTagList || []}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Autocomplete
                              loading={loading}
                              options={
                                (data?.accountListUsers?.nodes &&
                                  data.accountListUsers.nodes.map(
                                    ({ user }) => user.id,
                                  )) ||
                                []
                              }
                              getOptionLabel={(userId): string => {
                                const user = data?.accountListUsers?.nodes.find(
                                  ({ user }) => user.id === userId,
                                )?.user;
                                return `${user?.firstName} ${user?.lastName}`;
                              }}
                              renderInput={(params): ReactElement => (
                                <TextField
                                  {...params}
                                  label={t('Assignee')}
                                  InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                      <>
                                        {loading && (
                                          <CircularProgress
                                            color="primary"
                                            size={20}
                                          />
                                        )}
                                        {params.InputProps.endAdornment}
                                      </>
                                    ),
                                  }}
                                />
                              )}
                              value={userId}
                              onChange={(_, userId): void =>
                                setFieldValue('userId', userId)
                              }
                              getOptionSelected={(option, value): boolean =>
                                option === value
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <FormControl fullWidth>
                              <InputLabel id="nextAction">
                                {t('Next Action')}
                              </InputLabel>
                              <Select
                                labelId="nextAction"
                                value={nextAction}
                                onChange={handleChange('nextAction')}
                              >
                                {Object.values(ActivityTypeEnum).map((val) => (
                                  <MenuItem key={val} value={val}>
                                    {
                                      t(
                                        val,
                                      ) /* manually added to translation file */
                                    }
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              p={1}
            >
              <Box>
                {task?.id ? (
                  <DeleteButton
                    size="large"
                    variant="contained"
                    onClick={() => handleRemoveDialog(true)}
                  >
                    <DeleteIcon style={{ marginRight: theme.spacing(1) }} />
                    {t('Delete')}
                  </DeleteButton>
                ) : null}
              </Box>
              <Box>
                <ActionButton
                  size="large"
                  disabled={isSubmitting}
                  onClick={onClose}
                >
                  {t('Cancel')}
                </ActionButton>
                <ActionButton
                  size="large"
                  disabled={!isValid || isSubmitting}
                  type="submit"
                >
                  {(saving || creating) && (
                    <>
                      <CircularProgress color="primary" size={20} />
                      &nbsp;
                    </>
                  )}
                  {t('Save')}
                </ActionButton>
              </Box>

              <Dialog
                open={removeDialogOpen}
                aria-labelledby={t('Remove task confirmation')}
                fullWidth
                maxWidth="sm"
              >
                <DialogTitle>{t('Confirm')}</DialogTitle>
                <DialogContent dividers>
                  {deleting ? (
                    <LoadingIndicator color="primary" size={50} />
                  ) : (
                    <DialogContentText>
                      {t('Are you sure you wish to delete the selected task?')}
                    </DialogContentText>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => handleRemoveDialog(false)}>
                    {t('No')}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={onDeleteTask}
                  >
                    {t('Yes')}
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

export default TaskModalLogForm;