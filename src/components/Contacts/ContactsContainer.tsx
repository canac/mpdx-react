import { Box, styled } from '@material-ui/core';
import React, { useContext } from 'react';
import Head from 'next/head';
import { useTranslation } from 'react-i18next';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import _ from 'lodash';
// import { SidePanelsLayout } from '../Layouts/SidePanelsLayout';
import clsx from 'clsx';
import {
  ContactsPageContext,
  ContactsPageType,
} from '../../../pages/accountLists/[accountListId]/contacts/ContactsPageContext';
import { TableViewModeEnum } from '../Shared/Header/ListHeader';
import Loading from '../Loading';
import { ContactsMainPanel } from './ContactsMainPanel/ContactsMainPanel';
import { ContactsLeftPanel } from './ContactsLeftPanel/ContactsLeftPanel';
import { ContactsRightPanel } from './ContactsRightPanel/ContactsRightPanel';
import { ContactFlowDragLayer } from './ContactFlow/ContactFlowDragLayer/ContactFlowDragLayer';

const WhiteBackground = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
}));

const OuterWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflowX: 'hidden',
  '& > div': {
    height: '100%',
  },
  '& .left, & .right': {
    position: 'absolute',
    top: 0,
    transition: 'left ease-in-out 225ms',
    backgroundColor: theme.palette.common.white,
    borderColor: '#EBECEC',
    borderStyle: 'solid',
  },
  '&.leftOpen .left, &.rightOpen .right': {
    left: 0,
  },
  '&.rightOpen .right': {
    [theme.breakpoints.up('md')]: {
      left: 'calc(100% - 900px)',
    },
  },
}));

const LeftWrapper = styled(Box)(() => ({
  zIndex: 30,
  left: '-290px',
  width: '290px',
  borderWidth: '0 1px 0 0',
}));

const RightWrapper = styled(Box)(({ theme }) => ({
  zIndex: 20,
  width: '100%',
  left: '100%',
  [theme.breakpoints.up('md')]: {
    width: '900px',
    borderWidth: '0 0 0 1px',
  },
}));

export const ContactsContainer: React.FC = ({}) => {
  const { t } = useTranslation();
  const {
    accountListId,
    filterPanelOpen,
    contactDetailsOpen,
    viewMode,
    setContactFocus,
  } = useContext(ContactsPageContext) as ContactsPageType;

  return (
    <>
      <Head>
        <title>
          MPDX |{' '}
          {viewMode === TableViewModeEnum.Flows
            ? t('Contact Flows')
            : viewMode === TableViewModeEnum.Map
            ? t('Contacts Map')
            : t('Contacts')}
        </title>
      </Head>
      {accountListId ? (
        <DndProvider backend={HTML5Backend}>
          <ContactFlowDragLayer />
          <WhiteBackground>
            <OuterWrapper
              className={clsx(
                filterPanelOpen && 'leftOpen',
                contactDetailsOpen && 'rightOpen',
              )}
            >
              <LeftWrapper className="left">
                <ContactsLeftPanel />
              </LeftWrapper>
              <Box className="center">
                <ContactsMainPanel />
              </Box>
              <RightWrapper className="right">
                <ContactsRightPanel
                  onClose={() =>
                    setContactFocus(
                      undefined,
                      true,
                      viewMode === TableViewModeEnum.Flows,
                      viewMode === TableViewModeEnum.Map,
                    )
                  }
                />
              </RightWrapper>
            </OuterWrapper>
            {/* <SidePanelsLayout
              leftPanel={<ContactsLeftPanel />}
              leftOpen={filterPanelOpen}
              leftWidth="290px"
              mainContent={<ContactsMainPanel />}
              rightPanel={
                <ContactsRightPanel
                  onClose={() =>
                    setContactFocus(
                      undefined,
                      true,
                      viewMode === TableViewModeEnum.Flows,
                      viewMode === TableViewModeEnum.Map,
                    )
                  }
                />
              }
              rightOpen={contactDetailsOpen}
              rightWidth="60%"
            /> */}
          </WhiteBackground>
        </DndProvider>
      ) : (
        <Loading loading />
      )}
    </>
  );
};
