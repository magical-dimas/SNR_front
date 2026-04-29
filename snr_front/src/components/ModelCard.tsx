import type { FC } from 'react';
import defaultImage from '../assets/DefaultImage.png';

interface Props {
  model_id: number;
  title: string;
  short_desc: string;
  power: number;
  photo_url: string;
  similarity_score: number;
}

export const ModelCard: FC<Props> = ({ model_id, title, short_desc, power, photo_url, similarity_score }) => {
  return (
    <div className="product-card">
        <a href={`/${model_id}`} className="nav-item">
            <div>
                <img src={photo_url || defaultImage} alt={title} className="product-img" />
            </div>

            <div className="product-info">
                <div className="product-title">{title}</div>
                <div className="product-specs">{short_desc}</div>
                <div className="product-specs">Мощность: {power} МВт</div>
                {similarity_score!=null && 
                  <div className="product-sim">Сходство: {similarity_score}%</div>
                }
            </div>
        </a>
    </div>
  );
};