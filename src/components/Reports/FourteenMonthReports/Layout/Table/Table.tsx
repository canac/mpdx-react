import React, { FC, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import theme from 'src/theme';
import InfoIcon from '@mui/icons-material/Info';
import { numberFormat } from '../../../../../lib/intlFormat';
import { useApiConstants } from '../../../../Constants/UseApiConstants';
import {
  FourteenMonthReportTableHead as TableHead,
  FourteenMonthReportTableHeadProps as TableHeadProps,
} from './TableHead/TableHead';
import type { Contact, Month } from './TableHead/TableHead';

interface FourteenMonthReportTableProps extends TableHeadProps {
  isExpanded: boolean;
  orderedContacts: Contact[] | undefined;
  currencyType;
  ref: React.Ref<HTMLTableElement>;
}

const NameTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})(({ expanded }: { expanded: boolean }) => ({
  marginLeft: expanded ? 0 : theme.spacing(1),
}));

const PrintableContainer = styled(TableContainer)(() => ({
  // First style set size as landscape
  // ['@media print']: {
  //   ['@page']: { size: 'landscape' },
  // },
  height: 'calc(100vh - 160px)',
}));

const StickyTable = styled(Table)(({}) => ({
  height: 'calc(100vh - 96px)',
}));

export const FourteenMonthReportTable: FC<FourteenMonthReportTableProps> =
  // eslint-disable-next-line react/display-name
  forwardRef(
    (
      {
        isExpanded,
        order,
        orderBy,
        orderedContacts,
        onRequestSort,
        salaryCurrency,
        totals,
        currencyType,
      },
      ref,
    ) => {
      const { t } = useTranslation();
      const apiConstants = useApiConstants();

      return (
        <PrintableContainer ref={ref}>
          <StickyTable
            stickyHeader={true}
            aria-label="fourteen month report table"
            data-testid="FourteenMonthReport"
          >
            <TableHead
              isExpanded={isExpanded}
              salaryCurrency={salaryCurrency}
              totals={totals}
              order={order}
              orderBy={orderBy}
              onRequestSort={onRequestSort}
            />
            <TableBody>
              {orderedContacts?.map((contact) => (
                <TableRow
                  key={contact.id}
                  hover
                  data-testid="FourteenMonthReportTableRow"
                >
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Box display="flex" alignItems="center">
                        {!isExpanded && <InfoIcon fontSize="small" />}
                        <NameTypography variant="body1" expanded={isExpanded}>
                          {contact.name}
                        </NameTypography>
                      </Box>
                      {isExpanded && (
                        <Typography variant="body2" color="textSecondary">
                          {contact.accountNumbers.join(', ')}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  {isExpanded && (
                    <React.Fragment>
                      <TableCell>{contact.status}</TableCell>
                      <TableCell>
                        {contact.pledgeAmount &&
                          `${numberFormat(Math.round(contact.pledgeAmount))} ${
                            contact.pledgeCurrency
                          } ${
                            apiConstants?.pledgeFrequencies?.find(
                              ({ key }) => key === contact.pledgeFrequency,
                            )?.value ?? ''
                          }`}
                      </TableCell>
                      <TableCell>
                        {numberFormat(Math.round(contact.average))}
                      </TableCell>
                      <TableCell>
                        {numberFormat(Math.round(contact.minimum))}
                      </TableCell>
                    </React.Fragment>
                  )}
                  {contact.months?.map((month: Month) => (
                    <TableCell key={month?.month} align="center">
                      {month?.salaryCurrencyTotal && (
                        <>
                          {numberFormat(
                            currencyType === 'salary'
                              ? Math.round(month?.total)
                              : month?.total,
                          )}
                        </>
                      )}
                    </TableCell>
                  ))}
                  <TableCell align="right">
                    <strong>{numberFormat(Math.round(contact.total))}</strong>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <strong>{t('Totals')}</strong>
                </TableCell>
                {totals?.months?.map((month) => (
                  <TableCell key={month.month} align="center">
                    <strong>{numberFormat(month.total)}</strong>
                  </TableCell>
                ))}
                <TableCell align="right">
                  <strong>
                    {numberFormat(
                      Math.round(
                        totals?.months?.reduce(
                          (sum, month) => sum + month.total,
                          0,
                        ) ?? 0,
                      ),
                    )}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </StickyTable>
        </PrintableContainer>
      );
    },
  );
