import { Chip, styled, Theme } from '@material-ui/core';
import React from 'react';
import {
  ContactFilterSetInput,
  TaskFilterSetInput,
} from '../../../../../../graphql/types.generated';

interface FilterTagChipProps {
  name: string;
  value: string;
  selectedFilters: ContactFilterSetInput & TaskFilterSetInput;
  onSelectedFiltersChanged: (
    selectedFilters: ContactFilterSetInput & TaskFilterSetInput,
  ) => void;
}

const TagChip = styled(Chip)(
  ({
    theme,
    selectType,
  }: {
    theme: Theme;
    selectType: 'none' | 'include' | 'exclude';
  }) => ({
    color: theme.palette.common.white,
    backgroundColor:
      selectType === 'include'
        ? theme.palette.mpdxBlue.main
        : selectType === 'exclude'
        ? theme.palette.error.main
        : theme.palette.cruGrayMedium.main,
    '&:focus': {
      backgroundColor:
        selectType === 'include'
          ? theme.palette.mpdxBlue.main
          : selectType === 'exclude'
          ? theme.palette.error.main
          : theme.palette.cruGrayMedium.main,
    },
  }),
);

export const FilterTagChip: React.FC<FilterTagChipProps> = ({
  name,
  value,
  selectedFilters,
  onSelectedFiltersChanged,
}) => {
  const includedTags = selectedFilters.tags ?? [];
  const excludedTags = selectedFilters.excludeTags ?? [];

  const getChipSelectType = (id: string): 'none' | 'include' | 'exclude' => {
    if (includedTags.includes(id)) {
      return 'include';
    }
    if (excludedTags.includes(id)) {
      return 'exclude';
    }
    return 'none';
  };

  const toggleSelect = (id: string) => {
    if (includedTags.includes(id)) {
      const tempFilters: ContactFilterSetInput & TaskFilterSetInput = {
        ...selectedFilters,
        tags: includedTags.filter((tag: string) => tag !== id),
        excludeTags: [...excludedTags, id],
      };
      if (tempFilters.tags?.length === 0) {
        delete tempFilters['tags'];
      }
      onSelectedFiltersChanged(tempFilters);
      return;
    }
    if (excludedTags.includes(id)) {
      const tempFilters: ContactFilterSetInput & TaskFilterSetInput = {
        ...selectedFilters,
        excludeTags: excludedTags.filter((tag: string) => tag !== id),
      };
      if (tempFilters.excludeTags?.length === 0) {
        delete tempFilters['excludeTags'];
      }
      onSelectedFiltersChanged(tempFilters);
      return;
    }
    onSelectedFiltersChanged({
      ...selectedFilters,
      tags: [...includedTags, id],
    });
    return;
  };

  return (
    <TagChip
      label={name}
      key={value}
      selectType={getChipSelectType(name)}
      onClick={() => toggleSelect(name)}
      //TODO: Add onDelete functionality
    />
  );
};