import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BreadCrumbs } from '../components/BreadCrumbs';
import { fetchDraftSummary, updateDraft } from '../slices/applicationSlice';
import { tauriFetch } from '../api/tauriClient'; // 👇 Импортируем tauriFetch
import type { AppDispatch } from '../store';
import { ROUTES } from '../Routes';
import defaultImage from '../assets/DefaultImage.png';
import { resolveMediaUrl } from '../utils/media';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://10.46.79.236:8080';

const calculateModel = (power: number, fuel_usage: number, amount: number) => {
  return { res_power: power * amount * 30, res_fuel: fuel_usage * amount * 30 };
}

export const CalculationDetailPage: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [calcData, setCalcData] = useState<any>(null);
  const [localItems, setLocalItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [localDesc, setLocalDesc] = useState('');
  const [descLoading, setDescLoading] = useState(false);

  const loadCalculation = async () => {
    try {
      // 👇 Используем tauriFetch вместо apiClient
      const data = await tauriFetch(`${API_BASE}/api/nuclear_calculations/${id}`, {
        method: 'GET'
      });
      setCalcData(data);
      setLocalDesc(data.calc?.description ?? data.description ?? '');
      
      const items = data.models || [];
      setLocalItems(items.map((item: any) => ({ ...item })));
    } catch (e) {
      console.error(e);
      navigate(ROUTES.CALCULATIONS); 
    }
  };

  useEffect(() => {
    loadCalculation();
  }, [id]);

  const handleFieldChange = (idx: number, field: string, val: string) => {
    setLocalItems(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const handleUpdateItem = async (idx: number) => {
    const item = localItems[idx];
    const modelId = item.model_id ?? item.ModelID;
    const calcId = item.calc_id ?? item.CalcID;
    const payload = {
      calc_id: Number(calcId) || 0,
      model_id: Number(modelId) || 0,
      amount: Number(item.amount) || 0
    };

    setLoading(true);
    try {
      // 👇 Используем tauriFetch
      await tauriFetch(`${API_BASE}/api/model_calculation/${modelId}`, {
        method: 'PUT',
        body: payload
      });
    } catch (err: any) {
      console.error(err);
      alert("Ошибка обновления");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (modelId: number) => {
    setLoading(true);
    try {
      // 👇 Используем tauriFetch
      await tauriFetch(`${API_BASE}/api/model_calculation/${modelId}`, {
        method: 'DELETE'
      });
      await loadCalculation();
      dispatch(fetchDraftSummary());
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCalculation = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить заявку?')) return;
    setLoading(true);
    try {
      // 👇 Используем tauriFetch
      await tauriFetch(`${API_BASE}/api/nuclear_calculations/${id}`, {
        method: 'DELETE'
      });
      dispatch(fetchDraftSummary());
      navigate(ROUTES.MODELS);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormCalculation = async () => {
    setLoading(true);
    try {
      // 👇 Используем tauriFetch
      await tauriFetch(`${API_BASE}/api/nuclear_calculations/${id}/form`, {
        method: 'PUT'
      });
      dispatch(fetchDraftSummary());
      navigate(ROUTES.CALCULATIONS);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDescription = async () => {
    if (!id) return;
    setDescLoading(true);
    try {
      await dispatch(updateDraft({ id: Number(id), desc: localDesc })).unwrap();
    } catch (err) {
      console.error(err);
      alert("Ошибка обновления описания");
    } finally {
      setDescLoading(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  const totalNumbersDisplay = useMemo(() => {
    let sum_p = 0, sum_f = 0;
    localItems.forEach(item => {
      const { res_power, res_fuel } = calculateModel(
        Number(item.power), 
        Number(item.fuel), 
        Number(item.amount)
      );
      if (res_power > 0) sum_p += res_power;
      if (res_fuel > 0) sum_f += res_fuel;
    });
    return { sum_p, sum_f };
  }, [localItems]);

  if (!calcData) return <div className="app-container py-5 text-center">Загрузка заявки...</div>;

  const status = calcData.calc?.status || calcData.status;
  const isDraft = status === 'draft';

  return (
    <div className="app-container">
      <BreadCrumbs crumbs={[
        { label: 'Все расчеты', path: ROUTES.CALCULATIONS },
        { label: `Заявка #${id}` }
      ]} />
      
      <div className="bg-white p-4 shadow-sm mt-3">
        <h3 className="request-detail__title">
          Заявка #{id} <span className="fs-5" style={{color: '#333333'}}>(Статус: {status})</span>
        </h3>

        <div className="mb-4">
          <label className="normal-text fw-bold">Описание заявки: </label>
          <div className="d-flex gap-2 align-items-start">
            <textarea
              className="auth-input flex-grow-1"
              rows={2}
              value={localDesc}
              onChange={(e) => setLocalDesc(e.target.value)}
              readOnly={!isDraft || descLoading}
              placeholder={isDraft ? "Введите описание заявки..." : "Описание отсутствует"}
              style={{ backgroundColor: '#ffffff', fontSize: '14px', resize: 'vertical' }}
            />
            {isDraft && (
              <button
                className="butn"
                onClick={handleUpdateDescription}
                disabled={descLoading}
                style={{ whiteSpace: 'nowrap' }}
              >
                {descLoading ? 'Сохранение...' : 'Сохранить'}
              </button>
            )}
          </div>
        </div>
        
        {localItems.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="request-table">
                <thead className="table-light text-center align-middle">
                  <tr style={{textAlign: 'center', alignItems: ''}}>
                    <th>Изображение</th>
                    <th>Модель</th>
                    <th>Мощность</th>
                    <th>Расход топлива</th>
                    <th>Количество</th>
                    <th>Энергия</th>
                    <th>Затраты</th>
                    {isDraft && <th>Действия</th>}
                  </tr>
                </thead>
                <tbody>
                  {localItems.map((item, idx) => {
                    const modelId = item.model_id;
                    const { res_power, res_fuel } = calculateModel(
                      Number(item.power), 
                      Number(item.fuel), 
                      Number(item.amount)
                    );

                    return (
                      <tr key={idx} className="align-middle text-center">
                        <td className="request-table__col-photo">
                          <img src={resolveMediaUrl(item.photo) || defaultImage} alt={item.title}/>
                        </td>
                        <td>{item.title}</td>
                        <td>{item.power}</td>
                        <td>{item.fuel}</td>
                        <td>
                          <input 
                            type="number" 
                            className="input" 
                            style={{ width: '100px' }}
                            value={item.amount} 
                            onChange={e => handleFieldChange(idx, 'amount', e.target.value)} 
                            step="any" 
                            readOnly={!isDraft || loading} 
                            min="1"
                            onKeyDown={handleInputKeyDown}
                          />
                        </td>
                        <td className="request-table__col-result">{(res_power/1000).toFixed(2)} ГВт</td>
                        <td className="request-table__col-result">{(res_fuel/1000).toFixed(2)} кг</td>
                        {isDraft && (
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <button 
                                className="butn-small" 
                                title="Сохранить изменения" 
                                disabled={loading}
                                onClick={() => handleUpdateItem(idx)}
                              >
                                Обновить
                              </button>
                              <button 
                                className="butn-danger-small" 
                                title="Удалить диапазон" 
                                disabled={loading}
                                onClick={() => handleRemoveItem(modelId)}
                              >
                                Удалить
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="result mt-4 d-flex justify-content-between align-items-center">
              <div style={{color: '#333333'}}>Количество учтённых в расчёте моделей:</div>
              <div className="fw-bold">{calcData.calc?.completed_item_count || 0}</div>
            </div>
            <div className="result mt-4 d-flex justify-content-between align-items-center">
              <div style={{color: '#333333'}}>Общая мощность:</div>
              <div className="fw-bold">
                {calcData.calc?.completed_item_count != 0 ? ((totalNumbersDisplay.sum_p/1000).toFixed(2)) : 0} ГВт
              </div>
            </div>
            <div className="result mt-4 d-flex justify-content-between align-items-center">
              <div style={{color: '#333333'}}>Общий расход топлива:</div>
              <div className="fw-bold">
                {calcData.calc?.completed_item_count != 0 ? ((totalNumbersDisplay.sum_f/1000).toFixed(2)) : 0} кг
              </div>
            </div>

            {isDraft && (
              <div className="d-flex gap-3 mt-4">
                <button 
                  className="butn-danger btn-outline-danger w-50 py-2" 
                  onClick={handleDeleteCalculation} 
                  disabled={loading}
                >
                  Удалить заявку
                </button>
                <button 
                  className="butn btn-outline-danger w-50 py-2" 
                  onClick={handleFormCalculation} 
                  disabled={loading}
                >
                  Сформировать
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-5 bg-light">
            <h5>Ваша заявка пока пуста.</h5>
            <p>Добавьте модели реакторов из каталога.</p>
            <Link to="/" className="butn">
              Перейти в каталог
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};