import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

const tableName = process.env.TABLE_NAME;
const docClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const PREFERENCES_KEY = { pk: 'ORG#DEFAULT', sk: 'PREFERENCES' };
const SAVED_VIEWS_KEY = { pk: 'ORG#DEFAULT', sk: 'SAVED_VIEWS' };

const DEFAULT_PREFERENCES = {
  defaultRequestQueueSubTab: 'administrator',
};

const DEFAULT_SAVED_VIEWS = {
  selectedViewId: 'view-pending',
  views: [
    {
      id: 'view-pending',
      label: 'Pending requests',
      isFavorite: true,
      data: {
        filters: [{ id: 'filter-pending', key: 'Status', operator: 'is', value: 'Pending' }],
      },
    },
    {
      id: 'view-resource',
      label: 'Resource approvals',
      isFavorite: false,
      data: {
        filters: [
          { id: 'filter-resource', key: 'Type', operator: 'is', value: 'Resource approval' },
        ],
      },
    },
  ],
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Access-Control-Allow-Methods': 'GET,PUT,OPTIONS',
  'Content-Type': 'application/json',
};

function response(statusCode, body) {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body),
  };
}

async function getItem(key, fallback) {
  const result = await docClient.send(
    new GetCommand({
      TableName: tableName,
      Key: key,
    }),
  );
  if (!result.Item) return fallback;
  const { pk: _pk, sk: _sk, ...data } = result.Item;
  return data;
}

async function putItem(key, data) {
  await docClient.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        ...key,
        ...data,
        updatedAt: new Date().toISOString(),
      },
    }),
  );
  return data;
}

function parseBody(event) {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
  return JSON.parse(raw);
}

export async function handler(event) {
  const method = event.requestContext?.http?.method || event.httpMethod || 'GET';
  const path = event.rawPath || event.path || '/';

  if (method === 'OPTIONS') {
    return response(204, {});
  }

  try {
    if (method === 'GET' && path === '/health') {
      return response(200, { ok: true });
    }

    if (path === '/preferences') {
      if (method === 'GET') {
        const preferences = await getItem(PREFERENCES_KEY, DEFAULT_PREFERENCES);
        return response(200, preferences);
      }
      if (method === 'PUT') {
        const body = parseBody(event);
        const defaultRequestQueueSubTab =
          body.defaultRequestQueueSubTab === 'delegated' ? 'delegated' : 'administrator';
        const saved = await putItem(PREFERENCES_KEY, { defaultRequestQueueSubTab });
        return response(200, saved);
      }
    }

    if (path === '/saved-views') {
      if (method === 'GET') {
        const savedViews = await getItem(SAVED_VIEWS_KEY, DEFAULT_SAVED_VIEWS);
        return response(200, savedViews);
      }
      if (method === 'PUT') {
        const body = parseBody(event);
        const views = Array.isArray(body.views) ? body.views : [];
        const selectedViewId = body.selectedViewId ?? null;
        const saved = await putItem(SAVED_VIEWS_KEY, { views, selectedViewId });
        return response(200, saved);
      }
    }

    return response(404, { message: 'Not found' });
  } catch (error) {
    console.error(error);
    return response(500, {
      message: 'Internal server error',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
