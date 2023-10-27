import React from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import { Link } from '@mui/material';
import { useGetUsersOrganizationsQuery } from './getOrganizationType.generated';

interface StaticBannerProps {
  severity?: 'error' | 'info' | 'success' | 'warning';
}

export const StaticBanner: React.FC<StaticBannerProps> = ({
  severity = 'warning',
}) => {
  const { t } = useTranslation();
  let showBanner = false;
  let non_cru_user = true;

  const { data, loading } = useGetUsersOrganizationsQuery();
  data?.userOrganizationAccounts.map((org) => {
    if (
      org.organization.organizationType === 'Cru-International' ||
      org.organization.organizationType === 'Cru'
    ) {
      non_cru_user = false;
    }
  });
  showBanner = !loading && non_cru_user;

  return !loading && showBanner ? (
    <Alert severity={severity}>
      {t(
        `Due to data privacy regulations and costs, Cru will no longer be able to host MPDX data for non-Cru/non-CCCI ministries. This means that MPDX will no longer be available for use outside of Cru/CCCI.  Your data in MPDX will be deleted if you don't export it from MPDX by January 31, 2024 or let us know why you might need an extension. For more information and to take action, `,
      )}
      <Link
        data-testid="nonCruOrgReminder"
        href="https://docs.google.com/document/d/18TnQGmshg71l3J9Gd-4ltjIjhK2PLtuG_Vc94bt6xzE/"
        target="_blank"
        rel="noreferrer"
      >
        {t('read this communication.')}
      </Link>
    </Alert>
  ) : null;
};
