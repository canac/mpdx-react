import React, { ReactElement } from 'react';
import { ResultEnum } from '../../../../../../graphql/types.generated';
import { gqlMock } from '../../../../../../__tests__/util/graphqlMocking';
import { ContactTaskRow } from './ContactTaskRow';
import {
  ContactTaskRowFragment,
  ContactTaskRowFragmentDoc,
} from './ContactTaskRow.generated';

export default {
  title: 'Contacts/Tab/ContactTasksTab/Row',
  component: ContactTaskRow,
};

const accountListId = 'abc';
const startAt = '2021-04-12';
const lateStartAt = '2019-10-12';

export const Default = (): ReactElement => {
  const task = gqlMock<ContactTaskRowFragment>(ContactTaskRowFragmentDoc, {
    mocks: {
      startAt,
      result: ResultEnum.None,
    },
  });

  return <ContactTaskRow accountListId={accountListId} task={task} />;
};

export const Loading = (): ReactElement => {
  return <ContactTaskRow accountListId={accountListId} task={undefined} />;
};

export const Complete = (): ReactElement => {
  const task = gqlMock<ContactTaskRowFragment>(ContactTaskRowFragmentDoc, {
    mocks: {
      startAt,
      result: ResultEnum.Completed,
    },
  });

  return <ContactTaskRow accountListId={accountListId} task={task} />;
};

export const Late = (): ReactElement => {
  const task = gqlMock<ContactTaskRowFragment>(ContactTaskRowFragmentDoc, {
    mocks: {
      startAt: lateStartAt,
      result: ResultEnum.None,
    },
  });

  return <ContactTaskRow accountListId={accountListId} task={task} />;
};
