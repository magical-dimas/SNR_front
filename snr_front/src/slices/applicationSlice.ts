import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CalculationsApi, type M2MInput } from '../api/generated';

export const fetchCalculations = createAsyncThunk(
  'calculations/fetchAll',
  async (filters: { from_date?: string; to_date?: string; status?: string }) => {
    const response = await CalculationsApi.getCalculations(filters);
    return response.data;
  }
);

export const fetchDraftSummary = createAsyncThunk('nuclear_calculations/draft', async () => {
  const response = await CalculationsApi.getDraftSummary();
  return response.data; 
});

export const fetchCalculationById = createAsyncThunk('nuclear_calculations/fetchById', async (id: number) => {
  const response = await CalculationsApi.getCalculationById(id);
  return response.data;
});

export const addToDraft = createAsyncThunk('nuclear_calculations/add', async (input: M2MInput, { dispatch }) => {
  await CalculationsApi.addModelToCart(input);
  dispatch(fetchDraftSummary() as any);
});

export const updateDraftItem = createAsyncThunk('nuclear_calculations/updateItem', async (data: { appId: number, input: M2MInput }, { dispatch }) => {
  await CalculationsApi.updateCartItem(data.input);
  dispatch(fetchCalculationById(data.appId) as any);
});

export const removeFromDraft = createAsyncThunk('nuclear_calculations/removeItem', async (data: { appId: number, modelId: number }, { dispatch }) => {
  await CalculationsApi.removeModelFromCart(data.modelId);
  dispatch(fetchCalculationById(data.appId) as any);
  dispatch(fetchDraftSummary() as any);
});

export const formDraft = createAsyncThunk('nuclear_calculations/form', async (id: number, { dispatch }) => {
  await CalculationsApi.formCalculation(id);
  dispatch(fetchDraftSummary() as any);
  dispatch(fetchCalculationById(id) as any);
});

export const updateDraft = createAsyncThunk('nuclear_calculation/update', async (data: { id: number, desc: string }, { dispatch }) => {
  await CalculationsApi.updateCalculation(data.id, data.desc);
  dispatch(fetchCalculationById(data.id) as any);
});

export const clearDraft = createAsyncThunk('nuclear_calculations/clearDraft', async (id: number) => {
  const draft = await CalculationsApi.getCalculationById(id);
  for (const model of draft.data.models){
    await CalculationsApi.removeModelFromCart(model.model_id);
  }
});

export const resolveCalculation = createAsyncThunk(
  'nuclear_calculations/resolve',
  async (
    data: { 
      id: number; 
      action: 'completed' | 'rejected'; 
      filters?: { from_date?: string; to_date?: string; status?: string } 
    }, 
    { dispatch }
  ) => {
    await CalculationsApi.finishCalculation(data.id, data.action);
    dispatch(fetchCalculations(data.filters || {}));
  }
);

export const deleteCalculation = createAsyncThunk('nuclear_calculations/delete', async (id: number, { dispatch }) => {
  await CalculationsApi.removeCalculation(id);
  dispatch(fetchDraftSummary() as any);
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    list: [] as any[],
    currentApp: null as any,
    draftId: null as number | null,
    loading: false,
    count: 0,
  },
  reducers: {
    clearDraftAndFilters: (state) => {
      state.draftId = null;
      state.list = [];
      state.currentApp = null;
      state.count = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalculations.fulfilled, (state, action) => { state.list = action.payload || []; })

      .addCase(fetchDraftSummary.fulfilled, (state, action) => { 
        const data = action.payload;
        if (typeof data === 'number') {
            state.draftId = data > 0 ? data : null;
        } else if (data && typeof data === 'object') {
            state.draftId = data.id || data.draft_id || data.ID || data.draftId || null;
            state.count = data.model_count;
        } else {
            state.draftId = null;
            state.count = 0;
        }
      })

      .addCase(fetchCalculationById.pending, (state) => { state.loading = true; state.currentApp = null; })
      .addCase(fetchCalculationById.fulfilled, (state, action) => { state.loading = false; state.currentApp = action.payload; })

      .addCase(addToDraft.pending, (state) => { state.loading = true; })
      .addCase(addToDraft.fulfilled, (state) => { state.loading = false; })
      .addCase(addToDraft.rejected, (state) => { state.loading = false; })
      .addCase(updateDraftItem.pending, (state) => { state.loading = true; })
      .addCase(updateDraftItem.fulfilled, (state) => { state.loading = false; })
      .addCase(updateDraftItem.rejected, (state) => { state.loading = false; })
      .addCase(removeFromDraft.pending, (state) => { state.loading = true; })
      .addCase(removeFromDraft.fulfilled, (state) => { state.loading = false; })
      .addCase(removeFromDraft.rejected, (state) => { state.loading = false; })
      .addCase(formDraft.pending, (state) => { state.loading = true; })
      .addCase(formDraft.fulfilled, (state) => { state.loading = false; state.draftId = null; })
      .addCase(formDraft.rejected, (state) => { state.loading = false; })
      .addCase(resolveCalculation.pending, (state) => { state.loading = true; })
      .addCase(resolveCalculation.fulfilled, (state) => { state.loading = false; })
      .addCase(resolveCalculation.rejected, (state) => { state.loading = false; })
      .addCase(deleteCalculation.pending, (state) => { state.loading = true; })
      .addCase(deleteCalculation.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteCalculation.rejected, (state) => { state.loading = false; })
  },
});

export const { clearDraftAndFilters } = applicationSlice.actions;
export default applicationSlice.reducer;