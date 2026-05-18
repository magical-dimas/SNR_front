import type { FC } from 'react';
import defaultImage from '../assets/DefaultImage.png';
import { useDispatch, useSelector } from "react-redux";
import { addToDraft } from "../slices/applicationSlice";
import type { RootState, AppDispatch } from "../store";
import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../utils/media';

interface ModelCardProps {
  model_id: number;
  title: string;
  short_desc: string;
  power: number;
  photo_url: string;
  similarity_score: number | null;
}

export const ModelCard: FC<ModelCardProps> = ({ model_id, title, short_desc, power, photo_url, similarity_score }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { isAuth } = useSelector((state: RootState) => state.auth);
  const { loading } = useSelector((state: RootState) => state.applications);

  const handleAdd = () => {
    dispatch(addToDraft({
      model_id: model_id,
      amount: 1
    }));
  };
  return (
    <div className="product-card">
            <Link to={`/${model_id}`} className="nav-item">
                <img src={resolveMediaUrl(photo_url) || defaultImage} alt={title} className="product-img" />

            <div className="product-info">
                <div className="product-title">{title}</div>
                <div className="product-specs">{short_desc}</div>
                <div className="product-specs">Мощность: {power} МВт</div>
                {similarity_score!=null && 
                  <div className="product-sim">Сходство: {similarity_score}%</div>
                }
              </div>
            </Link>
                {isAuth  &&
                <button onClick={handleAdd} className="butn" disabled={loading}>
                {loading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  'Добавить'
                )}
                </button>
                }
    </div>
  );
};