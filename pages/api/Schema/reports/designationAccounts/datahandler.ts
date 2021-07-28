import {
  DesignationAccount,
  DesignationAccountsGroup,
  SetActiveDesignationAccountResponse,
} from '../../../graphql-rest.page.generated';

export interface DesignationAccountsResponse {
  id: string;
  type: string;
  attributes: {
    active: true;
    balance: string;
    balance_updated_at: string;
    converted_balance: number;
    created_at: string;
    currency: string;
    currency_symbol: string;
    designation_number: string;
    display_name: string;
    exchange_rate: number;
    legacy_designation_number: null;
    name: string;
    organization_name: string;
    updated_at: string | null;
    updated_in_db_at: string | null;
  };
  relationships: {
    organization: {
      data: {
        id: string;
        type: 'organizations';
      };
    };
    balances: {
      data: [
        {
          id: string;
          type: 'balances';
        },
      ];
    };
  };
}

type PreDesignationAccountsGroup = {
  [organizationName: string]: DesignationAccount[];
};

const createDesignationAccount = (
  account: DesignationAccountsResponse,
): DesignationAccount => ({
  active: account.attributes.active,
  balanceUpdatedAt: account.attributes.balance_updated_at,
  currency: account.attributes.currency,
  designationNumber: account.attributes.designation_number,
  id: account.id,
  name: account.attributes.name,
  convertedBalance: account.attributes.converted_balance,
});

export const createDesignationAccountsGroup = (
  data: DesignationAccountsResponse[],
): DesignationAccountsGroup[] => {
  const preDesignationAccountsGroup = data.reduce<PreDesignationAccountsGroup>(
    (obj, item) => {
      return {
        ...obj,
        [item.attributes.organization_name]: [
          ...(obj[item.attributes.organization_name] || []),
          createDesignationAccount(item),
        ],
      };
    },
    {},
  );

  const designationAccountsGroup = Object.entries(
    preDesignationAccountsGroup,
  ).map(([organizationName, designationAccounts]) => ({
    organizationName,
    balance: getGroupBalance(designationAccounts),
    designationAccounts,
  }));

  return designationAccountsGroup;
};

const getGroupBalance = (designationAccounts: DesignationAccount[]) => {
  return designationAccounts.reduce(
    (total, designationAccount) => total + designationAccount.convertedBalance,
    0,
  );
};

export const setActiveDesignationAccount = (
  data: DesignationAccountsResponse,
): SetActiveDesignationAccountResponse => ({
  active: data.attributes.active,
  id: data.id,
});
