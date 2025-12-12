"use client";

import { Modal, Input } from "antd";
import { FC, useState, useEffect } from "react";

interface RenameProjectModalProps {
  open: boolean;
  defaultName?: string;
  onClose: () => void;
  onRename: (newName: string) => void;
}

const RenameProjectModal: FC<RenameProjectModalProps> = ({
  open,
  defaultName = "",
  onClose,
  onRename,
}) => {
  const [newName, setNewName] = useState(defaultName);

  // Only reset newName when the modal transitions from closed to open
  useEffect(() => {
    if (open) {
      setNewName(defaultName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(newName.trim());
      onClose();
    }
  };

  return (
    <Modal
      centered
      open={open}
      onOk={handleRename}
      onCancel={onClose}
      width={400}
      okText="Save"
      cancelText="Cancel"
    >
      <div>
        <div className="mb-5">
          <div className="font-semibold text-[17px]">Rename Project</div>
          <div className="text-gray-600">
            Change the name of your project as it appears in your workspace.
          </div>
        </div>
        <div className="font-semibold text-[14px] mb-1">Display Name</div>
        <Input
          placeholder="Type a new project name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <div className="text-gray-600 text-[13px] mt-1 mb-5">
          You can use letters, numbers, spaces, and special characters (up to
          100 characters). This name will be visible to you and your team, but
          not to the public.
        </div>
      </div>
    </Modal>
  );
};

export default RenameProjectModal;
