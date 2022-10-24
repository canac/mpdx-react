import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import theme from '../../../../../theme';
import { FilterTagChip } from './FilterTagChip';

const name = 'test';
const value = '123';
const onSelectedFiltersChanged = jest.fn();

describe('FilterTagChip', () => {
  it('default', () => {
    const { getByText } = render(
      <ThemeProvider theme={theme}>
        <FilterTagChip
          name={name}
          value={value}
          selectedFilters={{}}
          onSelectedFiltersChanged={onSelectedFiltersChanged}
        />
      </ThemeProvider>,
    );
    expect(getByText('test')).toBeInTheDocument();
  });

  it('first click', () => {
    const { getByText, getByRole } = render(
      <ThemeProvider theme={theme}>
        <FilterTagChip
          name={name}
          value={value}
          selectedFilters={{}}
          onSelectedFiltersChanged={onSelectedFiltersChanged}
        />
      </ThemeProvider>,
    );
    expect(getByText('test')).toBeInTheDocument();
    const chip = getByRole('button');
    userEvent.click(chip);
    expect(onSelectedFiltersChanged).toHaveBeenCalledWith({ tags: ['test'] });
  });

  it('second click', () => {
    const { getByText, getByRole } = render(
      <ThemeProvider theme={theme}>
        <FilterTagChip
          name={name}
          value={value}
          selectedFilters={{ tags: ['test'] }}
          onSelectedFiltersChanged={onSelectedFiltersChanged}
        />
      </ThemeProvider>,
    );
    expect(getByText('test')).toBeInTheDocument();
    const chip = getByRole('button');
    userEvent.click(chip);
    expect(onSelectedFiltersChanged).toHaveBeenCalledWith({
      excludeTags: ['test'],
    });
  });
});