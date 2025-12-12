"use client";

import RenameProjectModal from "@/components/sidebar/settings/RenameProjectModal";
import { createContext, ReactNode, useContext, useState } from "react";

interface RenameModalOptions {
  defaultName?: string;
  onRename: (newName: string) => void;
}

interface RenameModalContextProps {
  openRenameModal: (options: RenameModalOptions) => void;
}

const RenameModalContext = createContext<RenameModalContextProps | undefined>(
  undefined
);

export const RenameModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [defaultName, setDefaultName] = useState("");
  const [onRenameCallback, setOnRenameCallback] = useState<
    (name: string) => void
  >(() => {});

  const openRenameModal = ({
    defaultName = "",
    onRename,
  }: RenameModalOptions) => {
    setDefaultName(defaultName);
    setOnRenameCallback(() => onRename);
    setIsModalOpen(true);
  };

  const handleClose = () => setIsModalOpen(false);

  const handleRename = (newName: string) => {
    onRenameCallback(newName);
    handleClose();
  };

  return (
    <RenameModalContext.Provider value={{ openRenameModal }}>
      {children}

      {/* Render the modal at the bottom */}
      <RenameProjectModal
        open={isModalOpen}
        defaultName={defaultName}
        onClose={handleClose}
        onRename={handleRename}
      />
    </RenameModalContext.Provider>
  );
};

export const useRenameModal = () => {
  const context = useContext(RenameModalContext);
  if (!context)
    throw new Error("useRenameModal must be used within RenameModalProvider");
  return context;
};
