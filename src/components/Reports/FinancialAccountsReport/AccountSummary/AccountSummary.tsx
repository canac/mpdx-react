import NextLink from 'next/link';
import React, { useContext, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { Maybe } from 'src/graphql/types.generated';
import { useLocale } from 'src/hooks/useLocale';
import { monthYearFormat, numberFormat } from 'src/lib/intlFormat';
import theme from 'src/theme';
import {
  FinancialAccountContext,
  FinancialAccountType,
} from '../Context/FinancialAccountsContext';
import { FinancialAccountHeader } from '../Header/Header';
import { AccountSummaryCategory } from './AccountSummaryCategory/AccountSummaryCategory';
import {
  Category,
  createTransactionsUrl,
  formatNumber,
} from './AccountSummaryHelper';
import {
  FinancialAccountCategoriesFragment,
  useFinancialAccountSummaryQuery,
} from './financialAccountSummary.generated';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
}));

interface Periods {
  startDateFormatted: string;
  startDate: string;
  endDate: string;
}

export interface AppendCategoryToCategoriesArray {
  categories: Maybe<FinancialAccountCategoriesFragment>[];
  categoryArray: Category[];
  startDate: string;
  endDate: string;
  index: number;
}

export const appendCategoryToCategoriesArray = ({
  categories,
  categoryArray,
  startDate,
  endDate,
  index,
}: AppendCategoryToCategoriesArray) => {
  categories.forEach((category) => {
    const id = category?.category?.id ?? '';
    const name = category?.category?.name ?? category?.category?.code ?? '';
    const amount = formatNumber(category?.amount);
    if (index === 0) {
      categoryArray.push({
        id,
        name,
        months: [{ amount, startDate, endDate }],
      });
    } else {
      const existingCategory = categoryArray.find((c) => c.id === id);
      if (existingCategory) {
        existingCategory.months.push({ amount, startDate, endDate });
      }
    }
  });
};

export const AccountSummary: React.FC = () => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { accountListId, financialAccountId } = useContext(
    FinancialAccountContext,
  ) as FinancialAccountType;

  const { data } = useFinancialAccountSummaryQuery({
    variables: {
      accountListId,
      financialAccountId: financialAccountId ?? '',
    },
  });

  const tableData = useMemo(() => {
    const credits: number[] = [];
    const creditsCategories: Category[] = [];
    const closingBalances: number[] = [];
    const debits: number[] = [];
    const debitsCategories: Category[] = [];
    const openingBalances: number[] = [];
    const periods: Periods[] = [];
    const surplus: number[] = [];

    data?.financialAccountSummary.forEach((item, idx) => {
      if (!item) {
        return;
      }

      // Credits
      credits.push(formatNumber(item.credits));

      // Closing Balances
      openingBalances.push(formatNumber(item.openingBalance));

      // Debits
      debits.push(formatNumber(item.debits));

      // Closing Balances
      closingBalances.push(formatNumber(item.closingBalance));

      // Surplus
      /**
       * If the first character of the `item.difference` is '-', it removes the '-' character.
       * Otherwise, it prepends the '-' character to the `item.difference` value.
       */
      const difference =
        item.difference?.[0] === '-'
          ? item.difference.substring(1)
          : `-${item.difference}`;
      surplus.push(formatNumber(difference, false));

      // Periods
      const startDateFormatted = monthYearFormat(
        DateTime.fromISO(item?.startDate ?? '').month,
        DateTime.fromISO(item?.startDate ?? '').year,
        locale,
        false,
      );
      periods.push({
        startDateFormatted:
          idx === data.financialAccountSummary.length - 1
            ? 'Total'
            : startDateFormatted,
        startDate: item?.startDate ?? '',
        endDate: item?.endDate ?? '',
      });

      // Credits Categories
      appendCategoryToCategoriesArray({
        categories: item.creditByCategories,
        categoryArray: creditsCategories,
        startDate: item?.startDate ?? '',
        endDate: item?.endDate ?? '',
        index: idx,
      });

      // Debits Categories
      appendCategoryToCategoriesArray({
        categories: item.debitByCategories,
        categoryArray: debitsCategories,
        startDate: item?.startDate ?? '',
        endDate: item?.endDate ?? '',
        index: idx,
      });
    });

    return {
      closingBalances,
      credits,
      creditsCategories: creditsCategories.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
      debits,
      debitsCategories: debitsCategories.sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
      openingBalances,
      periods,
      surplus,
    };
  }, [data]);

  return (
    <>
      <FinancialAccountHeader />
      <Divider />
      {!data && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress data-testid="LoadingRC" />
        </Box>
      )}

      {data && (
        <Box pl={2} pr={2}>
          <TableContainer sx={{ marginBottom: 6 }}>
            <Table sx={{ minWidth: 650 }} aria-label="table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">{t('Category')}</Typography>
                  </TableCell>
                  {tableData.periods?.map((period, idx) => {
                    const monthStart = DateTime.fromISO(period.startDate)
                      .startOf('month')
                      .toISODate();
                    const monthEnd = DateTime.fromISO(period.endDate)
                      .endOf('month')
                      .toISODate();
                    const url = createTransactionsUrl({
                      accountListId,
                      financialAccountId,
                      startDate: monthStart ?? '',
                      endDate: monthEnd ?? '',
                    });
                    return (
                      <TableCell
                        key={`startDate-${idx}-${period?.startDate}`}
                        align="right"
                      >
                        <NextLink href={url} passHref shallow>
                          <Link>{period.startDateFormatted}</Link>
                        </NextLink>
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>

              <TableBody>
                {/* Opening Balance */}
                <TableRow>
                  <StyledTableCell>
                    <Typography variant="body1">
                      {t('Opening Balance')}
                    </Typography>
                  </StyledTableCell>
                  {tableData.openingBalances?.map((balance, idx) => {
                    return (
                      <StyledTableCell key={`${idx}-${balance}`} align="right">
                        {numberFormat(balance, locale)}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
                {/* Income header */}
                <TableRow sx={{ background: theme.palette.mpdxGreen.main }}>
                  <StyledTableCell>
                    <Typography variant="body1">{t('Income')}</Typography>
                  </StyledTableCell>
                  {tableData.periods?.map((_, idx) => {
                    return (
                      <StyledTableCell
                        key={`income-${idx}`}
                        align="right"
                      ></StyledTableCell>
                    );
                  })}
                </TableRow>

                {/* Income Categories */}
                {tableData.creditsCategories?.map((category) => (
                  <AccountSummaryCategory
                    key={category.id}
                    category={category}
                    accountListId={accountListId}
                    financialAccountId={financialAccountId ?? ''}
                  />
                ))}

                {/* Total Income */}
                <TableRow>
                  <StyledTableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {t('Total Income')}
                    </Typography>
                  </StyledTableCell>
                  {tableData.credits?.map((credit, idx) => {
                    return (
                      <StyledTableCell key={`${idx}-${credit}`} align="right">
                        <Typography fontWeight="bold">
                          {numberFormat(credit, locale)}
                        </Typography>
                      </StyledTableCell>
                    );
                  })}
                </TableRow>

                {/* Expenses header */}
                <TableRow sx={{ background: '#FF7679' }}>
                  <StyledTableCell sx={{ color: theme.palette.common.white }}>
                    <Typography variant="body1">{t('Expenses')}</Typography>
                  </StyledTableCell>
                  {tableData.periods?.map((_, idx) => {
                    return (
                      <StyledTableCell
                        key={`expenses-${idx}`}
                        align="right"
                      ></StyledTableCell>
                    );
                  })}
                </TableRow>

                {/* Expenses Categories */}
                {tableData.debitsCategories?.map((category) => (
                  <AccountSummaryCategory
                    key={category.id}
                    category={category}
                    accountListId={accountListId}
                    financialAccountId={financialAccountId ?? ''}
                  />
                ))}

                {/* Total Expenses */}
                <TableRow>
                  <StyledTableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {t('Total Expenses')}
                    </Typography>
                  </StyledTableCell>
                  {tableData.debits?.map((credit, idx) => {
                    return (
                      <StyledTableCell key={`${idx}-${credit}`} align="right">
                        <Typography fontWeight="bold">
                          {numberFormat(credit, locale)}
                        </Typography>
                      </StyledTableCell>
                    );
                  })}
                </TableRow>

                {/* Surplus */}
                <TableRow>
                  <StyledTableCell>
                    <Typography variant="body1" fontStyle="italic">
                      {t('Surplus/Deficit')}
                    </Typography>
                  </StyledTableCell>
                  {tableData.surplus?.map((value, idx) => {
                    return (
                      <StyledTableCell key={`${idx}-${value}`} align="right">
                        <Typography fontStyle="italic">
                          {numberFormat(value, locale)}
                        </Typography>
                      </StyledTableCell>
                    );
                  })}
                </TableRow>

                {/* Closing Balance */}
                <TableRow
                  sx={{ background: theme.palette.action.disabledBackground }}
                >
                  <StyledTableCell>
                    <Typography variant="body1" fontWeight="bold">
                      {t('Balance')}
                    </Typography>
                  </StyledTableCell>
                  {tableData.closingBalances?.map((balance, idx) => {
                    return (
                      <StyledTableCell key={`${idx}-${balance}`} align="right">
                        <Typography fontWeight="bold">
                          {numberFormat(balance, locale)}
                        </Typography>
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </>
  );
};
