import {
  Box,
  styled,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core';
import { ExpandMore, LocalOffer } from '@material-ui/icons';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ContactFilterSetInput,
  FilterOption,
  TaskFilterSetInput,
} from '../../../../../graphql/types.generated';
import { FilterTagChip } from './Chip/FilterTagChip';

interface FilterPanelTagsSectionProps {
  filterOptions: FilterOption[] | Record<string, never>[];
  selectedFilters: ContactFilterSetInput & TaskFilterSetInput;
  onSelectedFiltersChanged: (
    selectedFilters: ContactFilterSetInput & TaskFilterSetInput,
  ) => void;
}

const TagsSectionDescription = styled(Typography)(() => ({
  fontStyle: 'italic',
}));

const TagsSectionWrapper = styled(Box)(({ theme }) => ({
  flexWrap: 'wrap',
  '& > *': {
    margin: theme.spacing(0.5),
  },
}));

const TagsAccordionWrapper = styled(Box)(({ theme }) => ({
  '& .MuiPaper-elevation1': {
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.cruGrayLight.main}`,
  },
  '& .MuiAccordion-root.Mui-expanded': {
    margin: 0,
  },
}));

export const FilterPanelTagsSection: React.FC<FilterPanelTagsSectionProps> = ({
  filterOptions,
  selectedFilters,
  onSelectedFiltersChanged,
}) => {
  const { t } = useTranslation();
  const { pathname } = useRouter();

  return (
    <TagsAccordionWrapper>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          {' '}
          <Box display="flex">
            <LocalOffer />
            <Typography style={{ marginLeft: 8 }}>{t('Tags')}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TagsSectionWrapper>
            <Box mb={2}>
              <TagsSectionDescription variant="body2">
                {t(
                  'Click a tag twice to look up all {{page}} do not have that tag.',
                  {
                    page: pathname.includes('contacts')
                      ? 'contacts who'
                      : 'tasks that',
                  },
                )}
              </TagsSectionDescription>
            </Box>
            {filterOptions.map((option) => (
              <>
                {option.value !== '--any--' && (
                  <FilterTagChip
                    name={option.name}
                    value={option.value}
                    selectedFilters={selectedFilters}
                    onSelectedFiltersChanged={onSelectedFiltersChanged}
                  />
                )}
              </>
            ))}
          </TagsSectionWrapper>
        </AccordionDetails>
      </Accordion>
    </TagsAccordionWrapper>
  );
};