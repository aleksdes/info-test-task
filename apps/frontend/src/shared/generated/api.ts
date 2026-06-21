/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export type ChangeStepNameCreateData = Workflow;

export interface ChangeStepNameCreatePayload {
  /** initialIndex шага процесса, название которого нужно изменить */
  stepInitialIndex: number;
  /** Новое значение поля name шага процесса */
  stepName: string;
  /**
   * Название процесса (и файла процесса, без расширения .json)
   * @default "wf1"
   */
  wfName?: string;
}

export type ChangeStepXyCreateData = Workflow;

export interface ChangeStepXyCreatePayload {
  /** initialIndex шага процесса, координаты которого нужно изменить */
  stepInitialIndex: number;
  /**
   * Название процесса (и файла процесса, без расширения .json)
   * @default "wf1"
   */
  wfName?: string;
  /** Новое значение координаты x шага процесса */
  x: number;
  /** Новое значение координаты y шага процесса */
  y: number;
}

export type CreateStepCreateData = WorkflowStep;

export interface CreateStepCreatePayload {
  /** Необязательный цвет блока на схеме (например, HEX) */
  color?: string;
  /** name нового шага процесса */
  stepName: string;
  /** Название процесса (и файла процесса, без расширения .json) */
  wfName: string;
  /** x нового шага процесса */
  x: number;
  /** y нового шага процесса */
  y: number;
}

export type DeleteStepCreateData = Workflow;

export interface DeleteStepCreatePayload {
  /** initialIndex удаляемого шага */
  stepInitialIndex: number;
  /** Название процесса (и файла процесса, без расширения .json) */
  wfName: string;
}

export interface Error {
  /** @example "Процесс «wf2» не найден" */
  error: string;
}

export type GetWorkflowData = Workflow;

export interface GetWorkflowParams {
  /**
   * Название процесса (и файла процесса, без расширения .json)
   * @default "wf1"
   * @example "wf1"
   */
  wfName?: string;
}

export interface Workflow {
  /** @example "wf1" */
  name: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  /**
   * Необязательный цвет блока на схеме (например, HEX)
   * @example "#5C6BC0"
   */
  color?: string;
  /** @example 0 */
  initialIndex: number;
  /** @example "Закупка" */
  name: string;
  /** @example [1,2] */
  nextSteps: number[];
  /** @example 174 */
  x: number;
  /** @example 101 */
  y: number;
}

export namespace Workflow {
  /**
   * No description
   * @tags workflow
   * @name ChangeStepNameCreate
   * @summary Изменяет название шага
   * @request POST:/workflow/changeStepName
   */
  export namespace ChangeStepNameCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangeStepNameCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ChangeStepNameCreateData;
  }

  /**
   * No description
   * @tags workflow
   * @name ChangeStepXyCreate
   * @summary Изменяет координаты шага на схеме (x, y)
   * @request POST:/workflow/changeStepXY
   */
  export namespace ChangeStepXyCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ChangeStepXyCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = ChangeStepXyCreateData;
  }

  /**
   * No description
   * @tags workflow
   * @name CreateStepCreate
   * @summary Создает новый шаг процесса
   * @request POST:/workflow/createStep
   */
  export namespace CreateStepCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateStepCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = CreateStepCreateData;
  }

  /**
   * No description
   * @tags workflow
   * @name DeleteStepCreate
   * @summary Удаляет шаг процесса по stepInitialIndex
   * @request POST:/workflow/deleteStep
   */
  export namespace DeleteStepCreate {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DeleteStepCreatePayload;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteStepCreateData;
  }

  /**
   * No description
   * @tags workflow
   * @name GetWorkflow
   * @summary Возвращает данные процесса (workflow)
   * @request GET:/workflow/get
   */
  export namespace GetWorkflow {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Название процесса (и файла процесса, без расширения .json)
       * @default "wf1"
       * @example "wf1"
       */
      wfName?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetWorkflowData;
  }
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
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

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
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

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "/" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
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
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
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

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
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
 * @title wf-editor API
 * @version 0.1.0
 * @baseUrl /
 *
 * Бэкенд wf-editor: загрузка и сохранение данных процессов (workflow) из JSON-файлов.
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  workflow = {
    /**
     * No description
     *
     * @tags workflow
     * @name ChangeStepNameCreate
     * @summary Изменяет название шага
     * @request POST:/workflow/changeStepName
     */
    changeStepNameCreate: (data: ChangeStepNameCreatePayload, params: RequestParams = {}) =>
      this.http.request<ChangeStepNameCreateData, Error>({
        path: `/workflow/changeStepName`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags workflow
     * @name ChangeStepXyCreate
     * @summary Изменяет координаты шага на схеме (x, y)
     * @request POST:/workflow/changeStepXY
     */
    changeStepXyCreate: (data: ChangeStepXyCreatePayload, params: RequestParams = {}) =>
      this.http.request<ChangeStepXyCreateData, Error>({
        path: `/workflow/changeStepXY`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags workflow
     * @name CreateStepCreate
     * @summary Создает новый шаг процесса
     * @request POST:/workflow/createStep
     */
    createStepCreate: (data: CreateStepCreatePayload, params: RequestParams = {}) =>
      this.http.request<CreateStepCreateData, Error>({
        path: `/workflow/createStep`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags workflow
     * @name DeleteStepCreate
     * @summary Удаляет шаг процесса по stepInitialIndex
     * @request POST:/workflow/deleteStep
     */
    deleteStepCreate: (data: DeleteStepCreatePayload, params: RequestParams = {}) =>
      this.http.request<DeleteStepCreateData, Error>({
        path: `/workflow/deleteStep`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags workflow
     * @name GetWorkflow
     * @summary Возвращает данные процесса (workflow)
     * @request GET:/workflow/get
     */
    getWorkflow: (query: GetWorkflowParams, params: RequestParams = {}) =>
      this.http.request<GetWorkflowData, Error>({
        path: `/workflow/get`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),
  };
}
