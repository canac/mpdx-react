import React, { ReactElement } from 'react';
import { Box, Container } from '@material-ui/core';
import { MockedProvider } from '@apollo/client/testing';
import withDispatch from '../../../../decorators/withDispatch';
import { getNotificationsMocks } from './Items/NotificationMenu/NotificationMenu.mock';
import { getTopBarMock } from './TopBar.mock';
import TopBar from './TopBar';

export default {
  title: 'Layouts/Primary/TopBar',
  decorators: [
    withDispatch({ type: 'updateAccountListId', accountListId: '1' }),
  ],
};

const Content = (): ReactElement => (
  <>
    <Box style={{ backgroundColor: '#05699b' }} py={10}></Box>
    <Container>
      <Box my={2}>
        {[...new Array(50)]
          .map(
            () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
          )
          .join('\n')}
      </Box>
    </Container>
  </>
);

export const Default = (): ReactElement => {
  const mocks = [getTopBarMock(), ...getNotificationsMocks()];

  return (
    <>
      <MockedProvider mocks={mocks} addTypename={false}>
        <TopBar />
      </MockedProvider>
      <Content />
    </>
  );
};
