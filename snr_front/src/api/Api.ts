/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsEngineers {
  engineerID?: number;
  isTechnician?: boolean;
  login?: string;
  password?: string;
}

export interface DsModel {
  description?: string;
  fuelUsage?: number;
  isDeleted?: boolean;
  modelID?: number;
  photoURL?: string;
  power?: number;
  shortDesc?: string;
  title?: string;
  video?: string;
}

export interface DsNuclearCalculation {
  calcID?: number;
  createdAt?: string;
  creator?: DsEngineers;
  creatorID?: number;
  description?: string;
  finishDate?: string;
  formingDate?: string;
  moderator?: DsEngineers;
  moderatorID?: number;
  status?: string;
}

export interface SerializerCalcJSON {
  calc_id?: number;
  completed_item_count?: number;
  created_at?: string;
  creator_login?: string;
  description?: string;
  finish_date?: string;
  forming_date?: string;
  moderator_login?: string;
  status?: string;
}

export interface SerializerEngineerJSON {
  id?: number;
  is_technician?: boolean;
  login?: string;
  password?: string;
}

export interface SerializerModelCalcJSON {
  amount?: number;
  calc_id?: number;
  model_id?: number;
  res_fuel?: number;
  res_power?: number;
}

export interface SerializerStatusJSON {
  status?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title RIP Project Nuclear Calc API
 * @version 1.0
 * @contact
 *
 * API сервера для расчета ядерных реакторов
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Выдает JWT токен в случае успешной авторизации
     *
     * @tags Пользователи
     * @name EngineersLoginCreate
     * @summary Авторизация (Login)
     * @request POST:/api/engineers/login
     */
    engineersLoginCreate: (
      input: SerializerEngineerJSON,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>, any>({
        path: `/api/engineers/login`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Помещает переданный JWT в Blacklist Redis'а
     *
     * @tags Пользователи
     * @name EngineersLogoutCreate
     * @summary Выход (Logout)
     * @request POST:/api/engineers/logout
     * @secure
     */
    engineersLogoutCreate: (params: RequestParams = {}) =>
      this.request<any, any>({
        path: `/api/engineers/logout`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Пользователи
     * @name EngineersRegisterCreate
     * @summary Регистрация пользователя
     * @request POST:/api/engineers/register
     */
    engineersRegisterCreate: (
      input: SerializerEngineerJSON,
      params: RequestParams = {},
    ) =>
      this.request<DsEngineers, any>({
        path: `/api/engineers/register`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Корзина
     * @name ModelCalculationAddCreate
     * @summary Добавление модели в корзину (черновик)
     * @request POST:/api/model_calculation/add/{model_id}
     * @secure
     */
    modelCalculationAddCreate: (modelId: number, params: RequestParams = {}) =>
      this.request<Record<string, string>, any>({
        path: `/api/model_calculation/add/${modelId}`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Корзина
     * @name ModelCalculationUpdate
     * @summary Обновление элемента в корзине
     * @request PUT:/api/model_calculation/{model_id}
     * @secure
     */
    modelCalculationUpdate: (
      modelId: number,
      calcId: string,
      input: SerializerModelCalcJSON,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/model_calculation/${modelId}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Корзина
     * @name ModelCalculationDelete
     * @summary Удаление элемента из корзины
     * @request DELETE:/api/model_calculation/{model_id}
     * @secure
     */
    modelCalculationDelete: (
      modelId: number,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/model_calculation/${modelId}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Возвращает список всех моделей реакторов из каталога
     *
     * @tags Услуги
     * @name ModelsList
     * @summary Получение всех услуг
     * @request GET:/api/models
     */
    modelsList: (
      query?: {
        /** Поиск по названию */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsModel[], any>({
        path: `/api/models`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Доступно только Технику
     *
     * @tags Услуги
     * @name ModelsCreate
     * @summary Добавление новой услуги
     * @request POST:/api/models
     * @secure
     */
    modelsCreate: (
      data: {
        /** Название */
        name: string;
        /** Описание */
        description?: string;
        /** Краткое описание */
        short_desc?: string;
        /** Мощность */
        power?: number;
        /** Расход Топлива */
        fuel_usage?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<DsModel, any>({
        path: `/api/models`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Услуги
     * @name ModelsDetail
     * @summary Получение услуги по ID
     * @request GET:/api/models/{id}
     */
    modelsDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsModel, any>({
        path: `/api/models/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Заявки
     * @name NuclearCalculationsList
     * @summary Список всех сформированных заявок (с фильтрами)
     * @request GET:/api/nuclear_calculations
     * @secure
     */
    nuclearCalculationsList: (
      query?: {
        /** Фильтр по статусу */
        status?: "draft" | "formed" | "completed" | "rejected";
        /**
         * Дата от (формат: YYYY-MM-DD)
         * @format date
         * @example ""2024-01-01""
         */
        "from_date"?: string;
        /**
         * Дата до (формат: YYYY-MM-DD)
         * @format date
         * @example ""2024-12-31""
         */
        "to_date"?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<Record<string, any>[], any>({
        path: `/api/nuclear_calculations`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Заявки
     * @name NuclearCalculationsItemsList
     * @summary Получение иконки корзины (сводка черновика)
     * @request GET:/api/nuclear_calculations/items
     * @secure
     */
    nuclearCalculationsItemsList: (params: RequestParams = {}) =>
      this.request<Record<string, any>, any>({
        path: `/api/nuclear_calculations/items`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Заявки
     * @name NuclearCalculationsDetail
     * @summary Получение заявки по ID
     * @request GET:/api/nuclear_calculations/{id}
     * @secure
     */
    nuclearCalculationsDetail: (id: number, params: RequestParams = {}) =>
      this.request<DsNuclearCalculation, any>({
        path: `/api/nuclear_calculations/${id}`,
        method: "GET",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Заявки
     * @name NuclearCalculationsUpdate
     * @summary Изменение заявки
     * @request PUT:/api/nuclear_calculations/{id}
     * @secure
     */
    nuclearCalculationsUpdate: (
      id: number,
      input: SerializerCalcJSON,
      params: RequestParams = {},
    ) =>
      this.request<void, any>({
        path: `/api/nuclear_calculations/${id}`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Заявки
     * @name NuclearCalculationsDelete
     * @summary Логическое удаление заявки
     * @request DELETE:/api/nuclear_calculations/{id}
     * @secure
     */
    nuclearCalculationsDelete: (id: number, params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/api/nuclear_calculations/${id}`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Доступно только Технику
     *
     * @tags Заявки
     * @name NuclearCalculationsFinishUpdate
     * @summary Завершение или отклонение заявки
     * @request PUT:/api/nuclear_calculations/{id}/finish
     * @secure
     */
    nuclearCalculationsFinishUpdate: (
      id: number,
      input: SerializerStatusJSON,
      params: RequestParams = {},
    ) =>
      this.request<Record<string, string>, any>({
        path: `/api/nuclear_calculations/${id}/finish`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Переводит заявку из draft в сформирован
     *
     * @tags Заявки
     * @name NuclearCalculationsFormUpdate
     * @summary Сформировать заявку (запуск расчетов)
     * @request PUT:/api/nuclear_calculations/{id}/form
     * @secure
     */
    nuclearCalculationsFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<Record<string, any>, any>({
        path: `/api/nuclear_calculations/${id}/form`,
        method: "PUT",
        secure: true,
        ...params,
      }),
  };
}
