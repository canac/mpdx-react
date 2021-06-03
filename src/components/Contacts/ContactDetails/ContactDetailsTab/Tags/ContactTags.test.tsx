import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from 'notistack';
import { GqlMockedProvider } from '../../../../../../__tests__/util/graphqlMocking';
import {
  render,
  waitFor,
} from '../../../../../../__tests__/util/testingLibraryReactMock';
import theme from '../../../../../theme';
import { ContactTags } from './ContactTags';
import { UpdateContactTagsMutation } from './ContactTags.generated';

const accountListId = '123';
const contactId = 'abc';
const contactTags = ['tag1', 'tag2', 'tag3'];

const mockEnqueue = jest.fn();

jest.mock('notistack', () => ({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  ...jest.requireActual('notistack'),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueue,
    };
  },
}));

describe('ContactTags', () => {
  it('should render with tags', () => {
    const { getByText } = render(
      <SnackbarProvider>
        <GqlMockedProvider<UpdateContactTagsMutation>>
          <MuiThemeProvider theme={theme}>
            <ContactTags
              accountListId={accountListId}
              contactId={contactId}
              contactTags={contactTags}
            />
          </MuiThemeProvider>
        </GqlMockedProvider>
      </SnackbarProvider>,
    );
    expect(getByText('tag1')).toBeInTheDocument();
    expect(getByText('tag2')).toBeInTheDocument();
    expect(getByText('tag3')).toBeInTheDocument();
  });

  it('should add a tag', async () => {
    const { getByRole } = render(
      <SnackbarProvider>
        <GqlMockedProvider<UpdateContactTagsMutation>
          mocks={{
            UpdateContactTags: {
              updateContact: {
                contact: {
                  id: contactId,
                  tagList: [...contactTags, 'tag4'],
                },
              },
            },
          }}
          addTypename={false}
        >
          <MuiThemeProvider theme={theme}>
            <ContactTags
              accountListId={accountListId}
              contactId={contactId}
              contactTags={contactTags}
            />
          </MuiThemeProvider>
        </GqlMockedProvider>
      </SnackbarProvider>,
    );
    userEvent.type(getByRole('textbox', { name: 'Tag' }), 'tag4{enter}');
    await waitFor(() =>
      expect(getByRole('textbox', { name: 'Tag' })).toHaveValue(''),
    );

    expect(mockEnqueue).toHaveBeenCalledWith('Tag successfully added', {
      variant: 'success',
    });
  });

  it('should delete a tag', async () => {
    const mutationSpy = jest.fn();
    const { getAllByRole } = render(
      <SnackbarProvider>
        <GqlMockedProvider<UpdateContactTagsMutation>
          mocks={{
            UpdateContactTags: {
              updateContact: {
                contact: {
                  id: contactId,
                  tagList: ['tag2', 'tag3'],
                },
              },
            },
          }}
          onCall={mutationSpy}
          addTypename={false}
        >
          <MuiThemeProvider theme={theme}>
            <ContactTags
              accountListId={accountListId}
              contactId={contactId}
              contactTags={contactTags}
            />
          </MuiThemeProvider>
        </GqlMockedProvider>
      </SnackbarProvider>,
    );
    const tag1DeleteIcon = getAllByRole('button', {
      name: 'Delete Icon',
    })[0].querySelector('.MuiChip-deleteIcon');

    expect(tag1DeleteIcon).toBeInTheDocument();
    tag1DeleteIcon && userEvent.click(tag1DeleteIcon);
    await waitFor(() =>
      expect(mockEnqueue).toHaveBeenCalledWith('Tag successfully removed', {
        variant: 'success',
      }),
    );
  });
});
