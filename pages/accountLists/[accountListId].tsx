import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head';
import { useApolloClient, gql } from '@apollo/client';
import { GetServerSideProps } from 'next';
import moment from 'moment';
import { getSession, setOptions } from 'next-auth/client';
import Dashboard from '../../src/components/Dashboard';
import { GetDashboardQuery } from '../../types/GetDashboardQuery';
import { ssrClient } from '../../src/lib/client';
import GET_LOCAL_STATE_QUERY from '../../src/queries/getLocalStateQuery.graphql';

export const GET_DASHBOARD_QUERY = gql`
    query GetDashboardQuery($accountListId: ID!) {
        user {
            firstName
        }
        accountList(id: $accountListId) {
            name
            monthlyGoal
            receivedPledges
            committed
            currency
            balance
        }
        reportsDonationHistories(accountListId: $accountListId) {
            averageIgnoreCurrent
            periods {
                startDate
                convertedTotal
                totals {
                    currency
                    convertedAmount
                }
            }
        }
    }
`;

interface Props {
    data: GetDashboardQuery;
    accountListId: string;
}

const AccountListIdPage = ({ data, accountListId }: Props): ReactElement => {
    const client = useApolloClient();

    useEffect(() => {
        client.writeQuery({
            query: GET_LOCAL_STATE_QUERY,
            data: { currentAccountListId: accountListId, breadcrumb: 'Dashboard' },
        });
    });

    return (
        <>
            <Head>
                <title>MPDX | {data.accountList.name}</title>
            </Head>
            <Dashboard data={data} accountListId={accountListId} />
        </>
    );
};

export const getServerSideProps: GetServerSideProps<Props> = async ({
    params,
    req,
    res,
}): Promise<{ props: Props }> => {
    setOptions({ site: process.env.SITE_URL });
    const session = await getSession({ req });

    if (!session?.user?.token) {
        res.writeHead(302, { Location: '/' });
        res.end();
        return null;
    }

    const client = await ssrClient(session?.user?.token);
    const response = await client.query<GetDashboardQuery>({
        query: GET_DASHBOARD_QUERY,
        variables: {
            accountListId: params.accountListId,
            endOfDay: moment().endOf('day').toISOString(),
            today: moment().endOf('day').toISOString().slice(0, 10),
            twoWeeksFromNow: moment().endOf('day').add(2, 'weeks').toISOString().slice(0, 10),
        },
    });

    return {
        props: { data: response.data, accountListId: params.accountListId.toString() },
    };
};

export default AccountListIdPage;
