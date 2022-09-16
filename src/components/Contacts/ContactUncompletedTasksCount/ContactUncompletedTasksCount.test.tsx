import { MuiThemeProvider } from '@material-ui/core';
import { render } from '@testing-library/react';
import React from 'react';
import theme from '../../../theme';
import { ContactUncompletedTasksCount } from './ContactUncompletedTasksCount';

describe('ContactUncompletedTasksCount', () => {
  it('default', async () => {
    const { getByRole, getByText } = render(
      <MuiThemeProvider theme={theme}>
        <ContactUncompletedTasksCount
          uncompletedTasksCount={2}
          contactId="abc"
        />
      </MuiThemeProvider>,
    );

    const TaskCompletedIcon = getByRole('img', {
      name: 'Log Task',
    });

    expect(TaskCompletedIcon).toBeInTheDocument();
    expect(getByText('2')).toBeInTheDocument();
  });
});
