import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tauriFetch } from '../api/tauriClient';
import type { 
  DsNuclearCalculation, 
  SerializerModelCalcJSON, 
  SerializerCalcJSON, 
  SerializerStatusJSON 
} from '../api/api';

// Базовый URL бэкенда (берётся из env или фоллбэк)
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://10.46.79.236:8080';

type AddToCartInput = {
  model_id: number;
  amount?: number;
};

type ExtendedNuclearCalculation = DsNuclearCalculation & {
  models?: Array<{ model_id: number }>;
};

// Вспомогательная функция для сборки query-строки
const buildQuery = (params: Record<string, string | undefined>) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined) qs.append(key, val);
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
};

// ===== THUNKS =====

export const fetchCalculations = createAsyncThunk(
  'nuclear_calculations/fetchAll',
  async (filters: { from_date?: string; to_date?: string; status?: string }, { rejectWithValue }) => {
    try {
      const qs = buildQuery({ from_date: filters.from_date, to_date: filters.to_date, status: filters.status });
      const data = await tauriFetch(`${API_BASE}/api/nuclear_calculations${qs}`, { method: 'GET' });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchDraftSummary = createAsyncThunk(
  'nuclear_calculations/draft',
  async (_, { rejectWithValue }) => {
    try {
      return await tauriFetch(`${API_BASE}/api/nuclear_calculations/items`, { method: 'GET' });
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCalculationById = createAsyncThunk(
  'nuclear_calculations/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await tauriFetch(`${API_BASE}/api/nuclear_calculations/${id}`, { method: 'GET' });
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addToDraft = createAsyncThunk(
  'nuclear_calculations/add',
  async (input: AddToCartInput, { dispatch, rejectWithValue }) => {
    try {
      await tauriFetch(`${API_BASE}/api/model_calculation/add/${input.model_id}`, {
        method: 'POST',
        body: { amount: input.amount }
      });
      dispatch(fetchDraftSummary());
    } catch (err: any) {
      return rejectWithValue(err.message);
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
      await tauriFetch(`${API_BASE}/api/model_calculation/${data.modelId}/${data.calcId}`, {
        method: 'PUT',
        body: data.input
      });
      dispatch(fetchCalculationById(data.appId));
    } catch (err: any) {
      return rejectWithValue(err.message);
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
      await tauriFetch(`${API_BASE}/api/model_calculation/${data.modelId}/${data.calcId}`, { 
        method: 'DELETE' 
      });
      dispatch(fetchCalculationById(data.appId));
      dispatch(fetchDraftSummary());
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const formDraft = createAsyncThunk(
  'nuclear_calculations/form',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await tauriFetch(`${API_BASE}/api/nuclear_calculations/${id}/form`, { method: 'PUT' });
      dispatch(fetchDraftSummary());
      dispatch(fetchCalculationById(id));
    } catch (err: any) {
      return rejectWithValue(err.message);
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
      await tauriFetch(`${API_BASE}/api/nuclear_calculations/${data.id}`, { 
        method: 'PUT', 
        body: payload 
      });
      dispatch(fetchCalculationById(data.id));
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearDraft = createAsyncThunk(
  'nuclear_calculations/clearDraft',
  async (id: number, { rejectWithValue }) => {
    try {
      const draft = await tauriFetch<ExtendedNuclearCalculation>(`${API_BASE}/api/nuclear_calculations/${id}`, { method: 'GET' });
      if (draft?.models) {
        for (const model of draft.models) {
          if (model.model_id) {
            await tauriFetch(`${API_BASE}/api/model_calculation/${model.model_id}/${id}`, { method: 'DELETE' });
          }
        }
      }
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const resolveCalculation = createAsyncThunk(
  'nuclear_calculations/resolve',
  async (
    data: { 
      id: number; 
      action: 'completed' | 'rejected'; 
      filters?: { from_date?: string; to_date?: string; status?: string } 
    }, 
    { dispatch, rejectWithValue }
  ) => {
    try {
      const payload: SerializerStatusJSON = { status: data.action };
      await tauriFetch(`${API_BASE}/api/nuclear_calculations/${data.id}/finish`, { 
        method: 'PUT', 
        body: payload 
      });
      dispatch(fetchCalculations(data.filters || {}));
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCalculation = createAsyncThunk(
  'nuclear_calculations/delete',
  async (id: number, { dispatch, rejectWithValue }) => {
    try {
      await tauriFetch(`${API_BASE}/api/nuclear_calculations/${id}`, { method: 'DELETE' });
      dispatch(fetchDraftSummary());
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ===== SLICE =====

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
    clearError: (state) => { 
      state.error = null; 
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchCalculations
      .addCase(fetchCalculations.pending, (state) => { state.error = null; })
      .addCase(fetchCalculations.fulfilled, (state, action) => { 
        state.list = action.payload || []; 
      })
      .addCase(fetchCalculations.rejected, (state, action) => { 
        state.error = action.payload as string; 
      })

      // fetchDraftSummary
      .addCase(fetchDraftSummary.fulfilled, (state, action) => { 
        const data = action.payload as any;
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