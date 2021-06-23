import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@material-ui/core';
import { ExpectedMonthlyTotalReportHeader } from './Header/ExpectedMonthlyTotalReportHeader';
import {
  ExpectedMonthlyTotalReportTable,
  Contact,
} from './Table/ExpectedMonthlyTotalReportTable';
import { ExpectedMonthlyTotalReportEmpty } from './Empty/ExpectedMonthlyTotalReportEmpty';

interface Props {
  accountListId: string;
  data: Contact[];
}

export const ExpectedMonthlyTotalReport: React.FC<Props> = ({ data }) => {
  const { t } = useTranslation();

  const isEmpty = data.length === 0;

  return (
    <Box>
      <ExpectedMonthlyTotalReportHeader empty={isEmpty} />
      {!isEmpty ? (
        <>
          <ExpectedMonthlyTotalReportTable
            title={t('Donations So Far This Month')}
            data={data}
            donations={true}
          />
          <ExpectedMonthlyTotalReportTable
            title={t('Likely Partners This Month')}
            data={data}
            donations={false}
          />
          <ExpectedMonthlyTotalReportTable
            title={t('Possible Partners This Month')}
            data={data}
            donations={false}
          />
        </>
      ) : (
        <ExpectedMonthlyTotalReportEmpty />
      )}
    </Box>
  );
};