import { ListItem, ListItemText } from '@material-ui/core';
import React from 'react';
import { Filter } from './Filter';
import { FilterListItemCheckbox } from './FilterListItemCheckbox';
import { FilterListItemDateRange } from './FilterListItemDateRange';
import { FilterListItemMultiselect } from './FilterListItemMultiselect';
import { FilterListItemSelect } from './FilterListItemSelect';
import { FilterListItemTextField } from './FilterListItemTextField';

interface Props {
  filter: Filter;
  value;
  onUpdate: (value) => void;
}

export const FilterListItem: React.FC<Props> = ({
  filter,
  value,
  onUpdate,
}: Props) => {
  return filter.type === 'text' ? (
    <FilterListItemTextField
      filter={filter}
      value={value}
      onUpdate={onUpdate}
    />
  ) : filter.type === 'radio' ? (
    <FilterListItemSelect filter={filter} value={value} onUpdate={onUpdate} />
  ) : filter.type === 'multiselect' ? (
    <FilterListItemMultiselect
      filter={filter}
      selected={value}
      onUpdate={onUpdate}
    />
  ) : filter.type === 'daterange' ? (
    <FilterListItemDateRange
      filter={filter}
      value={value}
      onUpdate={onUpdate}
    />
  ) : filter.type === 'single_checkbox' ? (
    <FilterListItemCheckbox filter={filter} value={value} onUpdate={onUpdate} />
  ) : (
    <ListItem>
      <ListItemText
        primary={`Unsupported Filter: ${filter.title} (${filter.type})`}
        primaryTypographyProps={{ variant: 'subtitle1', color: 'error' }}
      />
    </ListItem>
  );
};
