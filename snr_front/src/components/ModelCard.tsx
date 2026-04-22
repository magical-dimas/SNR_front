import type { FC } from 'react';
import defaultImage from '../assets/DefaultImage.png';

interface Props {
  model_id: number;
  title: string;
  power: number;
  photo_url: string;
}

export const ModelCard: FC<Props> = ({ model_id, title, power, photo_url }) => {
  return (
    <div className="product-card">
        <a href={`/${model_id}`} className="nav-item">
            <div>
                <img src={photo_url || defaultImage} alt={title} className="product-img" />
            </div>

            <div className="product-info">
                <div className="product-title">{title}</div>
                <div className="product-specs">Мощность: {power} МВт</div>
            </div>
        </a>
    </div>
  );
};