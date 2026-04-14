import type { FC } from 'react';

export const CartWidget: FC = () => {
  return (
    <div className="cart-btn-inactive" title="Текущая заявка">
        <span className="cart_btn_img">&#x2622;</span>
        <span className="request-icon__badge--inactive">0</span>
    </div>
  );
};