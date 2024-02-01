import { InMemoryCache } from '@apollo/client';
import generatedIntrospection from 'src/graphql/possibleTypes.generated';
import { relayStylePaginationWithNodes } from './relayStylePaginationWithNodes';

const ignoredKeyArgsForPagination = ['before', 'after'];
const paginationFieldPolicy = relayStylePaginationWithNodes((args) =>
  args
    ? Object.keys(args).filter(
        (arg) => !ignoredKeyArgsForPagination.includes(arg),
      )
    : undefined,
);

export const createCache = () =>
  new InMemoryCache({
    possibleTypes: generatedIntrospection.possibleTypes,
    typePolicies: {
      Appeal: {
        fields: {
          pledges: paginationFieldPolicy,
        },
        merge: true,
      },
      CoachingAppeal: {
        fields: {
          pledges: paginationFieldPolicy,
        },
        merge: true,
      },
      AccountList: {
        fields: {
          contacts: paginationFieldPolicy,
        },
        merge: true,
      },
      CoachingAccountList: {
        fields: {
          contacts: paginationFieldPolicy,
        },
        merge: true,
      },
      User: { merge: true },
      Contact: {
        fields: {
          contactReferralsByMe: paginationFieldPolicy,
        },
        merge: true,
      },
      // Disable cache normalization for tags because a tag like { id: 'abc', count: 3 } in one period should not be
      // merged with a tag like { id: 'def', count 2 } in another period
      Tag: { keyFields: false },
      Query: {
        fields: {
          contacts: paginationFieldPolicy,
          donations: paginationFieldPolicy,
          financialAccounts: paginationFieldPolicy,
          tasks: paginationFieldPolicy,
          userNotifications: paginationFieldPolicy,
        },
      },
    },
  });
