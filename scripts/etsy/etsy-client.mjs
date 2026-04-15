#!/usr/bin/env node
/**
 * Etsy API Client
 *
 * Handles token refresh and provides authenticated API calls.
 * Used by etsy-list.mjs for listing creation.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CREDS_PATH = join(__dirname, '.etsy-credentials.json');
const TOKENS_PATH = join(__dirname, '.etsy-tokens.json');

export function loadCredentials() {
  if (!existsSync(CREDS_PATH)) {
    throw new Error(`Missing ${CREDS_PATH} - run etsy-auth.mjs first`);
  }
  return JSON.parse(readFileSync(CREDS_PATH, 'utf8'));
}

export function loadTokens() {
  if (!existsSync(TOKENS_PATH)) {
    throw new Error(`Missing ${TOKENS_PATH} - run etsy-auth.mjs first`);
  }
  return JSON.parse(readFileSync(TOKENS_PATH, 'utf8'));
}

function saveTokens(tokens) {
  writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
}

async function refreshAccessToken() {
  const { apiKey } = loadCredentials();
  const tokens = loadTokens();

  const response = await fetch('https://api.etsy.com/v3/public/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: apiKey,
      refresh_token: tokens.refresh_token,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${error}`);
  }

  const newTokens = await response.json();
  const saved = {
    access_token: newTokens.access_token,
    refresh_token: newTokens.refresh_token,
    expires_at: Date.now() + (newTokens.expires_in * 1000),
    token_type: newTokens.token_type,
  };
  saveTokens(saved);
  return saved;
}

async function getValidToken() {
  let tokens = loadTokens();

  // Refresh if token expires within 5 minutes
  if (Date.now() > tokens.expires_at - 300000) {
    console.log('Token expired or expiring soon, refreshing...');
    tokens = await refreshAccessToken();
  }

  return tokens.access_token;
}

/**
 * Make an authenticated Etsy API request
 */
export async function etsyFetch(path, options = {}) {
  const { apiKey } = loadCredentials();
  const accessToken = await getValidToken();

  const url = path.startsWith('http') ? path : `https://api.etsy.com/v3${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'x-api-key': apiKey,
      'Authorization': `Bearer ${accessToken}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Etsy API error ${response.status}: ${error}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

/**
 * Get the authenticated user's shop ID
 */
export async function getShopId() {
  const user = await etsyFetch('/application/users/me');
  const shops = await etsyFetch(`/application/users/${user.user_id}/shops`);
  if (!shops.results || shops.results.length === 0) {
    throw new Error('No shops found for this user');
  }
  return shops.results[0].shop_id;
}
