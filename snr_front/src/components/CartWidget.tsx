import type { FC } from 'react';
import { useState, useEffect } from "react";

export const CartWidget: FC = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch('/api/nuclear_calculations/items')
      .then(res => {
        if (!res.ok) throw new Error('Ошибка сети');
        return res.json();
      })
      .then(data => setCount(data.count))
      .catch((err) => {
        console.warn('Бэкенд недоступен', err);
        setCount(0);
      });
  }, []);
  return (
    <div className="cart-btn-inactive" title="Текущая заявка">
        <span className="cart_btn_img">&#x2622;</span>
        <span className="request-icon__badge--inactive">{count}</span>
    </div>
  );
};