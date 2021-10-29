import React from 'react';
import { render } from '@testing-library/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import userEvent from '@testing-library/user-event';
import TestWrapper from '../../../../../__tests__/util/TestWrapper';
import { StatusEnum } from '../../../../../graphql/types.generated';
import { ContactFlowRow } from './ContactFlowRow';

const accountListId = 'abc';
const id = '123';
const name = 'Test Name';
const status = StatusEnum.PartnerFinancial;
const onContactSelected = jest.fn();

describe('ContactFlowRow', () => {
  it('should display contact name and status', () => {
    const { getByText, getByTitle } = render(
      <DndProvider backend={HTML5Backend}>
        <TestWrapper>
          <ContactFlowRow
            accountListId={accountListId}
            id={id}
            name={name}
            status={status}
            starred
            onContactSelected={onContactSelected}
          />
        </TestWrapper>
      </DndProvider>,
    );
    expect(getByText('Test Name')).toBeInTheDocument();
    expect(getByText('PARTNER_FINANCIAL')).toBeInTheDocument();
    expect(getByTitle('Filled Star Icon')).toBeInTheDocument();
  });

  it('should call contact selected function', () => {
    const { getByText } = render(
      <DndProvider backend={HTML5Backend}>
        <TestWrapper>
          <ContactFlowRow
            accountListId={accountListId}
            id={id}
            name={name}
            status={status}
            starred
            onContactSelected={onContactSelected}
          />
        </TestWrapper>
      </DndProvider>,
    );
    userEvent.click(getByText('Test Name'));
    expect(getByText('Test Name')).toBeInTheDocument();
    expect(onContactSelected).toHaveBeenCalledWith('123');
  });
});