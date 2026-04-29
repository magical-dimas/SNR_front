export interface ReactorRange {
  id: number;
  name: string;
  description: string;
  short_desc: string;
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
	short_desc:  "Russian PWR powering icebreakers and future floating or small land-based nuclear plants",
	power:       55,
	fuel_usage:   45,
	image_url:   "",
	video:       "",
  },
  {
	id:          2,
	name:        "HTR-PM",
	description: "HTR-PM - Китайский малый модульный ядерный реактор. Это высокотемпературный газоохлаждаемый реактор четвертого поколения с шаровым топливом, разработанный на основе прототипа HTR-10.",
	short_desc:  "Chinese Gen-4 HTGR with pebble-bed fuel, developed as an advanced successor to the HTR-10",
	power:       210,
	fuel_usage:   260,
	image_url:    "",
	video:       "",
  },
  {
	id:          3,
	name:        "КЛТ-40С",
	description: "КЛТ-40С - Российская плавучая атомная теплоэлектростанция (ПАТЭС) проекта 20870, находящаяся в порту города Певек (Чаунский район, Чукотского автономного округа), самая северная АЭС в мире.",
	short_desc:  "Russian floating NPP deployed in Pevek, operating as the world’s northernmost nuclear facility",
	power:       70,
	fuel_usage:   85,
	image_url:   "",
	video:       "",
  }
];