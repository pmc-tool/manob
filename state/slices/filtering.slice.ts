import { createSlice, PayloadAction } from "@reduxjs/toolkit";
 
const initialState: any = {
    category: [],
    pricing: {
      id: "price",
      name: "Price",
      doc_count: 0,
      priceMin: 0,
      priceMax: 0,
      type: "pricingFilter",
    },
    attributes: [],
};

const filteringStore = createSlice({
  name: "filteringStore",
  initialState,
  reducers: {
    // Product Filter
    setCategoryFilter(state, action: PayloadAction<Object | []>) {
      state.category = action.payload || [];
    },
    setPricingFilter(state, action: PayloadAction<Object | []>) {
      state.pricing = action.payload || [];
    },
    setAttributeFilter(state, action: PayloadAction<Object | []>) {
      state.attributes = action.payload || [];
    },
    setPricingMin(state, action: PayloadAction<number | string>) {
      state.pricing.priceMin = action.payload;
      state.pricing.name = `${action.payload} to ${state.pricing.priceMax}` || 'Price';
      state.pricing.id = 'price';
    },
    setPricingMax(state, action: PayloadAction<number | string>) {
      state.pricing.priceMax = action.payload || 0;
      state.pricing.name = `${state.pricing.priceMin} to ${action.payload}` || 'Price';
      state.pricing.id = 'price';
    },
    // Service Filter
    // setServiceCategoryFilter(state, action: PayloadAction<Object | []>) {
    //   state.serviceFilter.category = action.payload || [];
    // },
    // setServicePricingFilter(state, action: PayloadAction<Object | []>) {
    //   state.serviceFilter.pricing = action.payload || [];
    // },
    // setServiceAttributeFilter(state, action: PayloadAction<Object | []>) {
    //   state.serviceFilter.attributes = action.payload || [];
    // },
    // setServicePricingMin(state, action: PayloadAction<number | string>) {
    //   state.serviceFilter.pricing.priceMin = action.payload;
    //   state.serviceFilter.pricing.name = `${action.payload} to ${state.serviceFilter.pricing.priceMax}` || 'Price';
    //   state.serviceFilter.pricing.id = 'price';
    // },
    // setServicePricingMax(state, action: PayloadAction<number | string>) {
    //   state.serviceFilter.pricing.priceMax = action.payload || 0;
    //   state.serviceFilter.pricing.name = `${state.serviceFilter.pricing.priceMin} to ${action.payload}` || 'Price';
    //   state.serviceFilter.pricing.id = 'price';
    // },
    // Reset Filter
    resetFilter(state) {
      return initialState;
    },
    resetPricingFilter(state) { 
      let d = state;
      d.pricing = initialState.pricing
      state = d;
    },
    // resetServicePricingFilter(state) {
    //   let d = state.serviceFilter;
    //   d.pricing = initialState.serviceFilter.pricing
    //   state.serviceFilter = d;
    // },
  },
});

export const {
  setPricingFilter,
  setAttributeFilter,
  setCategoryFilter,
  resetFilter,
  setPricingMin,
  setPricingMax,
  // setServiceCategoryFilter,
  // setServicePricingFilter,
  // setServiceAttributeFilter,
  // setServicePricingMin,
  // setServicePricingMax,
  resetPricingFilter,
  // resetServicePricingFilter,
} = filteringStore.actions;

export default filteringStore.reducer;
