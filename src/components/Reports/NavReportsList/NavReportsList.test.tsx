import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { NavReportsList } from './NavReportsList';
import TestRouter from '__tests__/util/TestRouter';
import { GqlMockedProvider } from '__tests__/util/graphqlMocking';
import theme from 'src/theme';

const accountListId = 'account-list-1';
const selected = 'salaryCurrency';

const router = {
  query: { accountListId },
  isReady: true,
};

describe('NavReportsList', () => {
  it('default', async () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <TestRouter router={router}>
          <GqlMockedProvider>
            <NavReportsList
              selectedId={selected}
              isOpen={true}
              onClose={() => {}}
            />
          </GqlMockedProvider>
        </TestRouter>
      </ThemeProvider>,
    );

    expect(getByText('Donations')).toBeInTheDocument();
    expect(getByText('14 Month Partner Report')).toBeInTheDocument();
    expect(getByText('14 Month Salary Report')).toBeInTheDocument();
    expect(getByText('Designation Accounts')).toBeInTheDocument();
    expect(getByText('Responsibility Centers')).toBeInTheDocument();
    expect(getByText('Expected Monthly Total')).toBeInTheDocument();
    expect(getByText('Partner Giving Analysis')).toBeInTheDocument();
    expect(getByText('Coaching')).toBeInTheDocument();
  });
});
