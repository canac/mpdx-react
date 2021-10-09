import React from 'react';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@material-ui/core';
import { ItemContent } from 'react-virtuoso';
import { GqlMockedProvider } from '../../../../__tests__/util/graphqlMocking';
import TestRouter from '../../../../__tests__/util/TestRouter';
import theme from '../../../../src/theme';
import Tasks from './[[...contactId]].page';
import { TasksQuery } from './Tasks.generated';

const accountListId = 'account-list-1';

const router = {
  query: { accountListId },
  isReady: true,
};

const task = {
  id: '1',
  subject: 'Test Subject',
  contacts: { nodes: [{ id: '2', name: 'Test Person' }] },
};

jest.mock('react-virtuoso', () => ({
  // eslint-disable-next-line react/display-name
  Virtuoso: ({
    data,
    itemContent,
  }: {
    data: TasksQuery['tasks']['nodes'];
    itemContent: ItemContent<TasksQuery['tasks']['nodes'][0]>;
  }) => {
    return (
      <div>{data.map((contact, index) => itemContent(index, contact))}</div>
    );
  },
}));

it('should render list of tasks', async () => {
  const { getByText } = render(
    <ThemeProvider theme={theme}>
      <TestRouter router={router}>
        <GqlMockedProvider<TasksQuery>
          mocks={{
            Tasks: {
              tasks: {
                nodes: [task],
                pageInfo: { endCursor: 'Mg', hasNextPage: false },
              },
            },
          }}
        >
          <Tasks />
        </GqlMockedProvider>
      </TestRouter>
    </ThemeProvider>,
  );
  await waitFor(() => expect(getByText('Test Person')).toBeInTheDocument());
  await waitFor(() => expect(getByText('Test Subject')).toBeInTheDocument());
});

it('should render contact detail panel', async () => {
  const { findAllByRole, getByText } = render(
    <ThemeProvider theme={theme}>
      <TestRouter router={router}>
        <GqlMockedProvider<TasksQuery>
          mocks={{
            Tasks: {
              tasks: {
                nodes: [task],
                pageInfo: { endCursor: 'Mg', hasNextPage: false },
              },
            },
          }}
        >
          <Tasks />
        </GqlMockedProvider>
      </TestRouter>
    </ThemeProvider>,
  );
  await waitFor(() => expect(getByText('Test Subject')).toBeInTheDocument());
  const row = await getByText('Test Person');

  userEvent.click(row);

  const detailsTabList = (await findAllByRole('tablist'))[0];

  expect(detailsTabList).toBeInTheDocument();
});