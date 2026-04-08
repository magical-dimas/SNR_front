import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./Routes";
import { NavBar } from "./components/NavBar";
import { ModelsPage } from "./pages/ModelsPage";
import { ModelDetailPage } from "./pages/ModelDetailPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ margin: '0 auto' }}>
        <NavBar />
      </div>
      
      <Routes>
        <Route path={ROUTES.MODELS} element={<ModelsPage />} />
        
        <Route path="/:id" element={<ModelDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;