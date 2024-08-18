import { PetContext } from "@/contexts/pet-context-provider";
import { SearchContext } from "@/contexts/search-context-provider";
import { useContext } from "react";

export const usePetContext = () => {
  const context = useContext(PetContext);

  if (!context) {
    throw new Error("usePetContext must be used inside PetContextProvider");
  }

  return context;
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);

  if (!context) {
    throw new Error(
      "useSearchContext must be used inside SearchContextProvider"
    );
  }

  return context;
};
