import { useEffect, useState } from "react";
import type { FC } from "react";
import { useParams } from "react-router-dom";
import { REACTORS_MOCK } from "../modules/mock";
import type { ReactorRange } from "../modules/mock";
import { BreadCrumbs } from "../components/BreadCrumbs";
import defaultVid from '../assets/default.mp4';
import { resolveMediaUrl } from "../utils/media";

export const ModelDetailPage: FC = () => {
  const { id } = useParams();
  const [reactor, setReactor] = useState<ReactorRange | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:8080/api/models/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setReactor(data);
      } catch (err) {
        console.warn("Бэкенд недоступен", err);
        const item = REACTORS_MOCK.find(r => r.model_id === parseInt(id));
        if (item) setReactor(item);
      }
    };
    fetchItem();
  }, [id]);

  if (!reactor) return <div>Загрузка...</div>;

  return (
    <div>
      <BreadCrumbs
        crumbs={[
          { label: reactor.title },
        ]}
      />
      <div className="detail-wrapper">
      <div className="detail-card">
        <div className="detail-card__video-wrap">
            <video className="detail-card__video" controls autoPlay muted loop playsInline>
              <source src={`${resolveMediaUrl(reactor.video)}` || defaultVid} type="video/mp4" />
            </video>
            <div className="detail-card__overlay"></div>
        </div>

        <div className="detail-card__content">
            <div className="detail-card__body">
                <h1 className="detail-card__title">{ reactor.title }</h1>
                <div className="detail-card__params">
                    <span>Мощность: { reactor.power }</span>
                    <span>Расход топлива: { reactor.fuel_usage }</span>
                </div>
                <p className="detail-card__description">{ reactor.description }</p>
            </div>
        </div>
    </div>
    </div>
    </div>
  );
};