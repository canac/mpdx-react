import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FourteenMonthReportCurrencyType } from 'src/graphql/types.generated';
import theme from 'src/theme';
import { FourteenMonthReportActions } from './Actions';

const onExpandToggle = jest.fn();
const onPrint = jest.fn();

describe('FourteenMonthReportActions', () => {
  it('default', async () => {
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <FourteenMonthReportActions
          csvData={[]}
          currencyType={FourteenMonthReportCurrencyType.Salary}
          isExpanded={false}
          isMobile={true}
          onExpandToggle={onExpandToggle}
          onPrint={onPrint}
        />
      </ThemeProvider>,
    );

    expect(
      getByRole('group', { hidden: true, name: 'Report header button group' }),
    ).toBeInTheDocument();
    userEvent.click(getByRole('button', { hidden: true, name: 'Expand' }));
    userEvent.click(getByRole('button', { hidden: true, name: 'Print' }));
    userEvent.click(getByRole('button', { hidden: true, name: 'Export' }));
  });

  it('expand toggle event', async () => {
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <FourteenMonthReportActions
          csvData={[]}
          currencyType={FourteenMonthReportCurrencyType.Salary}
          isExpanded={true}
          isMobile={true}
          onExpandToggle={onExpandToggle}
          onPrint={onPrint}
        />
      </ThemeProvider>,
    );

    userEvent.click(getByRole('button', { hidden: true, name: 'Hide' }));
    expect(onExpandToggle).toHaveBeenCalled();
  });

  it('print event', async () => {
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <FourteenMonthReportActions
          csvData={[]}
          currencyType={FourteenMonthReportCurrencyType.Salary}
          isExpanded={true}
          isMobile={true}
          onExpandToggle={onExpandToggle}
          onPrint={onPrint}
        />
      </ThemeProvider>,
    );

    userEvent.click(getByRole('button', { hidden: true, name: 'Print' }));
    expect(onPrint).toHaveBeenCalled();
  });
});
