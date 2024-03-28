import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AddServerModalContextProps = {
  addServerModalOpen: boolean;
  setAddServerModalOpen?: Dispatch<SetStateAction<boolean>>;
};

const AddServerModalContext = createContext<AddServerModalContextProps>({
  addServerModalOpen: false,
});

const AddServerModalProvider = ({ children }: { children: ReactNode }) => {
  const [addServerModalOpen, setAddServerModalOpen] = useState(false);

  const defaultContext: AddServerModalContextProps = {
    addServerModalOpen,
    setAddServerModalOpen,
  };

  return (
    <AddServerModalContext.Provider value={defaultContext}>
      {children}
    </AddServerModalContext.Provider>
  );
};

export const useAddServerModalContext = () => {
  const { addServerModalOpen, setAddServerModalOpen } = useContext(
    AddServerModalContext,
  );

  const handleModalState = (open: boolean) => {
    if (setAddServerModalOpen) {
      setAddServerModalOpen(open);
    } else {
      console.error("not in the context");
    }
  };

  const handleAddServerModalOpen = () => {
    handleModalState(true);
  };

  const onClose = () => {
    handleModalState(false);
  };

  return {
    addServerModalOpen,
    handleAddServerModalOpen,
    onClose,
  };
};

export default AddServerModalProvider;
