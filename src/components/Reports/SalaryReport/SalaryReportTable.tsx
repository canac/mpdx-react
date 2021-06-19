/* eslint-disable import/no-unresolved */
import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import clsx from 'clsx';
import {
  Box,
  Button,
  ButtonGroup,
  colors,
  Grid,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import CodeIcon from '@material-ui/icons/Code';
import PrintIcon from '@material-ui/icons/Print';
import { CSVLink } from 'react-csv';
import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import {
  FourteenMonthReportContact,
  FourteenMonthReportCurrencyType,
  // eslint-disable-next-line import/extensions
} from 'graphql/types.generated';
// eslint-disable-next-line import/extensions
import { useFourteenMonthReportQuery } from 'pages/accountLists/[accountListId]/reports/graphql/GetReportFourteenMonth.generated';

interface Props {
  className?: string;
  accountListId: string;
  title: string;
}

const useStyles = makeStyles(() => ({
  root: {},
  downloadCsv: {
    color: 'inherit',
    textDecoration: 'none',
  },
}));

export const SalaryReportTable: React.FC<Props> = ({
  className,
  accountListId,
  title,
  ...rest
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<FourteenMonthReportContact[]>([]);

  const { data, loading, error } = useFourteenMonthReportQuery({
    variables: {
      accountListId,
      currencyType: FourteenMonthReportCurrencyType.Salary,
    },
  });

  const salaryCurrency = data?.fourteenMonthReport.salaryCurrency;
  const currencyGroups = data?.fourteenMonthReport.currencyGroups;

  useEffect(() => {
    if (currencyGroups) {
      setContacts(
        currencyGroups.flatMap((currencyGroup) => [...currencyGroup.contacts]),
      );
    }
  }, [currencyGroups]);

  const renderLoading = () => (
    <TableRow>
      <TableCell colSpan={16}>
        <Box
          height="100%"
          alignItems="center"
          justifyContent="center"
          bgcolor={colors.green[600]}
        >
          Loading
        </Box>
      </TableCell>
    </TableRow>
  );

  const renderEmpty = () => (
    <TableRow>
      <TableCell colSpan={16}>No Data</TableCell>
    </TableRow>
  );

  const renderError = () => (
    <TableRow>
      <TableCell colSpan={16}>
        <Box bgcolor={colors.red[600]}>Error: {error?.toString()}</Box>
      </TableCell>
    </TableRow>
  );

  return (
    <Box>
      <Box my={2}>
        <Grid
          container
          justify="space-between"
          className={clsx(classes.root, className)}
          {...rest}
        >
          <Grid item>
            <Typography variant="h5">{t(title)}</Typography>
          </Grid>
          <Grid item>
            <ButtonGroup aria-label="report header button group">
              <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <CodeIcon />
                  </SvgIcon>
                }
              >
                {t('Expand Partner Info')}
              </Button>
              <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <GetAppIcon />
                  </SvgIcon>
                }
              >
                <CSVLink
                  data={contacts}
                  filename={`mpdx-salary-contributions-export-${DateTime.now().toISODate()}.csv`}
                  className={classes.downloadCsv}
                >
                  {t('Export')}
                </CSVLink>
              </Button>
              <Button
                startIcon={
                  <SvgIcon fontSize="small">
                    <PrintIcon />
                  </SvgIcon>
                }
              >
                {t('Print')}
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">{salaryCurrency}</Typography>
              </TableCell>
              {currencyGroups?.map((currencyGroup) => {
                const allYears = currencyGroup.totals.months.map(
                  (month) => month.month.split('-')[0],
                );
                const monthCount = allYears.reduce<{ [key: string]: number }>(
                  (count, year) => ({
                    ...count,
                    [year]: (count[year] || 0) + 1,
                  }),
                  {},
                );

                return Object.entries(monthCount).map(([year, count]) => (
                  <TableCell key={year} colSpan={count} align="center">
                    <Typography variant="h6">{year}</Typography>
                  </TableCell>
                ));
              })}
              <TableCell />
            </TableRow>
            <TableRow>
              <TableCell>{t('Partner')}</TableCell>
              {currencyGroups?.map((currencyGroup) =>
                currencyGroup.totals.months.map((month) => (
                  <TableCell key={month.month} align="center">
                    {DateTime.fromISO(month.month).toFormat('LLL')}
                  </TableCell>
                )),
              )}
              <TableCell align="right">{t('Total')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {error && renderError()}
            {loading
              ? renderLoading()
              : !(currencyGroups?.length === 0)
              ? renderEmpty()
              : contacts.map((contact) => (
                  <TableRow key={contact.id} hover>
                    <TableCell>{contact.name}</TableCell>
                    {contact.months?.map((month) => (
                      <TableCell key={month.month} align="center">
                        {Math.round(month.salaryCurrencyTotal)}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <strong>{Math.round(contact.total)}</strong>
                    </TableCell>
                  </TableRow>
                ))}
            {!loading && currencyGroups && currencyGroups.length > 0 && (
              <TableRow>
                <TableCell>{t('Totals')}</TableCell>
                {currencyGroups?.map((currencyGroup) =>
                  currencyGroup.totals.months.map((month) => (
                    <TableCell key={month.month} align="center">
                      {Math.round(month.total)}
                    </TableCell>
                  )),
                )}
                <TableCell align="right" />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
