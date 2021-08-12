import React, {
  ReactNode,
  ReactElement,
  useState,
  useReducer,
  Dispatch,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import TaskDrawer, { TaskDrawerProps } from '../Task/Drawer/Drawer';
import theme from '../../theme';
import rootReducer, { Action, AppState } from './rootReducer';
import { AppContext } from '.';

export interface AppProviderContext {
  openTaskDrawer: (props: TaskDrawerProps) => void;
  state: AppState;
  dispatch: Dispatch<Action>;
}

interface Props {
  children: ReactNode;
  initialState?: Partial<AppState>;
}

interface TaskDrawerPropsWithId extends TaskDrawerProps {
  id: string;
}

const AppProvider = ({ initialState, children }: Props): ReactElement => {
  const [taskDrawers, setTaskDrawers] = useState<TaskDrawerPropsWithId[]>([]);
  const [state, dispatch] = useReducer<typeof rootReducer>(rootReducer, {
    accountListId: undefined,
    ...initialState,
  });

  const openTaskDrawer = (taskDrawerProps: TaskDrawerProps): void => {
    const id = uuidv4();
    if (
      !taskDrawerProps.taskId ||
      !taskDrawers.find(
        ({ taskId, showCompleteForm }) =>
          taskId === taskDrawerProps.taskId &&
          showCompleteForm === taskDrawerProps.showCompleteForm,
      )
    ) {
      setTaskDrawers([
        ...taskDrawers,
        {
          id,
          ...taskDrawerProps,
          onClose: (): void => {
            taskDrawerProps.onClose && taskDrawerProps.onClose();
            setTimeout(
              () =>
                setTaskDrawers((taskDrawers) =>
                  taskDrawers.filter(({ id: taskId }) => taskId !== id),
                ),
              theme.transitions.duration.leavingScreen,
            );
          },
        },
      ]);
    }
  };

  const value: AppProviderContext = {
    openTaskDrawer,
    state,
    dispatch,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      {taskDrawers.map((props: TaskDrawerPropsWithId) => {
        const { id, ...taskDrawerProps } = props;

        return <TaskDrawer key={id} {...taskDrawerProps} />;
      })}
    </AppContext.Provider>
  );
};

export default AppProvider;
