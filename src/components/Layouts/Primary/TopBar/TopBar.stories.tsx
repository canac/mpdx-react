import React, { ReactElement } from 'react';
import { Box, Container } from '@material-ui/core';
import { MockedProvider } from '@apollo/client/testing';
import withDispatch from '../../../../decorators/withDispatch';
import { GET_TOP_BAR_QUERY } from './TopBar';
import TopBar from '.';

export default {
    title: 'Layouts/Primary/TopBar',
    decorators: [
        withDispatch(
            { type: 'updateAccountListId', accountListId: '1' },
            { type: 'updateBreadcrumb', breadcrumb: 'Dashboard' },
        ),
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
    const mocks = [
        {
            request: {
                query: GET_TOP_BAR_QUERY,
            },
            result: {
                data: {
                    accountLists: {
                        nodes: [{ id: '1', name: 'Staff Account' }],
                    },
                    user: { firstName: 'John' },
                },
            },
        },
    ];

    return (
        <>
            <MockedProvider mocks={mocks} addTypename={false}>
                <TopBar handleDrawerToggle={(): void => {}} />
            </MockedProvider>
            <Content />
        </>
    );
};

export const MultipleAccountLists = (): ReactElement => {
    const mocks = [
        {
            request: {
                query: GET_TOP_BAR_QUERY,
            },
            result: {
                data: {
                    accountLists: {
                        nodes: [
                            { id: '1', name: 'Staff Account' },
                            { id: '2', name: 'Ministry Account' },
                        ],
                    },
                    user: { firstName: 'John' },
                },
            },
        },
    ];

    return (
        <>
            <MockedProvider mocks={mocks} addTypename={false}>
                <TopBar handleDrawerToggle={(): void => {}} />
            </MockedProvider>
            <Content />
        </>
    );
};
