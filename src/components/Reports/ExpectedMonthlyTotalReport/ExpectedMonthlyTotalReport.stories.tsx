import React, { ReactElement } from 'react';
import { GetExpectedMonthlyTotalsQuery } from '../../../../pages/accountLists/[accountListId]/reports/GetExpectedMonthlyTotals.generated';
import { GqlMockedProvider } from '../../../../__tests__/util/graphqlMocking';
import { ExpectedMonthlyTotalReport } from './ExpectedMonthlyTotalReport';

export default {
  title: 'Reports/ExpectedMonthlyTotal',
};

const title = 'Expected Monthly Total';
const onNavListToggle = jest.fn();

export const Default = (): ReactElement => {
  return (
    <GqlMockedProvider<GetExpectedMonthlyTotalsQuery>>
      <ExpectedMonthlyTotalReport
        accountListId={'abc'}
        isNavListOpen={true}
        onNavListToggle={onNavListToggle}
        title={title}
      />
    </GqlMockedProvider>
  );
};

export const Empty = (): ReactElement => {
  const mocks = {
    GetExpectedMonthlyTotals: {
      expectedMonthlyTotalReport: {
        received: {
          donations: [],
        },
        likely: {
          donations: [],
        },
        unlikely: {
          donations: [],
        },
      },
    },
  };

  return (
    <GqlMockedProvider<GetExpectedMonthlyTotalsQuery> mocks={mocks}>
      <ExpectedMonthlyTotalReport
        accountListId={'abc'}
        isNavListOpen={true}
        onNavListToggle={onNavListToggle}
        title={title}
      />
    </GqlMockedProvider>
  );
};
