import { createContext, useState, useContext, useEffect } from 'react';
import { BooksContext } from './contextBooksProvider';

export const FiltersContext = createContext();

export default function FiltersProvider({ children }) {
  const { books } = useContext(BooksContext);

  const [filters, setFilters] = useState({
    sortByTitle: '',
    sortByPages: false,
    genre: '',
    genres: [],
    maxPosiblePages: 0,
    pages: {
      minPages: 10,
      maxPages: 0,
    },
  });

  useEffect(() => {
    if (!books || !books.length) return;

    const getUniqueGenres = () => {
      const allGenres = Array.from(new Set(books?.map((book) => book.genre)));

      return allGenres;
    };

    const getBookWithMorePages = () => {
      const bookWithMorePages = books?.reduce((prevBook, currentBook) => {
        return prevBook.pages > currentBook.pages ? prevBook : currentBook;
      });

      return bookWithMorePages.pages;
    };

    setFilters((prevFilters) => ({
      ...prevFilters,
      genres: getUniqueGenres(),
      maxPosiblePages: getBookWithMorePages(),
      pages: {
        minPages: 10,
        maxPages: getBookWithMorePages(),
      },
    }));
  }, [books]);

  const { sortByTitle, genre, pages } = filters;

  const filter = books?.filter((book) => {
    if (
      (!genre || book.genre === genre) &&
      (book.title?.toLowerCase().includes(sortByTitle)) &&
      book.pages <= pages.maxPages
    )
      return true;

    return false;
  });

  const filteredBooks = filter;

  return (
    <FiltersContext.Provider value={{ filters, setFilters, filteredBooks }}>
      {children}
    </FiltersContext.Provider>
  );
}