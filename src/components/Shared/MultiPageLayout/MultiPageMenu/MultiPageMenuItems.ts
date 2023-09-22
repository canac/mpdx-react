export type NavItems = {
  id: string;
  title: string;
  subTitle?: string;
  grantedAccess?: string[];
  subItems?: NavItems[];
};

export const ReportNavItems: NavItems[] = [
  {
    id: 'donations',
    title: 'Donations',
  },
  {
    id: 'partnerCurrency',
    title: '14 Month Partner Report',
    subTitle: 'Partner Currency',
  },
  {
    id: 'salaryCurrency',
    title: '14 Month Salary Report',
    subTitle: 'Salary Currency',
  },
  {
    id: 'designationAccounts',
    title: 'Designation Accounts',
  },
  {
    id: 'responsibilityCenters',
    title: 'Responsibility Centers',
  },
  {
    id: 'expectedMonthlyTotal',
    title: 'Expected Monthly Total',
  },
  {
    id: 'partnerGivingAnalysis',
    title: 'Partner Giving Analysis',
  },
  {
    id: 'coaching',
    title: 'Coaching',
  },
];

export const SettingsNavItems: NavItems[] = [
  {
    id: 'preferences',
    title: 'Preferences',
  },
  {
    id: 'notifications',
    title: 'Notifications',
  },
  {
    id: 'integrations',
    title: 'Connect Services',
  },
  {
    id: 'manageAccounts',
    title: 'Manage Accounts',
  },
  {
    id: 'manageCoaches',
    title: 'Manage Coaches',
  },
  {
    id: 'organizations',
    title: 'Manage Organizations',
    grantedAccess: ['admin'],
    subItems: [
      {
        id: 'organizations',
        title: 'Impersonate & Share',
        grantedAccess: ['admin'],
      },
      {
        id: 'organizations/accountLists',
        title: 'Account Lists',
        grantedAccess: ['admin'],
      },
      {
        id: 'organizations/contacts',
        title: 'Contacts',
        grantedAccess: ['admin'],
      },
    ],
  },
  {
    id: 'adminConsole',
    title: 'Admin Console',
    grantedAccess: ['admin', 'developer'],
  },
  {
    id: 'backendAdmin',
    title: 'Backend Admin',
    grantedAccess: ['developer'],
  },
  {
    id: 'sidekiq',
    title: 'Sidekiq',
    grantedAccess: ['developer'],
  },
];