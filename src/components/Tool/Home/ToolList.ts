import {
  mdiTrophy,
  mdiGoogle,
  mdiTable,
  mdiCloudUpload,
  mdiCurrencyUsd,
  mdiEmail,
  mdiMap,
  mdiPhone,
  mdiNewspaperVariantOutline,
  mdiHome,
  mdiAccountGroup,
  mdiWrench,
} from '@mdi/js';
import i18n from 'i18next';

export const ToolsList = [
  {
    groupName: i18n.t('Appeals'),
    groupIcon: mdiWrench,
    items: [
      {
        tool: i18n.t('Appeals'),
        desc: i18n.t(
          'Set goals, create asks, and track progress for one-time needs',
        ),
        icon: mdiTrophy,
        id: 'appeals',
      },
    ],
  },
  {
    groupName: i18n.t('Contacts'),
    groupIcon: mdiHome,
    items: [
      {
        tool: i18n.t('Fix Commitment Info'),
        desc: i18n.t(
          'Set the correct contacts commitment info for each contact',
        ),
        icon: mdiCurrencyUsd,
        id: 'fixCommitmentInfo',
      },
      {
        tool: i18n.t('Fix Mailing Addresses'),
        desc: i18n.t(
          'Set the correct primary mailing address for each contact',
        ),
        icon: mdiMap,
        id: 'fixMailingAddresses',
      },
      {
        tool: i18n.t('Fix Send Newsletter'),
        desc: i18n.t('Set the correct newsletter state for each contact'),
        icon: mdiNewspaperVariantOutline,
        id: 'fixSendNewsletter',
      },
      {
        tool: i18n.t('Merge Contacts'),
        desc: i18n.t('Review and merge duplicate contacts'),
        icon: mdiHome,
        id: 'mergeContacts',
      },
    ],
  },
  {
    groupName: i18n.t('People'),
    groupIcon: mdiAccountGroup,
    items: [
      {
        tool: i18n.t('Fix Email Addresses'),
        desc: i18n.t('Set the correct primary email address for each person'),
        icon: mdiEmail,
        id: 'fixEmailAddresses',
      },
      {
        tool: i18n.t('Fix Phone Numbers'),
        desc: i18n.t('Set the correct primary phone number for each person'),
        icon: mdiPhone,
        id: 'fixPhoneNumbers',
      },
      {
        tool: i18n.t('Merge People'),
        desc: i18n.t('Review and merge duplicate people'),
        icon: mdiAccountGroup,
        id: 'mergePeople',
      },
    ],
  },
  {
    groupName: i18n.t('Imports'),
    groupIcon: mdiCloudUpload,
    items: [
      {
        tool: i18n.t('Import from Google'),
        desc: i18n.t(
          'Import your contact information from your Google account',
        ),
        icon: mdiGoogle,
        id: 'google',
      },

      {
        tool: i18n.t('Import from TntConnect'),
        desc: i18n.t('Import your contacts from your TntConnect database'),
        icon: mdiCloudUpload,
        id: 'tntConnect',
      },

      {
        tool: i18n.t('Import from CSV'),
        desc: i18n.t('Import contacts you have saved in a CSV file'),
        icon: mdiTable,
        id: 'csv',
      },
    ],
  },
];
