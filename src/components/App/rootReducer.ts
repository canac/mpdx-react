import { Reducer } from 'react';
import { User } from '../../../graphql/types.generated';

export interface AppState {
  accountListId?: string;
  breadcrumb?: string;
  user?: User;
}

export type Action =
  | UpdateAccountListIdAction
  | UpdateBreadcrumbAction
  | UpdateUserAction;

type UpdateAccountListIdAction = {
  type: 'updateAccountListId';
  accountListId: string;
};

type UpdateBreadcrumbAction = {
  type: 'updateBreadcrumb';
  breadcrumb: string;
};

type UpdateUserAction = {
  type: 'updateUser';
  user: User;
};

const rootReducer: Reducer<AppState, Action> = (state, action) => {
  switch (action.type) {
    case 'updateAccountListId':
      return { ...state, accountListId: action.accountListId };
    case 'updateBreadcrumb':
      return { ...state, breadcrumb: action.breadcrumb };
    case 'updateUser':
      return { ...state, user: action.user };
  }
};

export default rootReducer;
