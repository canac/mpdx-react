import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  afterTestResizeObserver,
  beforeTestResizeObserver,
} from '__tests__/util/windowResizeObserver';
import theme from 'src/theme';
import { AccountListItem as ListItem } from './ListItem';

const onCheckToggle = jest.fn();

const account = {
  active: false,
  id: 'test-id-111',
  balance: 3500,
  code: '32111',
  currency: 'CAD',
  lastSyncDate: '2021-02-02',
  name: 'Test Account',
};

describe('AccountItem', () => {
  it('default', async () => {
    const { getByRole, getByText } = render(
      <ThemeProvider theme={theme}>
        <ListItem account={account} onCheckToggle={onCheckToggle} />
      </ThemeProvider>,
    );

    expect(getByRole('checkbox')).not.toBeChecked();
    expect(getByText(account.name)).toBeInTheDocument();
  });

  it('should be check event called', async () => {
    const { getByRole } = render(
      <ThemeProvider theme={theme}>
        <ListItem account={account} onCheckToggle={onCheckToggle} />
      </ThemeProvider>,
    );

    userEvent.click(getByRole('checkbox'));
    expect(onCheckToggle).toHaveBeenCalled();
  });

  it('should not render chart', async () => {
    const { queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <ListItem account={account} onCheckToggle={onCheckToggle} />
      </ThemeProvider>,
    );

    expect(queryByTestId('AccountItemChart')).not.toBeInTheDocument();
  });

  describe('AccountItem Chart', () => {
    beforeEach(() => {
      beforeTestResizeObserver();
    });

    afterEach(() => {
      afterTestResizeObserver();
    });

    it('should render chart', async () => {
      const entryHistoriesMock = [
        {
          closingBalance: 123,
          endDate: '2021-08-29',
          id: 'test-id-1',
        },
      ];

      const { queryByTestId } = render(
        <ThemeProvider theme={theme}>
          <ListItem
            account={{
              ...account,
              active: true,
              entryHistories: entryHistoriesMock,
            }}
            onCheckToggle={onCheckToggle}
          />
        </ThemeProvider>,
      );

      expect(queryByTestId('AccountItemChart')).toBeInTheDocument();
    });
  });
});
