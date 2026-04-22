import { useState, useEffect, useRef } from "react";
import type { FC } from "react";
import { REACTORS_MOCK } from "../modules/mock";
import type { ReactorRange } from "../modules/mock";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ModelCard } from "../components/ModelCard";
import { CartWidget } from "../components/CartWidget";
import { useReactorSearch } from "../hooks/useReactorSearch";

export const ModelsPage: FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [fetchedReactors, setFetchedReactors] = useState<ReactorRange[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { 
    items: displayReactors, 
    ready, 
    searchByImage, 
    resetSearch 
  } = useReactorSearch(fetchedReactors);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      fetchReactors(searchValue);
    }
  };

  const fetchReactors = async (search: string = "") => {
    setIsLoading(true);
    try {
      const query = search ? `?Title=${encodeURIComponent(search)}` : "";
      const res = await fetch(`/api/models${query}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setFetchedReactors(data);
    } catch (error) {
      console.warn("Fallback на mock-данные", error);
      const filtered = REACTORS_MOCK.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
      setFetchedReactors(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchReactors(); }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      searchByImage(imageUrl);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    resetSearch();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <BreadCrumbs crumbs={[]} />
      
      <div className="sub-header">
        <div className="search-box">
            <input 
              type="text" 
              placeholder="Поиск моделей..." 
              value={searchValue} 
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="search-input" 
            />
            <button className="cart-btn" onClick={() => fetchReactors(searchValue)}>Найти</button>
        </div>
        <CartWidget/>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '20px', marginLeft: '20px' }}>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()} 
          className="cart-btn"
          style={{height: '50px'}}
          disabled={!ready}
        >
          {ready ? 'Найти по картинке' : 'Загрузка CLIP...'}
        </button>

        {selectedImage && (
          <>
            <img src={selectedImage} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
            <button onClick={handleClearImage} className="cart-btn" style={{ height: '50px' }}>Сбросить</button>
          </>
        )}
      </div>


      <main className="container">
      {isLoading ? (
        <p>Загрузка данных...</p>
      ) : (
        <div className="products-grid">
          {displayReactors.length > 0 ? (
            displayReactors.map((item) => (
              <ModelCard key={item.model_id} {...item} />
            ))
          ) : (
            <h4 style={{color: "#333333"}}>Ничего не найдено</h4>
          )}
        </div>
      )}
      </main>
    </div>
  );
};