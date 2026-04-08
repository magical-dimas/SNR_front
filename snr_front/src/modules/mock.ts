import ritm_img from '../assets/ritm.jpg';
import klt_img from '../assets/klt.jpg';

export interface ReactorRange {
  id: number;
  name: string;
  description: string;
  power: number;
  fuel_usage: number;
  image_url: string;
  video: string;
}

export const REACTORS_MOCK: ReactorRange[] = [
  {
    id:          1,
	name:        "РИТМ-200",
	description: "РИТМ-200 - водо-водяной ядерный реактор, предназначенный для установки на ледоколах и перспективных плавучих атомных электростанциях, малых АЭС.",
	power:       55,
	fuel_usage:   45,
	image_url:   ritm_img,
	video:       "",
  },
  {
	id:          2,
	name:        "HTR-PM",
	description: "HTR-PM - Китайский малый модульный ядерный реактор. Это высокотемпературный газоохлаждаемый реактор четвертого поколения с шаровым топливом, разработанный на основе прототипа HTR-10.",
	power:       210,
	fuel_usage:   260,
	image_url:    "",
	video:       "",
  },
  {
	id:          3,
	name:        "КЛТ-40С",
	description: "КЛТ-40С - Российская плавучая атомная теплоэлектростанция (ПАТЭС) проекта 20870, находящаяся в порту города Певек (Чаунский район, Чукотского автономного округа), самая северная АЭС в мире.",
	power:       70,
	fuel_usage:   85,
	image_url:   klt_img,
	video:       "",
  }
];