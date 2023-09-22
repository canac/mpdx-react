import React, { ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SettingsWrapper } from './wrapper';
import { suggestArticles } from 'src/lib/helpScout';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { AccordionGroup } from 'src/components/Shared/Forms/Accordions/AccordionGroup';
import { TheKeyAccordian } from 'src/components/Settings/integrations/Key/TheKeyAccordian';
import { OrganizationAccordian } from 'src/components/Settings/integrations/Organization/OrganizationAccordian';
import { GoogleAccordian } from 'src/components/Settings/integrations/Google/GoogleAccordian';
import { MailchimpAccordian } from 'src/components/Settings/integrations/Mailchimp/MailchimpAccordian';
import { PrayerlettersAccordian } from 'src/components/Settings/integrations/Prayerletters/PrayerlettersAccordian';
import { ChalklineAccordian } from 'src/components/Settings/integrations/Chalkline/ChalklineAccordian';

interface Props {
  apiToken: string;
  selectedTab: string;
}

export type IntegrationsContextType = {
  apiToken: string;
};
export const IntegrationsContext =
  React.createContext<IntegrationsContextType | null>(null);

interface IntegrationsContextProviderProps {
  children: React.ReactNode;
  apiToken: string;
}
export const IntegrationsContextProvider: React.FC<
  IntegrationsContextProviderProps
> = ({ children, apiToken }) => {
  return (
    <IntegrationsContext.Provider value={{ apiToken }}>
      {children}
    </IntegrationsContext.Provider>
  );
};

const Integrations = ({ apiToken, selectedTab }: Props): ReactElement => {
  const { t } = useTranslation();
  const [expandedPanel, setExpandedPanel] = useState('');

  useEffect(() => {
    suggestArticles('HS_SETTINGS_SERVICES_SUGGESTIONS');
    setExpandedPanel(selectedTab);
  }, []);

  const handleAccordionChange = (panel: string) => {
    const panelLowercase = panel.toLowerCase();
    setExpandedPanel(expandedPanel === panelLowercase ? '' : panelLowercase);
  };

  return (
    <SettingsWrapper
      pageTitle={t('Connect Services')}
      pageHeading={t('Connect Services')}
      selectedMenuId="integrations"
    >
      <IntegrationsContextProvider apiToken={apiToken}>
        <AccordionGroup title="">
          <TheKeyAccordian
            handleAccordionChange={handleAccordionChange}
            expandedPanel={expandedPanel}
          />
          <OrganizationAccordian
            handleAccordionChange={handleAccordionChange}
            expandedPanel={expandedPanel}
          />
        </AccordionGroup>
        <AccordionGroup title={t('External Services')}>
          <GoogleAccordian
            handleAccordionChange={handleAccordionChange}
            expandedPanel={expandedPanel}
          />
          <MailchimpAccordian
            handleAccordionChange={handleAccordionChange}
            expandedPanel={expandedPanel}
          />
          <PrayerlettersAccordian
            handleAccordionChange={handleAccordionChange}
            expandedPanel={expandedPanel}
          />
          <ChalklineAccordian
            handleAccordionChange={handleAccordionChange}
            expandedPanel={expandedPanel}
          />
        </AccordionGroup>
      </IntegrationsContextProvider>
    </SettingsWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const session = await getSession({ req });
  const apiToken = session?.user?.apiToken ?? null;
  const selectedTab = query?.selectedTab ?? '';

  return {
    props: {
      apiToken,
      selectedTab,
    },
  };
};

export default Integrations;