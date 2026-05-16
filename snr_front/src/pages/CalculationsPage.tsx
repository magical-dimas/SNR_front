import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCalculations, resolveCalculation } from '../slices/applicationSlice';
import type { RootState, AppDispatch } from '../store';
import { Link } from 'react-router-dom';
import { ROUTES } from '../Routes';
import { BreadCrumbs } from '../components/BreadCrumbs';

export const CalculationsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector((state: RootState) => state.applications);
  const user = useSelector((state: RootState) => state.auth.user);

  const isModerator = user?.role === 2; 

  const [dateFrom, setDateFrom] = useState(''); 
  const [dateTo, setDateTo] = useState(''); 
  const [creatorFilter, setCreatorFilter] = useState('');

  const [appliedDateFrom, setAppliedDateFrom] = useState('');
  const [appliedDateTo, setAppliedDateTo] = useState('');
  const [appliedCreator, setAppliedCreator] = useState('');

  useEffect(() => {
    const loadData = () => {
      let finalDateTo = appliedDateTo;

      dispatch(fetchCalculations({
        from_date: appliedDateFrom, 
        to_date: finalDateTo 
      }));
    };

    loadData();
    const intervalId = setInterval(loadData, 5000);
    return () => clearInterval(intervalId);
  }, [dispatch, appliedDateFrom, appliedDateTo]);

  const handleResolve = (id: number, action: 'completed' | 'rejected') => {
    dispatch(resolveCalculation({ id, action }));
  };

  const getBadgeClass = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'formed': return 'secondary';
      case 'completed': return 'success';
      case 'rejected': return 'danger';
      default: return 'primary';
    }
  };

  const handleSearchClick = () => {
    setAppliedDateFrom(dateFrom);
    setAppliedDateTo(dateTo);
    if (isModerator) setAppliedCreator(creatorFilter);
  };

  const handleResetFilters = () => {
    setDateFrom(''); setDateTo(''); setCreatorFilter('');
    setAppliedDateFrom(''); setAppliedDateTo(''); setAppliedCreator('');
  };

  const displayedList = list.filter((calc: any) => {
    if (!isModerator || !appliedCreator) return true; 
    const login = (calc.creator_login || calc.CreatorLogin || '').toLowerCase();
    return login.includes(appliedCreator.toLowerCase());
  });

  const colClass = isModerator ? "col-md-3" : "col-md-4";

  return (
    <div className="app-container">
      <BreadCrumbs crumbs={[{ label: 'Все расчеты' }]} />
      <div className="bg-white p-4 shadow-sm mt-3 border">
        <h3 className="request-detail__title">
          {isModerator ? 'Журнал заявок' : 'Мои заявки'}
        </h3>

        <div className="row g-3 mb-4 mt-2 bg-light p-3">
          <div className={colClass}>
            <label className="normal-text fw-bold">Дата от:</label>
            <input 
              type="date" 
              className="auth-input" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)} 
              style={{backgroundColor: '#ffffff'}}
            />
          </div>
          <div className={colClass}>
            <label className="normal-text fw-bold">Дата до:</label>
            <input 
              type="date" 
              className="auth-input" 
              value={dateTo} 
              onChange={(e) => setDateTo(e.target.value)}
              style={{backgroundColor: '#ffffff'}}
            />
          </div>

          {isModerator && (
            <div className={colClass}>
              <label className="normal-text fw-bold">Создатель:</label>
              <input 
                type="text" 
                className="auth-input" 
                placeholder="Логин..."
                value={creatorFilter} 
                onChange={(e) => setCreatorFilter(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
                style={{backgroundColor: '#ffffff'}} 
              />
            </div>
          )}

          <div className={`${colClass} d-flex flex-column justify-content-end`}>
            <div className="d-flex gap-2">
              <button className="butn" onClick={handleResetFilters}>
                Сбросить
              </button>
              <button className="butn" onClick={handleSearchClick}>
                Поиск
              </button>
            </div>
          </div>
        </div>

        {loading && list.length === 0 && <p className="text-muted text-center py-3">Загрузка данных...</p>}

        <div className="table-responsive">
          <table className="request-table">
            <thead className="table-light align-middle">
              <tr>
                <th>ID Заявки</th>
                {isModerator && <th>Создатель</th>}
                <th>Дата формирования</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {displayedList.map((calc: any) => {
                let rawDate = calc.formed_at || calc.created_at;
                if (!rawDate) return '—';
                const mskDateStr = rawDate.endsWith('Z') 
                  ? rawDate.slice(0, -1) + '+03:00' 
                  : rawDate;

                const dateObj = new Date(mskDateStr);
                const formattedDate = dateObj.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={calc.id} className="align-middle text-center">
                    <td className="fw-bold">Заявка #{calc.calc_id}</td>

                    {isModerator && (
                      <td>{calc.creator_login || calc.CreatorLogin || 'Неизвестно'}</td>
                    )}

                    <td>{formattedDate}</td>
                    <td>
                      <span className={`badge bg-${getBadgeClass(calc.status)}`}>
                        {calc.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`${ROUTES.CALCULATIONS}/${calc.calc_id}`} className="butn-small">Просмотр</Link>

                      {isModerator && calc.status === 'formed' && (
                        <>
                          <button className="butn-green-small" onClick={() => handleResolve(calc.calc_id, 'completed')}>Подтвердить</button>
                          <button className="butn-danger-small" onClick={() => handleResolve(calc.calc_id, 'rejected')}>Отклонить</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
              {displayedList.length === 0 && !loading && (
                <tr>
                  <td colSpan={isModerator ? 5 : 4} className="text-center py-5 text-muted">Заявки не найдены</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};