/**
 * @module stardogjs.query.stored
 */
import lodashPick from 'lodash.pick';
import { getFetchDispatcher } from '../request-utils';
import { BaseOptions, JsonPrimitive } from '../types';
import { RequestMethod, RequestHeader, ContentType } from '../constants';

const dispatchAdminFetch = getFetchDispatcher({
  basePath: 'admin/queries/stored',
  allowedQueryParams: [],
});

export interface StoredQueryData {
  name: string;
  database: '*' | string;
  query: string;
  shared?: boolean;
  /** Attributes introduced in Stardog version 6.2.2, which are optional in versions >= 6.2.2 and ignored in earlier versions. */
  reasoning?: boolean;
  description?: boolean;

  [key: string]: JsonPrimitive | undefined;
}

export const create = ({
  connection,
  storedQueryData,
}: BaseOptions & { storedQueryData: StoredQueryData }) => {
  const body: StoredQueryData & { creator: string } = lodashPick(
    storedQueryData,
    ['name', 'database', 'query', 'shared']
  ) as any;
  body.creator = connection.username;
  body.shared = typeof body.shared === 'boolean' ? body.shared : false;

  return dispatchAdminFetch({
    connection,
    method: RequestMethod.POST,
    body: JSON.stringify(body),
    requestHeaders: {
      [RequestHeader.ACCEPT]: ContentType.JSON,
      [RequestHeader.CONTENT_TYPE]: ContentType.JSON,
    },
  });
};

export const list = ({ connection }: BaseOptions) =>
  dispatchAdminFetch({
    connection,
    requestHeaders: {
      [RequestHeader.ACCEPT]: ContentType.JSON,
    },
  });

export const deleteStoredQuery = ({
  connection,
  storedQuery,
}: BaseOptions & { storedQuery: string }) =>
  dispatchAdminFetch({
    connection,
    method: RequestMethod.DELETE,
    requestHeaders: {
      [RequestHeader.ACCEPT]: ContentType.JSON,
    },
    pathSuffix: storedQuery,
  });
