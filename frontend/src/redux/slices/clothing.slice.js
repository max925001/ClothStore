import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../helpers/axiosInstance';

const initialState = {
  pages: {}, // Cache clothing items by page: { 1: [clothing], 2: [clothing], ... }
  searchResults: {
    clothing: [],
    totalClothing: 0,
    totalPages: 0,
    currentPage: 1,
    query: '',
  },
  filterResults: {
    clothing: [],
    totalClothing: 0,
    totalPages: 0,
    currentPage: 1,
    itemType: '',
  },
  currentClothing: null,
  loading: false,
  error: null,
  totalClothing: 0,
  totalPages: 0,
  currentPage: 1,
  hasFetchedInitial: false, // Flag to track initial fetch
};

export const createClothing = createAsyncThunk('/clothing/create', async (formData, { rejectWithValue }) => {
  try {
    const res = axiosInstance.post('/cloth/cloths', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    toast.promise(res, {
      loading: 'Adding clothing item...',
      success: (response) => response?.data?.message || 'Clothing item created successfully',
      error: (error) => error?.response?.data?.message || 'Failed to create clothing item',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to create clothing item' });
  }
});

export const getAllClothing = createAsyncThunk('/clothing/getAll', async ({ page = 1, limit = 12 }, { getState, rejectWithValue }) => {
  const state = getState();
  console.log(state)
  console.log(state.clothing.pages[page])
  if (state.clothing.pages[page]) {
    return { clothing: state.clothing.pages[page], totalClothing: state.clothing.totalClothing, totalPages: state.clothing.totalPages, currentPage: page };
  }
 console.log("hello")
  try {
    
    const res =  axiosInstance.get(`/cloth/cloths?page=${page}&limit=${limit}&sort=-createdAt`);
   
    console.log(res);
    if (!state.clothing.pages[page]) {
      toast.promise(res, {
        loading: 'Fetching clothing items...',
        success: (response) => response?.data?.message || 'Clothing items fetched successfully',
        error: (error) => error?.response?.data?.message || 'Failed to fetch clothing items',
      });
    }
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to fetch clothing items' });
  }
});

export const getClothingDetails = createAsyncThunk('/clothing/details', async (clothingId, { rejectWithValue }) => {
  try {
   
    const res = axiosInstance.get(`/cloth/cloths/${clothingId}`);
    toast.promise(res, {
      loading: 'Fetching clothing details...',
      success: (response) => response?.data?.message || 'Clothing details fetched successfully',
      error: (error) => error?.response?.data?.message || 'Failed to fetch clothing details',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to fetch clothing details' });
  }
});

export const deleteClothing = createAsyncThunk('/clothing/delete', async (clothingId, { rejectWithValue }) => {
  try {
    const res = axiosInstance.delete(`/cloth/cloths/${clothingId}`);
    toast.promise(res, {
      loading: 'Deleting clothing item...',
      success: (response) => response?.data?.message || 'Clothing item deleted successfully',
      error: (error) => error?.response?.data?.message || 'Failed to delete clothing item',
    });
    return { clothingId, ...((await res).data) };
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to delete clothing item' });
  }
});

export const addReview = createAsyncThunk('/clothing/reviews/add', async ({ clothingId, rating, comment }, { rejectWithValue, getState }) => {
  try {
    const res = axiosInstance.post(`/cloth/cloths/${clothingId}/reviews`, { rating, comment });
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
    return { clothingId, newReview, ...response.data };
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to add review' });
  }
});

export const getClothingReviews = createAsyncThunk('/clothing/reviews/get', async (clothingId, { rejectWithValue }) => {
  try {
    const res = axiosInstance.get(`/cloth//cloths/${clothingId}/reviews`);
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

export const searchClothing = createAsyncThunk('/clothing/search', async ({ query, page = 1, limit = 12 }, { getState, rejectWithValue }) => {
  const state = getState();
  if (state.clothing.searchResults.query === query && state.clothing.searchResults.clothing.length > 0 && state.clothing.searchResults.currentPage === page) {
    return state.clothing.searchResults;
  }

  try {
    const res = axiosInstance.get(`/cloth/cloths/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}&sort=-createdAt`);
    toast.promise(res, {
      loading: 'Searching clothing items...',
      success: (response) => response?.data?.message || 'Clothing items found successfully',
      error: (error) => error?.response?.data?.message || 'Failed to search clothing items',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to search clothing items' });
  }
});

export const filterClothingByType = createAsyncThunk('/clothing/filter', async ({ itemType, page = 1, limit = 12 }, { getState, rejectWithValue }) => {
  const state = getState();
  if (state.clothing.filterResults.itemType === itemType && state.clothing.filterResults.clothing.length > 0 && state.clothing.filterResults.currentPage === page) {
    return state.clothing.filterResults;
  }

  try {
    if (!itemType) {
      return await dispatch(getAllClothing({ page, limit })).unwrap();
    }
    const res = axiosInstance.get(`/cloth/cloths/filter?itemType=${encodeURIComponent(itemType)}&page=${page}&limit=${limit}&sort=-createdAt`);
    toast.promise(res, {
      loading: 'Filtering clothing items...',
      success: (response) => response?.data?.message || 'Clothing items filtered successfully',
      error: (error) => error?.response?.data?.message || 'Failed to filter clothing items',
    });
    return (await res).data;
  } catch (error) {
    return rejectWithValue(error?.response?.data || { message: 'Failed to filter clothing items' });
  }
});

const clothingSlice = createSlice({
  name: 'clothing',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
      if (state.searchResults.query) {
        state.searchResults.currentPage = action.payload;
      } else if (state.filterResults.itemType) {
        state.filterResults.currentPage = action.payload;
      }
    },
    resetCurrentClothing: (state) => {
      state.currentClothing = null;
      state.loading = false;
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = { clothing: [], totalClothing: 0, totalPages: 0, currentPage: 1, query: '' };
    },
    clearFilterResults: (state) => {
      state.filterResults = { clothing: [], totalClothing: 0, totalPages: 0, currentPage: 1, itemType: '' };
    },
    resetCache: (state) => {
      state.pages = {};
      state.hasFetchedInitial = false;
      state.totalClothing = 0;
      state.totalPages = 0;
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createClothing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClothing.fulfilled, (state, action) => {
        state.loading = false;
        state.totalClothing += 1;
        state.totalPages = Math.ceil(state.totalClothing / 12);
        state.pages = {};
        state.hasFetchedInitial = false;
      })
      .addCase(createClothing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to create clothing item';
      })
      .addCase(getAllClothing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllClothing.fulfilled, (state, action) => {
        state.loading = false;
        state.pages[action.payload.currentPage] = action.payload.clothing;
        state.totalClothing = action.payload.totalClothing;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.hasFetchedInitial = true;
      })
      .addCase(getAllClothing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch clothing items';
      })
      .addCase(getClothingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClothingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentClothing = action.payload.clothing;
      })
      .addCase(getClothingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch clothing details';
      })
      .addCase(deleteClothing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteClothing.fulfilled, (state, action) => {
        state.loading = false;
        Object.keys(state.pages).forEach((page) => {
          state.pages[page] = state.pages[page].filter((clothing) => clothing._id !== action.payload.clothingId);
        });
        state.searchResults.clothing = state.searchResults.clothing.filter((clothing) => clothing._id !== action.payload.clothingId);
        state.filterResults.clothing = state.filterResults.clothing.filter((clothing) => clothing._id !== action.payload.clothingId);
        state.totalClothing -= 1;
        state.totalPages = Math.ceil(state.totalClothing / 12);
        if (state.currentClothing && state.currentClothing._id === action.payload.clothingId) {
          state.currentClothing = null;
        }
      })
      .addCase(deleteClothing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to delete clothing item';
      })
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentClothing && state.currentClothing._id === action.payload.clothing._id) {
          state.currentClothing = action.payload.clothing;
        }
        const { clothingId, newReview } = action.payload;
        // Update reviews for the clothing item in all relevant places
        Object.keys(state.pages).forEach((page) => {
          const clothing = state.pages[page].find((c) => c._id === clothingId);
          if (clothing) {
            clothing.reviews = clothing.reviews || [];
            clothing.reviews.unshift(newReview); // Add new review at the top
            clothing.averageRating = action.payload.clothing.averageRating;
          }
        });
        const searchClothing = state.searchResults.clothing.find((c) => c._id === clothingId);
        if (searchClothing) {
          searchClothing.reviews = searchClothing.reviews || [];
          searchClothing.reviews.unshift(newReview);
          searchClothing.averageRating = action.payload.clothing.averageRating;
        }
        const filterClothing = state.filterResults.clothing.find((c) => c._id === clothingId);
        if (filterClothing) {
          filterClothing.reviews = filterClothing.reviews || [];
          filterClothing.reviews.unshift(newReview);
          filterClothing.averageRating = action.payload.clothing.averageRating;
        }
        if (state.currentClothing && state.currentClothing._id === clothingId) {
          state.currentClothing.reviews = state.currentClothing.reviews || [];
          state.currentClothing.reviews.unshift(newReview);
          state.currentClothing.averageRating = action.payload.clothing.averageRating;
        }
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to add review';
      })
      .addCase(getClothingReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getClothingReviews.fulfilled, (state, action) => {
        state.loading = false;
        const clothingId = action.meta.arg;
        Object.keys(state.pages).forEach((page) => {
          const clothing = state.pages[page].find((c) => c._id === clothingId);
          if (clothing) {
            clothing.reviews = action.payload.reviews;
            clothing.averageRating = action.payload.averageRating;
          }
        });
        const searchClothing = state.searchResults.clothing.find((c) => c._id === clothingId);
        if (searchClothing) {
          searchClothing.reviews = action.payload.reviews;
          searchClothing.averageRating = action.payload.averageRating;
        }
        const filterClothing = state.filterResults.clothing.find((c) => c._id === clothingId);
        if (filterClothing) {
          filterClothing.reviews = action.payload.reviews;
          filterClothing.averageRating = action.payload.averageRating;
        }
        if (state.currentClothing && state.currentClothing._id === clothingId) {
          state.currentClothing.reviews = action.payload.reviews;
          state.currentClothing.averageRating = action.payload.averageRating;
        }
      })
      .addCase(getClothingReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to fetch reviews';
      })
      .addCase(searchClothing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchClothing.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults.clothing = action.payload.clothing;
        state.searchResults.totalClothing = action.payload.totalClothing;
        state.searchResults.totalPages = action.payload.totalPages;
        state.searchResults.currentPage = action.payload.currentPage;
        state.searchResults.query = action.meta.arg.query;
      })
      .addCase(searchClothing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to search clothing items';
        state.searchResults.clothing = [];
      })
      .addCase(filterClothingByType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterClothingByType.fulfilled, (state, action) => {
        state.loading = false;
        state.filterResults.clothing = action.payload.clothing;
        state.filterResults.totalClothing = action.payload.totalClothing;
        state.filterResults.totalPages = action.payload.totalPages;
        state.filterResults.currentPage = action.payload.currentPage;
        state.filterResults.itemType = action.meta.arg.itemType || '';
      })
      .addCase(filterClothingByType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Failed to filter clothing items';
        state.filterResults.clothing = [];
      });
  },
});

export const { clearError, setCurrentPage, clearSearchResults, clearFilterResults, resetCache, resetCurrentClothing } = clothingSlice.actions;
export default clothingSlice.reducer;