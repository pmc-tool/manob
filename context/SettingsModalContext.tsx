"use client";

import SettingsModal from "@/components/sidebar/settings";
import { createContext, useContext, useState, ReactNode, FC } from "react";

interface SettingsModalContextType {
  openModal: (tab?: string) => void;
  closeModal: () => void;
}

const SettingsModalContext = createContext<SettingsModalContextType>({
  openModal: () => {},
  closeModal: () => {},
});

export const useSettingsModal = () => useContext(SettingsModalContext);

interface ProviderProps {
  children: ReactNode;
}

export const SettingsModalProvider: FC<ProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  // const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("Project Settings");

  const openModal = (tab?: string) => {
    if (tab) setActiveTab(tab);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <SettingsModalContext.Provider value={{ openModal, closeModal }}>
      {children}

      {/* Render the modal at the bottom */}
      <SettingsModal
        open={isOpen}
        onClose={closeModal}
        initialTab={activeTab}
      />
    </SettingsModalContext.Provider>
  );
};
