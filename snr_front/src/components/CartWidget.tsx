import type { FC } from 'react';
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { ROUTES } from "../Routes";

export const CartWidget: FC = () => {
  const count = useSelector((state: RootState) => state.applications.count);
  const draftId = useSelector((state: RootState) => state.applications.draftId);
  return (
    <div>
      {count!=0 && 
        <a href={`${ROUTES.CALCULATIONS}/${draftId}`} className="cart-btn" title="Текущая заявка">
          <span className="cart_btn_img">&#x2622;</span>
          <span className="request-icon__badge">{count}</span>
        </a>
      }
      {count==0 && 
        <div className="cart-btn-inactive" title="Текущая заявка">
          <span className="cart_btn_img">&#x2622;</span>
          <span className="request-icon__badge--inactive">0</span>
        </div>
      }
    </div>
  );
};