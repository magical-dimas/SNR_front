import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ROUTES } from "./Routes";
import { NavBar } from "./components/NavBar";
import { ModelsPage } from "./pages/ModelsPage";
import { ModelDetailPage } from "./pages/ModelDetailPage";
import { CalculationsPage } from "./pages/CalculationsPage";
import { CalculationDetailPage } from "./pages/CalculationDetailPage";
import { AuthPage } from "./pages/AuthPage";
import { fetchDraftSummary } from "./slices/applicationSlice";
import type { RootState, AppDispatch } from "./store";
import { RegisterPage } from "./pages/RegisterPage";


function App() {
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.applications.loading);
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);

  useEffect(() => {
    if (isAuth) {
      dispatch(fetchDraftSummary());
    }
  }, [isAuth, dispatch]);

  return (
    <BrowserRouter>
      {isLoading && (
        <div 
            className="global-loader position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
            style={{ backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 9999 }}
        >
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      )}
      
      <div className="container mt-4" style={{ maxWidth: '1200px' }}>
        <NavBar />
        
        <Routes>
          <Route path={ROUTES.MODELS} element={<ModelsPage />} />
          <Route path={ROUTES.LOGIN} element={<AuthPage type="login" />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage/>} />

          <Route path={ROUTES.CALCULATIONS} element={<CalculationsPage />} />
          <Route path={`${ROUTES.CALCULATIONS}/:id`} element={<CalculationDetailPage />} />

          <Route path="/:id" element={<ModelDetailPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;