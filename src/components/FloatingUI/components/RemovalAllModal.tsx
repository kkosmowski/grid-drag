import { Modal } from '~/components/Modal';

type RemoveAllModalProps = {
  open: boolean;
  onConfirm: VoidFunction;
  onCancel: VoidFunction;
};

export const RemoveAllModal = ({ open, onConfirm, onCancel }: RemoveAllModalProps) => {
  return (
    <Modal open={open} onClose={onCancel}>
      <Modal.Title>Remove all?</Modal.Title>

      <p>Are you sure you want to clear the grid?</p>

      <Modal.Footer>
        <Modal.Button onClick={() => onCancel()}>No</Modal.Button>
        <Modal.Button primary onClick={() => onConfirm()}>
          Yes
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  );
};
