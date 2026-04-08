import type { FC } from 'react';
import defaultImage from '../assets/DefaultImage.png';

interface Props {
  id: number;
  name: string;
  power: number;
  image_url: string;
}

export const ModelCard: FC<Props> = ({ id, name, power, image_url }) => {
  return (
    <div className="product-card">
        <a href={`/${id}`} className="nav-item">
            <div>
                <img src={image_url || defaultImage} alt={name} className="product-img" />
            </div>

            <div className="product-info">
                <div className="product-title">{name}</div>
                <div className="product-specs">Мощность: {power} МВт</div>
            </div>
        </a>
        {/* <form method="POST" action="/nuclear_calculations/add">
            <input type="hidden" name="model_id" value="{id}" />
            <button type="submit" className="btn">Добавить в заявку</button>
        </form> */}
    </div>
  );
};