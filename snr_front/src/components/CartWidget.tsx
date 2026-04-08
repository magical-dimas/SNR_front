import type { FC } from 'react';

export const CartWidget: FC = () => {
  return (
    <div className="cart-btn" title="Текущая заявка">
        <span className="cart_btn_img">&#x2622;</span>
        <span className="request-icon__badge">0</span>
    </div>
  );
};