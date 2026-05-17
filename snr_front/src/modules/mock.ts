export interface ReactorRange {
  model_id: number;
  title: string;
  description: string;
  short_desc: string;
  power: number;
  fuel_usage: number;
  photo_url: string;
  video: string;
  similarity_score: number | null;
}

export const REACTORS_MOCK: ReactorRange[] = [
  {
    model_id:          1,
	title:        "РИТМ-200",
	description: "Водо-водяной ядерный реактор, предназначенный для установки на ледоколах и перспективных плавучих атомных электростанциях, малых АЭС.",
	short_desc:  "Russian PWR powering icebreakers and future floating or small land-based nuclear plants",
	power:       55,
	fuel_usage:   45,
	photo_url:   "",
	video:       "",
	similarity_score: null,
  },
  {
	model_id:          2,
	title:        "HTR-PM",
	description: "Китайский малый модульный ядерный реактор. Это высокотемпературный газоохлаждаемый реактор четвертого поколения с шаровым топливом, разработанный на основе прототипа HTR-10.",
	short_desc:  "Chinese Gen-4 HTGR with pebble-bed fuel, developed as an advanced successor to the HTR-10",
	power:       210,
	fuel_usage:   260,
	photo_url:    "",
	video:       "",
	similarity_score: null,
  },
  {
	model_id:          3,
	title:        "КЛТ-40С",
	description: "Российская плавучая атомная теплоэлектростанция (ПАТЭС) проекта 20870, находящаяся в порту города Певек (Чаунский район, Чукотского автономного округа), самая северная АЭС в мире.",
	short_desc:  "Russian floating NPP deployed in Pevek, operating as the world’s northernmost nuclear facility",
	power:       70,
	fuel_usage:   85,
	photo_url:   "",
	video:       "",
	similarity_score: null,
  }
];