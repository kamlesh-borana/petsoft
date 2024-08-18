"use client";

import { createContext, useState } from "react";

type TSearchContext = {
  searchQuery: string;
  handleChangeSearchQuery: (newSearchQuery: string) => void;
};

export const SearchContext = createContext<TSearchContext | null>(null);

export default function SearchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChangeSearchQuery = (newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
  };

  return (
    <SearchContext.Provider value={{ searchQuery, handleChangeSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
