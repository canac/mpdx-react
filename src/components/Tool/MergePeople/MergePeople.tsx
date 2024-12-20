import React, { useMemo, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { Trans, useTranslation } from 'react-i18next';
import { makeStyles } from 'tss-react/mui';
import { TypeEnum } from 'src/graphql/types.generated';
import useGetAppSettings from 'src/hooks/useGetAppSettings';
import theme from '../../../theme';
import ContactPair from '../MergeContacts/ContactPair';
import { StickyConfirmButtons } from '../MergeContacts/StickyConfirmButtons';
import { bulkUpdateDuplicates } from '../MergeContacts/mergeDuplicatesHelper';
import NoData from '../NoData';
import { StyledFabLoading } from '../StyledFabLoading';
import { ToolsGridContainer } from '../styledComponents';
import {
  useGetPersonDuplicatesQuery,
  useMergePeopleBulkMutation,
  useUpdateDuplicateMutation,
} from './GetPersonDuplicates.generated';

const useStyles = makeStyles()(() => ({
  outer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  descriptionBox: {
    marginBottom: theme.spacing(1),
  },
}));

export interface ActionType {
  action: string;
  mergeId?: string;
}

interface Props {
  accountListId: string;
}

const MergePeople: React.FC<Props> = ({ accountListId }: Props) => {
  const { classes } = useStyles();
  const [actions, setActions] = useState<Record<string, ActionType>>({});
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useGetPersonDuplicatesQuery({
    variables: { accountListId },
  });
  const { appName } = useGetAppSettings();
  const [peopleMerge, { loading: updating }] = useMergePeopleBulkMutation();
  const [updateDuplicates] = useUpdateDuplicateMutation();
  const disabled = useMemo(
    () => updating || !Object.entries(actions).length,
    [actions, updating],
  );
  const totalCount = data?.personDuplicates.totalCount || 0;
  const duplicatesDisplayedCount = data?.personDuplicates.nodes.length || 0;

  const updateActions = (
    id1: string,
    id2: string,
    duplicateId: string,
    action: string,
  ): void => {
    if (!updating) {
      if (action === 'ignore') {
        setActions((prevState) => ({
          ...prevState,
          [id1]: { action: '' },
          [id2]: { action: '' },
          [duplicateId]: { action: 'ignore' },
        }));
      } else {
        setActions((prevState) => ({
          ...prevState,
          [id1]: { action: 'merge', mergeId: id2 },
          [id2]: { action: 'delete' },
        }));
      }
    }
  };

  const handleSubmit = () => {
    bulkUpdateDuplicates(
      TypeEnum.Person,
      actions,
      peopleMerge,
      updateDuplicates,
      enqueueSnackbar,
      t,
    );
  };

  return (
    <Box
      className={classes.outer}
      display="flex"
      flexDirection="column"
      data-testid="Home"
    >
      {!loading && data && (
        <ToolsGridContainer container spacing={3}>
          <Grid item xs={12}></Grid>
          {duplicatesDisplayedCount ? (
            <>
              <Grid item xs={12}>
                <Box
                  className={classes.descriptionBox}
                  data-testid="PeopleMergeDescription"
                >
                  <Typography>
                    <Trans
                      defaults="You have <bold>{{totalCount}}</bold> possible duplicate people. This is sometimes caused when you imported data into {{appName}}. We recommend reconciling these as soon as possible. Please select the duplicate that should win the merge. No data will be lost. "
                      shouldUnescape
                      values={{
                        totalCount,
                        appName,
                      }}
                      components={{ bold: <strong /> }}
                    />
                  </Typography>
                  <Typography>
                    <strong>{t('This cannot be undone.')}</strong>
                  </Typography>
                </Box>
              </Grid>
              <StickyConfirmButtons
                accountListId={accountListId}
                duplicatesDisplayedCount={duplicatesDisplayedCount}
                disabled={disabled}
                totalCount={totalCount}
                confirmAction={handleSubmit}
                setActions={setActions}
              />
              <Grid item xs={12} sx={{ margin: '0px 2px 20px 2px' }}>
                {data?.personDuplicates.nodes.map((duplicate) => (
                  <ContactPair
                    key={duplicate.id}
                    duplicateId={duplicate.id}
                    contact1={duplicate.recordOne}
                    contact2={duplicate.recordTwo}
                    update={updateActions}
                    updating={updating}
                  />
                ))}
              </Grid>
            </>
          ) : (
            <NoData tool="mergePeople" />
          )}
        </ToolsGridContainer>
      )}
      {(loading || updating) && <StyledFabLoading />}
    </Box>
  );
};

export default MergePeople;
