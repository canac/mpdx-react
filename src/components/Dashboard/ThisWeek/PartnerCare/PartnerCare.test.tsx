import React from 'react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@material-ui/core';
import {
  render,
  fireEvent,
} from '../../../../../__tests__/util/testingLibraryReactMock';
import { GetThisWeekQuery } from '../GetThisWeek.generated';
import { ActivityTypeEnum } from '../../../../../graphql/types.generated';
import theme from '../../../../theme';
import useTaskDrawer from '../../../../hooks/useTaskDrawer';
import PartnerCare from './PartnerCare';

jest.mock('../../../../hooks/useTaskDrawer');

const openTaskDrawer = jest.fn();

beforeEach(() => {
  (useTaskDrawer as jest.Mock).mockReturnValue({
    openTaskDrawer,
  });
});
const prayerRequestTasks: GetThisWeekQuery['prayerRequestTasks'] = {
  nodes: [
    {
      id: 'task_1',
      subject: 'the quick brown fox jumps over the lazy dog',
      activityType: ActivityTypeEnum.PrayerRequest,
      contacts: {
        nodes: [
          { hidden: true, name: 'Roger Smith' },
          { hidden: true, name: 'Sarah Smith' },
        ],
      },
      startAt: null,
      completedAt: null,
    },
    {
      id: 'task_2',
      subject: 'on the boat to see uncle johnny',
      activityType: ActivityTypeEnum.PrayerRequest,
      contacts: {
        nodes: [
          { hidden: true, name: 'Roger Parker' },
          { hidden: true, name: 'Sarah Parker' },
        ],
      },
      startAt: null,
      completedAt: null,
    },
  ],
  totalCount: 2560,
};
const personWithBirthday = {
  birthdayDay: 1,
  birthdayMonth: 1,
  firstName: 'John',
  lastName: 'Doe',
  parentContact: {
    id: 'contact',
    name: 'John and Sarah, Doe',
  },
};
const personWithAnniversary = {
  anniversaryDay: 5,
  anniversaryMonth: 10,
  parentContact: {
    id: 'contact',
    name: 'John and Sarah, Doe',
  },
};
const reportsPeopleWithBirthdays = {
  periods: [
    {
      people: [
        { ...personWithBirthday, id: 'person_1' },
        { ...personWithBirthday, id: 'person_2' },
      ],
    },
  ],
};
const reportsPeopleWithAnniversaries = {
  periods: [
    {
      people: [
        { ...personWithAnniversary, id: 'person_3' },
        { ...personWithAnniversary, id: 'person_4' },
      ],
    },
  ],
};

describe('PartnerCare', () => {
  it('default', () => {
    const { getByTestId, queryByTestId } = render(
      <PartnerCare accountListId="abc" />,
    );
    expect(
      getByTestId('PartnerCarePrayerCardContentEmpty'),
    ).toBeInTheDocument();
    expect(
      queryByTestId('PartnerCareCelebrationCardContentEmpty'),
    ).not.toBeInTheDocument();
    expect(getByTestId('PartnerCareTabPrayer').textContent).toEqual(
      'Prayer (0)',
    );
    const CelebrationsTab = getByTestId('PartnerCareTabCelebrations');
    expect(CelebrationsTab.textContent).toEqual('Celebrations (0)');
    fireEvent.click(CelebrationsTab);
    expect(
      getByTestId('PartnerCareCelebrationCardContentEmpty'),
    ).toBeInTheDocument();
    expect(
      queryByTestId('PartnerCarePrayerCardContentEmpty'),
    ).not.toBeInTheDocument();
  });

  it('loading', () => {
    const { getByTestId, queryByTestId } = render(
      <PartnerCare accountListId="abc" loading />,
    );
    expect(getByTestId('PartnerCarePrayerListLoading')).toBeInTheDocument();
    expect(
      queryByTestId('PartnerCareCelebrationListLoading'),
    ).not.toBeInTheDocument();
    fireEvent.click(getByTestId('PartnerCareTabCelebrations'));
    expect(
      getByTestId('PartnerCareCelebrationListLoading'),
    ).toBeInTheDocument();
    expect(
      queryByTestId('PartnerCarePrayerListLoading'),
    ).not.toBeInTheDocument();
  });

  it('empty', () => {
    const prayerRequestTasks = {
      nodes: [],
      totalCount: 0,
    };
    const reportsPeopleWithBirthdays = {
      periods: [{ people: [] }],
      totalCount: 0,
    };
    const reportsPeopleWithAnniversaries = {
      periods: [{ people: [] }],
      totalCount: 0,
    };
    const { getByTestId, queryByTestId } = render(
      <PartnerCare
        accountListId="abc"
        prayerRequestTasks={prayerRequestTasks}
        reportsPeopleWithBirthdays={reportsPeopleWithBirthdays}
        reportsPeopleWithAnniversaries={reportsPeopleWithAnniversaries}
      />,
    );
    expect(
      getByTestId('PartnerCarePrayerCardContentEmpty'),
    ).toBeInTheDocument();
    expect(
      queryByTestId('PartnerCareCelebrationCardContentEmpty'),
    ).not.toBeInTheDocument();
    expect(getByTestId('PartnerCareTabPrayer').textContent).toEqual(
      'Prayer (0)',
    );
    const CelebrationsTab = getByTestId('PartnerCareTabCelebrations');
    expect(CelebrationsTab.textContent).toEqual('Celebrations (0)');
    fireEvent.click(CelebrationsTab);
    expect(
      getByTestId('PartnerCareCelebrationCardContentEmpty'),
    ).toBeInTheDocument();
    expect(
      queryByTestId('PartnerCarePrayerCardContentEmpty'),
    ).not.toBeInTheDocument();
  });

  it('props', () => {
    const { getByTestId, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <PartnerCare
          accountListId="abc"
          prayerRequestTasks={prayerRequestTasks}
          reportsPeopleWithBirthdays={reportsPeopleWithBirthdays}
          reportsPeopleWithAnniversaries={reportsPeopleWithAnniversaries}
        />
      </ThemeProvider>,
    );
    expect(
      queryByTestId('PartnerCarePrayerCardContentEmpty'),
    ).not.toBeInTheDocument();
    expect(getByTestId('PartnerCarePrayerList')).toBeInTheDocument();
    expect(getByTestId('PartnerCareTabPrayer').textContent).toEqual(
      'Prayer (2,560)',
    );
    const task1Element = getByTestId('PartnerCarePrayerListItem-task_1');
    expect(task1Element.textContent).toEqual(
      'Roger Smith, Sarah Smiththe quick brown fox jumps over the lazy dog',
    );
    userEvent.click(task1Element);
    expect(openTaskDrawer).toHaveBeenCalledWith({ taskId: 'task_1' });
    expect(getByTestId('PartnerCarePrayerListItem-task_2').textContent).toEqual(
      'Roger Parker, Sarah Parkeron the boat to see uncle johnny',
    );
    const CelebrationsTab = getByTestId('PartnerCareTabCelebrations');
    expect(CelebrationsTab.textContent).toEqual('Celebrations (4)');
    fireEvent.click(CelebrationsTab);
    expect(
      queryByTestId('PartnerCareCelebrationCardContentEmpty'),
    ).not.toBeInTheDocument();
    expect(getByTestId('PartnerCareCelebrationList')).toBeInTheDocument();
    expect(
      getByTestId('PartnerCareBirthdayListItem-person_1').textContent,
    ).toEqual('John DoeJan 1');
    expect(
      getByTestId('PartnerCareBirthdayListItem-person_2').textContent,
    ).toEqual('John DoeJan 1');
    expect(
      getByTestId('PartnerCareAnniversaryListItem-person_3').textContent,
    ).toEqual('John and Sarah, DoeOct 5');
    expect(
      queryByTestId('PartnerCareAnniversaryListItem-person_4'),
    ).not.toBeInTheDocument();
  });

  it('Opens complete task form for prayer request', () => {
    const { getByTestId, queryByTestId, queryAllByRole } = render(
      <ThemeProvider theme={theme}>
        <PartnerCare
          accountListId="abc"
          prayerRequestTasks={prayerRequestTasks}
        />
      </ThemeProvider>,
    );
    expect(
      queryByTestId('PartnerCarePrayerCardContentEmpty'),
    ).not.toBeInTheDocument();
    expect(getByTestId('PartnerCarePrayerList')).toBeInTheDocument();
    expect(getByTestId('PartnerCareTabPrayer').textContent).toEqual(
      'Prayer (2,560)',
    );
    userEvent.click(
      queryAllByRole('button', { hidden: true, name: 'Complete Button' })[0],
    );
    expect(openTaskDrawer).toHaveBeenCalledWith({
      taskId: 'task_1',
      showCompleteForm: true,
    });
  });

  it('Opens task drawer to create a new task for celebration | Birthday', () => {
    const { getByTestId, queryAllByRole } = render(
      <ThemeProvider theme={theme}>
        <PartnerCare
          accountListId="abc"
          reportsPeopleWithBirthdays={reportsPeopleWithBirthdays}
          reportsPeopleWithAnniversaries={reportsPeopleWithAnniversaries}
        />
      </ThemeProvider>,
    );

    const CelebrationsTab = getByTestId('PartnerCareTabCelebrations');
    expect(CelebrationsTab.textContent).toEqual('Celebrations (4)');
    fireEvent.click(CelebrationsTab);
    expect(
      getByTestId('PartnerCareBirthdayListItem-person_1').textContent,
    ).toEqual('John DoeJan 1');
    expect(
      getByTestId('PartnerCareBirthdayListItem-person_2').textContent,
    ).toEqual('John DoeJan 1');
    userEvent.click(
      queryAllByRole('button', { hidden: true, name: 'Complete Button' })[0],
    );
    expect(openTaskDrawer).toHaveBeenCalledWith({
      defaultValues: {
        subject: "John Doe's Birthday",
      },
    });
  });

  it('Opens task drawer to create a new task for celebration | Anniversary', () => {
    const { getByTestId, queryAllByRole, queryByTestId } = render(
      <ThemeProvider theme={theme}>
        <PartnerCare
          accountListId="abc"
          reportsPeopleWithBirthdays={reportsPeopleWithBirthdays}
          reportsPeopleWithAnniversaries={reportsPeopleWithAnniversaries}
        />
      </ThemeProvider>,
    );

    const CelebrationsTab = getByTestId('PartnerCareTabCelebrations');
    expect(CelebrationsTab.textContent).toEqual('Celebrations (4)');
    fireEvent.click(CelebrationsTab);
    expect(
      getByTestId('PartnerCareAnniversaryListItem-person_3').textContent,
    ).toEqual('John and Sarah, DoeOct 5');
    expect(
      queryByTestId('PartnerCareAnniversaryListItem-person_4'),
    ).not.toBeInTheDocument();
    userEvent.click(
      queryAllByRole('button', { hidden: true, name: 'Complete Button' })[2],
    );
    expect(openTaskDrawer).toHaveBeenCalledWith({
      defaultValues: {
        subject: "John and Sarah, Doe's Anniversary",
      },
    });
  });
});
