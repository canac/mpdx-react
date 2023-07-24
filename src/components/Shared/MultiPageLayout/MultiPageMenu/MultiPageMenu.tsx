import React from 'react';
import {
  Box,
  BoxProps,
  IconButton,
  List,
  Slide,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from 'tss-react/mui';
import Close from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { Item } from './Item/Item';
import { MultiselectFilter } from '../../../../../graphql/types.generated';
import { FilterListItemMultiselect } from 'src/components/Shared/Filters/FilterListItemMultiselect';
import { useGetDesignationAccountsQuery } from 'src/components/Reports/DonationsReport/Table/Modal/EditDonation.generated';
import { useAccountListId } from 'src/hooks/useAccountListId';
import { ReportNavItems, SettingsNavItems } from './MultiPageMenuItems';

export enum NavTypeEnum {
  Reports = 'reports',
  Settings = 'settings',
}

interface Props {
  selectedId: string;
  isOpen: boolean;
  onClose: () => void;
  navType: NavTypeEnum;
  designationAccounts?: string[];
  setDesignationAccounts?: (designationAccounts: string[]) => void;
}

const useStyles = makeStyles()(() => ({
  root: {
    overflow: 'hidden',
  },
}));

const FilterHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: '1px solid',
  borderBottomColor: theme.palette.grey[200],
}));

const FilterList = styled(List)(({ theme }) => ({
  '& .MuiListItemIcon-root': {
    minWidth: '37px',
  },
  '& .FilterListItemMultiselect-root': {
    marginBottom: theme.spacing(2),
  },
}));

export const MultiPageMenu: React.FC<Props & BoxProps> = ({
  selectedId,
  isOpen,
  onClose,
  navType,
  designationAccounts,
  setDesignationAccounts,
  ...BoxProps
}) => {
  const { classes } = useStyles();
  const { t } = useTranslation();
  const accountListId = useAccountListId();
  const navItems =
    navType === NavTypeEnum.Reports ? ReportNavItems : SettingsNavItems;
  const navTitle =
    navType === NavTypeEnum.Reports ? t('Reports') : t('Settings');

  const { data } = useGetDesignationAccountsQuery({
    variables: {
      accountListId: accountListId ?? '',
    },
    skip: !designationAccounts && !setDesignationAccounts,
  });
  const accounts =
    data?.designationAccounts
      .flatMap((group) => group.designationAccounts)
      .map((account) => ({
        name: account.name,
        value: account.id,
        placeholder: null,
      })) ?? [];

  const filter: MultiselectFilter = {
    filterKey: 'designation_account_id',
    title: 'Designation Account',
    options: accounts,
  };

  return (
    <Box data-testid="MultiPageMenu" {...BoxProps}>
      <div className={classes.root}>
        <Slide in={isOpen} direction="right" mountOnEnter unmountOnExit>
          <Box>
            <FilterHeader>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">{navTitle}</Typography>
                <IconButton onClick={onClose}>
                  <Close titleAccess={t('Close')} />
                </IconButton>
              </Box>
            </FilterHeader>
            <FilterList dense>
              {designationAccounts &&
                setDesignationAccounts &&
                accounts.length > 1 && (
                  <FilterListItemMultiselect
                    filter={filter}
                    selected={designationAccounts}
                    onUpdate={(value) => {
                      setDesignationAccounts(value ?? []);
                    }}
                  />
                )}
              {navItems.map((item) => (
                <Item
                  key={item.id}
                  item={item}
                  isSelected={item.id === selectedId}
                  navType={navType}
                />
              ))}
            </FilterList>
          </Box>
        </Slide>
      </div>
    </Box>
  );
};