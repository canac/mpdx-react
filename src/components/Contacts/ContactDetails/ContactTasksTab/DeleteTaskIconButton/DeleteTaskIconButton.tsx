import { DialogActions, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { DeletedItemIcon } from '../../../../common/DeleteItemIcon/DeleteItemIcon';
import { DeleteConfirmation } from '../../../../common/Modal/DeleteConfirmation/DeleteConfirmation';

const DeleteButton = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(1),
}));

export const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: `${theme.spacing(2)}px ${theme.spacing(3)}px`,
}));

interface DeleteTaskIconButtonProps {
  accountListId: string;
  taskId: string;
  onDeleteConfirm?: () => void;
}

export const DeleteTaskIconButton: React.FC<DeleteTaskIconButtonProps> = ({
  accountListId,
  taskId,
  onDeleteConfirm,
}) => {
  const [removeDialogOpen, handleRemoveDialog] = useState(false);

  return (
    <>
      <DeleteButton onClick={() => handleRemoveDialog(true)}>
        <DeletedItemIcon />
      </DeleteButton>
      <DeleteConfirmation
        deleteType="task"
        open={removeDialogOpen}
        onClickConfirm={onDeleteConfirm} // onDeleteTask
        onClickDecline={handleRemoveDialog}
        accountListId={accountListId}
        taskId={taskId}
      />
    </>
  );
};
