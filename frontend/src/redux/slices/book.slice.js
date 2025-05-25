import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../helpers/axiosInstance';

const initialState = {
  pages: {}, // Cache books by page: { 1: [books], 2: [books], ... }
  searchResults: {
    books: [],
    totalBooks: 0,
    totalPages: 0,
    currentPage: 1,
    query: '',
  },
  filterResults: {
    books: [],
    totalBooks: 0,
    totalPages: 0,
    currentPage: 1,
    type: '',
  },
  currentBook: null,
  loading: false,
  error: null,
  totalBooks: 0,
  totalPages: 0,
  currentPage: 1,
  hasFetchedInitial: false, // Flag to track initial fetch
};

export const createBook = createAsyncThunk('/books/create', async (formData, { rejectWithValue }) => {
  try {
    const res = axiosInstance.post('/book/books', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.promise(res, {
      loading: 'Adding book...',
      success: (response) => response?.data?.message || 'Book created successfully',
      error: (error) => error?.response?.data?.message || 'Failed to create book',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to create book' });
  }
});

export const getAllBooks = createAsyncThunk('/books/getAll', async ({ page = 1, limit = 12 }, { getState, rejectWithValue }) => {
  const state = getState();
  if (state.books.pages[page]) {
    return { books: state.books.pages[page], totalBooks: state.books.totalBooks, totalPages: state.books.totalPages, currentPage: page };
  }

  try {
    const res = axiosInstance.get(`/book/books?page=${page}&limit=${limit}&sort=-createdAt`);
    if (!state.books.pages[page]) {
      toast.promise(res, {
        loading: 'Fetching books...',
        success: (response) => response?.data?.message || 'Books fetched successfully',
        error: (error) => error?.response?.data?.message || 'Failed to fetch books',
      });
    }
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to fetch books' });
  }
});

export const getBookDetails = createAsyncThunk('/books/details', async (bookId, { rejectWithValue }) => {
  try {
    const res = axiosInstance.get(`/book/books/${bookId}`);
    toast.promise(res, {
      loading: 'Fetching book details...',
      success: (response) => response?.data?.message || 'Book details fetched successfully',
      error: (error) => error?.response?.data?.message || 'Failed to fetch book details',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to fetch book details' });
  }
});

export const deleteBook = createAsyncThunk('/books/delete', async (bookId, { rejectWithValue }) => {
  try {
    const res = axiosInstance.delete(`/book/books/${bookId}`);
    toast.promise(res, {
      loading: 'Deleting book...',
      success: (response) => response?.data?.message || 'Book deleted successfully',
      error: (error) => error?.response?.data?.message || 'Failed to delete book',
    });
    return { bookId, ...((await res).data) };
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to delete book' });
  }
});

export const addReview = createAsyncThunk('/books/reviews/add', async ({ bookId, rating, comment }, { rejectWithValue, getState }) => {
  try {
  
    const res = axiosInstance.post(`/book/books/${bookId}/reviews`, { rating, comment });
    toast.promise(res, {
      loading: 'Adding review...',
      success: (response) => response?.data?.message || 'Review added successfully',
      error: (error) => error?.response?.data?.message || 'Failed to add review',
    });
    const response = await res;
    const state = getState();
    const user = state.auth.user; // Assuming auth slice has user info
    const newReview = {
      rating,
      comment,
      user: { _id: user._id, fullName: user.fullName, email: user.email },
      createdAt: new Date().toISOString(),
    };
    return { bookId, newReview, ...response.data };
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to add review' });
  }
});

export const getBookReviews = createAsyncThunk('/books/reviews/get', async (bookId, { rejectWithValue }) => {
  try {
    const res = axiosInstance.get(`/book/books/${bookId}/reviews`);
    toast.promise(res, {
      loading: 'Fetching reviews...',
      success: (response) => response?.data?.message || 'Reviews fetched successfully',
      error: (error) => error?.response?.data?.message || 'Failed to fetch reviews',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to fetch reviews' });
  }
});

export const searchBooks = createAsyncThunk('/books/search', async ({ query, page = 1, limit = 12 }, { getState, rejectWithValue }) => {
  const state = getState();
  if (state.books.searchResults.query === query && state.books.searchResults.books.length > 0 && state.books.searchResults.currentPage === page) {
    return state.books.searchResults;
  }

  try {
    const res = axiosInstance.get(`/book/books/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sort=-createdAt`);
    toast.promise(res, {
      loading: 'Searching books...',
      success: (response) => response?.data?.message || 'Books found successfully',
      error: (error) => error?.response?.data?.message || 'Failed to search books',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to search books' });
  }
});

export const filterBooksByType = createAsyncThunk('/books/filter', async ({ type, page = 1, limit = 12 }, { getState, rejectWithValue }) => {
  const state = getState();
  if (state.books.filterResults.type === type && state.books.filterResults.books.length > 0 && state.books.filterResults.currentPage === page) {
    return state.books.filterResults;
  }

  try {
    if (!type) {
      return await dispatch(getAllBooks({ page, limit })).unwrap();
    }
    const res = axiosInstance.get(`/book/books/filter?type=${encodeURIComponent(type)}&page=${page}&limit=${limit}&sort=-createdAt`);
    toast.promise(res, {
      loading: 'Filtering books...',
      success: (response) => response?.data?.message || 'Books filtered successfully',
      error: (error) => error?.response?.data?.message || 'Failed to filter books',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to filter books' });
  }
});

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      if (state.searchResults.query) {
        state.searchResults.currentPage = action.payload;
      } else if (state.filterResults.type) {
        state.filterResults.currentPage = action.payload;
      }
    },resetCurrentBook: (state) => {
      state.currentBook = null;
      state.loading = false;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = { books: [], totalBooks: 0, totalPages: 0, currentPage: 1, query: '' };
    },
    clearFilterResults: (state) => {
      state.filterResults = { books: [], totalBooks: 0, totalPages: 0, currentPage: 1, type: '' };
    },
    resetCache: (state) => {
      state.pages = {};
      state.hasFetchedInitial = false;
      state.totalBooks = 0;
      state.totalPages = 0;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.totalBooks += 1;
        state.totalPages = Math.ceil(state.totalBooks / 12);
        state.pages = {};
        state.hasFetchedInitial = false;
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to create book';
      })
      .addCase(getAllBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.pages[action.payload.currentPage] = action.payload.books;
        state.totalBooks = action.payload.totalBooks;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasFetchedInitial = true;
      })
      .addCase(getAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch books';
      })
      .addCase(getBookDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload.book;
      })
      .addCase(getBookDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch book details';
      })
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        Object.keys(state.pages).forEach((page) => {
          state.pages[page] = state.pages[page].filter((book) => book._id !== action.payload.bookId);
        });
        state.searchResults.books = state.searchResults.books.filter((book) => book._id !== action.payload.bookId);
        state.filterResults.books = state.filterResults.books.filter((book) => book._id !== action.payload.bookId);
        state.totalBooks -= 1;
        state.totalPages = Math.ceil(state.totalBooks / 12);
        if (state.currentBook && state.currentBook._id === action.payload.bookId) {
          state.currentBook = null;
        }
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to delete book';
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentBook && state.currentBook._id === action.payload.book._id) {
          state.currentBook = action.payload.book;
        }
        const { bookId, newReview } = action.payload;
        // Update reviews for the book in all relevant places
        Object.keys(state.pages).forEach((page) => {
          const book = state.pages[page].find((b) => b._id === bookId);
          if (book) {
            book.reviews = book.reviews || [];
            book.reviews.unshift(newReview); // Add new review at the top
            book.averageRating = action.payload.book.averageRating;
          }
        });
        const searchBook = state.searchResults.books.find((b) => b._id === bookId);
        if (searchBook) {
          searchBook.reviews = searchBook.reviews || [];
          searchBook.reviews.unshift(newReview);
          searchBook.averageRating = action.payload.book.averageRating;
        }
        const filterBook = state.filterResults.books.find((b) => b._id === bookId);
        if (filterBook) {
          filterBook.reviews = filterBook.reviews || [];
          filterBook.reviews.unshift(newReview);
          filterBook.averageRating = action.payload.book.averageRating;
        }
        if (state.currentBook && state.currentBook._id === bookId) {
          state.currentBook.reviews = state.currentBook.reviews || [];
          state.currentBook.reviews.unshift(newReview);
          state.currentBook.averageRating = action.payload.book.averageRating;
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to add review';
      })
      .addCase(getBookReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBookReviews.fulfilled, (state, action) => {
        state.loading = false;
        const bookId = action.meta.arg;
        Object.keys(state.pages).forEach((page) => {
          const book = state.pages[page].find((b) => b._id === bookId);
          if (book) {
            book.reviews = action.payload.reviews;
            book.averageRating = action.payload.averageRating;
          }
        });
        const searchBook = state.searchResults.books.find((b) => b._id === bookId);
        if (searchBook) {
          searchBook.reviews = action.payload.reviews;
          searchBook.averageRating = action.payload.averageRating;
        }
        const filterBook = state.filterResults.books.find((b) => b._id === bookId);
        if (filterBook) {
          filterBook.reviews = action.payload.reviews;
          filterBook.averageRating = action.payload.averageRating;
        }
        if (state.currentBook && state.currentBook._id === bookId) {
          state.currentBook.reviews = action.payload.reviews;
          state.currentBook.averageRating = action.payload.averageRating;
        }
      })
      .addCase(getBookReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch reviews';
      })
      .addCase(searchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults.books = action.payload.books;
        state.searchResults.totalBooks = action.payload.totalBooks;
        state.searchResults.totalPages = action.payload.totalPages;
        state.searchResults.currentPage = action.payload.currentPage;
        state.searchResults.query = action.meta.arg.query;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to search books';
        state.searchResults.books = [];
      })
      .addCase(filterBooksByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterBooksByType.fulfilled, (state, action) => {
        state.loading = false;
        state.filterResults.books = action.payload.books;
        state.filterResults.totalBooks = action.payload.totalBooks;
        state.filterResults.totalPages = action.payload.totalPages;
        state.filterResults.currentPage = action.payload.currentPage;
        state.filterResults.type = action.meta.arg.type || '';
      })
      .addCase(filterBooksByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to filter books';
        state.filterResults.books = [];
      });
  },
});

export const { clearError, setCurrentPage, clearSearchResults, clearFilterResults, resetCache ,resetCurrentBook} = bookSlice.actions;
export default bookSlice.reducer;