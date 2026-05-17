import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {  ContentType, type DsNuclearCalculation, type SerializerCalcJSON, type SerializerModelCalcJSON, type SerializerStatusJSON  } from '../api/api';
import { apiClient } from '../api/apiClient';

type AddToCartInput = {
  model_id: number;
  calc_id?: number;
  amount?: number;
};

type ExtendedNuclearCalculation = DsNuclearCalculation & {
  models?: Array<{ model_id: number }>;
};

export const fetchCalculations = createAsyncThunk(
  'nuclear_calculations/fetchAll',
  async (filters: { "from_date"?: string; "to_date"?: string; status?: "draft" | "formed" | "completed" | "rejected" }, { rejectWithValue }) => {
    try {
      const response = await apiClient.api.nuclearCalculationsList(filters);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchDraftSummary = createAsyncThunk(
  'nuclear_calculations/draft', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.api.nuclearCalculationsItemsList();
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchCalculationById = createAsyncThunk(
  'nuclear_calculations/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await apiClient.api.nuclearCalculationsDetail(id);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addToDraft = createAsyncThunk(
  'nuclear_calculations/add',
  async (input: AddToCartInput, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.api.modelCalculationAddCreate(input.model_id, {
      body: input,
      type: ContentType.Json,
    } as any);
      dispatch(fetchDraftSummary());
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateDraftItem = createAsyncThunk(
  'nuclear_calculations/updateItem',
  async (
    data: { appId: number; modelId: number; calcId: number; input: SerializerModelCalcJSON },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await apiClient.api.modelCalculationUpdate(
        data.modelId,
        String(data.calcId),
        data.input
      );
      dispatch(fetchCalculationById(data.appId));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const removeFromDraft = createAsyncThunk(
  'nuclear_calculations/removeItem',
  async (
    data: { appId: number; modelId: number; calcId: number },
    { dispatch, rejectWithValue }
  ) => {
    try {
      await apiClient.api.modelCalculationDelete(
        data.modelId
      );
      dispatch(fetchCalculationById(data.appId));
      dispatch(fetchDraftSummary());
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const formDraft = createAsyncThunk(
  'nuclear_calculations/form',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.api.nuclearCalculationsFormUpdate(id);
      dispatch(fetchDraftSummary());
      dispatch(fetchCalculationById(id));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateDraft = createAsyncThunk(
  'nuclear_calculation/update',
  async (data: { id: number; desc: string }, { dispatch, rejectWithValue }) => {
    try {
      const payload: SerializerCalcJSON = {
        calc_id: data.id,
        description: data.desc,
      };
      await apiClient.api.nuclearCalculationsUpdate(data.id, payload);
      dispatch(fetchCalculationById(data.id));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const clearDraft = createAsyncThunk(
  'nuclear_calculations/clearDraft',
  async (id: number, { rejectWithValue }) => {
    try {
      const draft = await apiClient.api.nuclearCalculationsDetail(id);
      const extendedData = draft.data as ExtendedNuclearCalculation;
      if (extendedData?.models) {
      for (const model of extendedData.models) {
        await apiClient.api.modelCalculationDelete(
        model.model_id!
      );
      }
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const resolveCalculation = createAsyncThunk(
  'nuclear_calculations/resolve',
  async (
    data: {
      id: number;
      action: 'completed' | 'rejected';
      filters: { status?: "draft" | "formed" | "completed" | "rejected"; "from_date"?: string; "to_date"?: string; };
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const payload: SerializerStatusJSON = { status: data.action };
      await apiClient.api.nuclearCalculationsFinishUpdate(data.id, payload);
      dispatch(fetchCalculations(data.filters || {}));
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteCalculation = createAsyncThunk(
  'nuclear_calculations/delete',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await apiClient.api.nuclearCalculationsDelete(id);
      dispatch(fetchDraftSummary());
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    list: [] as any[],
    currentApp: null as any,
    draftId: null as number | null,
    loading: false,
    count: 0,
    error: null as string | null,
  },
  reducers: {
    clearDraftAndFilters: (state) => {
      state.draftId = null;
      state.list = [];
      state.currentApp = null;
      state.count = 0;
      state.error = null;
    },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      // fetchCalculations
      .addCase(fetchCalculations.fulfilled, (state, action) => { 
        state.loading = false; 
        state.list = action.payload || []; 
      })
      .addCase(fetchCalculations.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload as string; 
      })

      // fetchDraftSummary
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

      // fetchCalculationById
      .addCase(fetchCalculationById.pending, (state) => { state.loading = true; state.currentApp = null; state.error = null; })
      .addCase(fetchCalculationById.fulfilled, (state, action) => { state.loading = false; state.currentApp = action.payload; })
      .addCase(fetchCalculationById.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // addToDraft
      .addCase(addToDraft.pending, (state) => { state.loading = true; })
      .addCase(addToDraft.fulfilled, (state) => { state.loading = false; })
      .addCase(addToDraft.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // updateDraftItem
      .addCase(updateDraftItem.pending, (state) => { state.loading = true; })
      .addCase(updateDraftItem.fulfilled, (state) => { state.loading = false; })
      .addCase(updateDraftItem.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // removeFromDraft
      .addCase(removeFromDraft.pending, (state) => { state.loading = true; })
      .addCase(removeFromDraft.fulfilled, (state) => { state.loading = false; })
      .addCase(removeFromDraft.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // formDraft
      .addCase(formDraft.pending, (state) => { state.loading = true; })
      .addCase(formDraft.fulfilled, (state) => { state.loading = false; state.draftId = null; })
      .addCase(formDraft.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // resolveCalculation
      .addCase(resolveCalculation.pending, (state) => { state.loading = true; })
      .addCase(resolveCalculation.fulfilled, (state) => { state.loading = false; })
      .addCase(resolveCalculation.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })

      // deleteCalculation
      .addCase(deleteCalculation.pending, (state) => { state.loading = true; })
      .addCase(deleteCalculation.fulfilled, (state) => { state.loading = false; })
      .addCase(deleteCalculation.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  },
});

export const { clearDraftAndFilters, clearError } = applicationSlice.actions;
export default applicationSlice.reducer;