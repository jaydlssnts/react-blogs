import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BlogState {
  items: any[];
  currentBlog: any | null;
  isLoading: boolean;
}

const initialState: BlogState = {
  items: [],
  currentBlog: null,
  isLoading: false,
};

export const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogs: (state, action: PayloadAction<any[]>) => {
      state.items = action.payload;
    },
    setCurrentBlog: (state, action: PayloadAction<any>) => {
      state.currentBlog = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setBlogs, setCurrentBlog, setLoading } = blogSlice.actions;
export default blogSlice.reducer;
