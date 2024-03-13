import { ThemeProvider } from '@mui/material/styles';
import { render, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { SnackbarProvider } from 'notistack';
import TestRouter from '__tests__/util/TestRouter';
import theme from '../../theme';
import { RouterGuard } from './RouterGuard';

interface TestComponentProps {
  pathname: string;
  children: string;
}

const TestComponent: React.FC<TestComponentProps> = ({
  pathname,
  children,
}) => {
  const router = {
    pathname,
    query: { accountListId: 'accountListId' },
    isReady: true,
    push: jest.fn(),
  };

  return (
    <ThemeProvider theme={theme}>
      <TestRouter router={router}>
        <SnackbarProvider>
          <RouterGuard>
            <div>{children}</div>
          </RouterGuard>
        </SnackbarProvider>
      </TestRouter>
    </ThemeProvider>
  );
};

describe('RouterGuard', () => {
  describe('authenticated', () => {
    it('should render when authenticated', async () => {
      const { getByText } = render(
        <TestComponent pathname="/authRoute">Authed route</TestComponent>,
      );

      await waitFor(() =>
        expect(getByText('Authed route')).toBeInTheDocument(),
      );
    });

    it('should render loading indicator while session is loading', async () => {
      (useSession as jest.MockedFn<typeof useSession>).mockReturnValue({
        data: null,
        status: 'loading',
        update: () => Promise.resolve(null),
      });

      const { queryByText, getByTestId } = render(
        <TestComponent pathname="/authRoute">Authed route</TestComponent>,
      );

      await waitFor(() =>
        expect(queryByText('Authed route')).not.toBeInTheDocument(),
      );
      expect(getByTestId('LoadingIndicator')).toBeInTheDocument();
    });
  });

  describe('unauthenticated', () => {
    it('should render when unauthenticated and on /login', async () => {
      (useSession as jest.MockedFn<typeof useSession>).mockReturnValue({
        data: null,
        status: 'unauthenticated',
        update: () => Promise.resolve(null),
      });

      const { getByText } = render(
        <TestComponent pathname="/login">Login page</TestComponent>,
      );
      await waitFor(() => expect(getByText('Login page')).toBeInTheDocument());
    });
  });
});
