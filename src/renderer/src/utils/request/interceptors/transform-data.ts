import { InternalAxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { isPlainObject } from 'lodash';
import qs from 'qs';
import { IConfig, CONTENT_TYPE } from '../types';

type IParams = InternalAxiosRequestConfig & IConfig;

const getPostData = (config: IParams) => {
  if (isPlainObject(config.json)) {
    return {
      data: JSON.stringify(config.json),
      headers: {
        ...config.headers,
        'Content-Type': CONTENT_TYPE.json,
      } as AxiosRequestHeaders,
    };
  }
  if (isPlainObject(config.form)) {
    return {
      data: qs.stringify(config.form),
      headers: {
        ...config.headers,
        'Content-Type': CONTENT_TYPE.form as string,
      } as AxiosRequestHeaders,
    };
  }
};

// 处理 DELETE 请求
const handleDeleteRequest = (config: IParams) => {
  if (isPlainObject(config.params)) {
    return {
      ...config,
      url: `${config.url}?${qs.stringify(config.params, { indices: false })}`,
      params: undefined,
    };
  }
  return config;
};

export default (config: IParams) => {
  if (config.method === 'get') {
    return {
      ...config,
      paramsSerializer: (p: Record<string, any>) => qs.stringify(p, { indices: false }),
    };
  }

  if (config.method === 'delete') {
    return handleDeleteRequest(config);
  }

  return { ...config, ...getPostData(config) };
};