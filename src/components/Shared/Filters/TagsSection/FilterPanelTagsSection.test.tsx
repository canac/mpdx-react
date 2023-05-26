import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { GqlMockedProvider } from '__tests__/util/graphqlMocking';
import TestRouter from '__tests__/util/TestRouter';
import {
  FilterPanelTagsSection,
  FilterPanelTagsSectionProps,
} from './FilterPanelTagsSection';

const accountListId = 'account-list-1';
const router = {
  query: { accountListId },
  isReady: true,
};

const onSelectedFiltersChanged = jest.fn();
const ComponentWithMocks: React.FC<
  Partial<FilterPanelTagsSectionProps> | undefined
> = (props) => (
  <TestRouter router={router}>
    <SnackbarProvider>
      <GqlMockedProvider>
        <FilterPanelTagsSection
          filterOptions={[{ name: 'Tag 1', value: 'tag-1' }]}
          selectedFilters={{}}
          onSelectedFiltersChanged={onSelectedFiltersChanged}
          {...props}
        />
      </GqlMockedProvider>
    </SnackbarProvider>
  </TestRouter>
);

describe('FilterPanelTagsSection', () => {
  it('has any/all button group', () => {
    const { getByRole } = render(<ComponentWithMocks />);

    userEvent.click(getByRole('button', { name: 'Any' }));
    expect(onSelectedFiltersChanged).toHaveBeenCalledWith({ anyTags: true });

    userEvent.click(getByRole('button', { name: 'All' }));
    expect(onSelectedFiltersChanged).toHaveBeenCalledWith({});
  });

  it('activates any button based on anyTags filter', () => {
    const { getByRole } = render(
      <ComponentWithMocks selectedFilters={{ anyTags: true }} />,
    );

    expect(getByRole('button', { name: 'Any' })).toHaveClass(
      'MuiButton-contained',
    );
  });

  it('activates all button based on anyTags filter', () => {
    const { getByRole } = render(
      <ComponentWithMocks selectedFilters={{ anyTags: false }} />,
    );

    expect(getByRole('button', { name: 'All' })).toHaveClass(
      'MuiButton-contained',
    );
  });

  it('activates all button by default', () => {
    const { getByRole } = render(<ComponentWithMocks />);

    expect(getByRole('button', { name: 'All' })).toHaveClass(
      'MuiButton-contained',
    );
  });
});