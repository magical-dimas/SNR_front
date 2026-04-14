import { useState } from "react";
import type { FC } from "react";
import { REACTORS_MOCK } from "../modules/mock";
import type { ReactorRange } from "../modules/mock";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { ModelCard } from "../components/ModelCard";
import { CartWidget } from "../components/CartWidget";

export const ModelsPage: FC = () => {
  const [searchValue, setSearchValue] = useState("");
  const [reactors, setReactors] = useState<ReactorRange[]>(REACTORS_MOCK);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = () => {
    const filtered = REACTORS_MOCK.filter(item => 
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setReactors(filtered);
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
            <button className="cart-btn" onClick={() => handleSearch()}>Найти</button>
        </div>
        <CartWidget/>
      </div>
      

      <main className="container">
      <div className="products-grid">
        {reactors.length > 0 ? (
          reactors.map((item) => (
            <ModelCard key={item.id} {...item} />
          ))
        ) : (
          <h4 style={{color: "#333333"}}>Ничего не найдено</h4>
        )}
      </div>
      </main>
    </div>
  );
};