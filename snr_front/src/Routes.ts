export const ROUTES = {
  MODELS: "/",
};

export type RouteKeyType = keyof typeof ROUTES;
export const ROUTE_LABELS: { [key in RouteKeyType]: string } = {
  MODELS: "Каталог моделей",
};