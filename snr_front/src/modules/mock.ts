import ritm_vid from '../assets/ritm.mp4';

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
	image_url:    "http://localhost:9000/reactorservice/ritm.jpg",
	video:       ritm_vid,
  },
  {
	id:          2,
	name:        "HTR-PM",
	description: "HTR-PM - Китайский малый модульный ядерный реактор. Это высокотемпературный газоохлаждаемый реактор четвертого поколения с шаровым топливом, разработанный на основе прототипа HTR-10.",
	power:       210,
	fuel_usage:   260,
	image_url:    "",
	video:       ritm_vid,
  },
  {
	id:          3,
	name:        "КЛТ-40С",
	description: "КЛТ-40С - Российская плавучая атомная теплоэлектростанция (ПАТЭС) проекта 20870, находящаяся в порту города Певек (Чаунский район, Чукотского автономного округа), самая северная АЭС в мире.",
	power:       70,
	fuel_usage:   85,
	image_url:    "http://localhost:9000/reactorservice/klt.jpg",
	video:       ritm_vid,
  }
];

export const CART_MOCK = [
    { id: 1, radiation: REACTORS_MOCK[0], amount: 1 }
];