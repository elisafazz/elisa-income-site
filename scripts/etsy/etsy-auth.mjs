#!/usr/bin/env node
/**
 * Etsy OAuth2 PKCE Authorization Flow
 *
 * Run once to get initial access + refresh tokens.
 * Tokens are saved to scripts/etsy/.etsy-tokens.json for reuse.
 *
 * Usage: node scripts/etsy/etsy-auth.mjs
 *
 * Prerequisites:
 * 1. Register app at https://www.etsy.com/developers/register
 * 2. Set callback URL to http://localhost:3456/callback
 * 3. Create scripts/etsy/.etsy-credentials.json with:
 *    { "apiKey": "your-keystring", "sharedSecret": "your-shared-secret" }
 */

import { createServer } from 'http';
import { URL } from 'url';
import { randomBytes, createHash } from 'crypto';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CREDS_PATH = join(__dirname, '.etsy-credentials.json');
const TOKENS_PATH = join(__dirname, '.etsy-tokens.json');
const CALLBACK_PORT = 3456;
const CALLBACK_URL = `http://localhost:${CALLBACK_PORT}/callback`;

// Load credentials
if (!existsSync(CREDS_PATH)) {
  console.error(`Missing ${CREDS_PATH}`);
  console.error('Create it with: { "apiKey": "your-keystring", "sharedSecret": "your-shared-secret" }');
  process.exit(1);
}

const { apiKey, sharedSecret } = JSON.parse(readFileSync(CREDS_PATH, 'utf8'));

// Generate PKCE challenge
function generatePKCE() {
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  return { verifier, challenge };
}

const { verifier, challenge } = generatePKCE();
const state = randomBytes(16).toString('hex');

// Scopes needed for listing creation
const scopes = ['listings_r', 'listings_w', 'listings_d'];

const authUrl = new URL('https://www.etsy.com/oauth/connect');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', apiKey);
authUrl.searchParams.set('redirect_uri', CALLBACK_URL);
authUrl.searchParams.set('scope', scopes.join(' '));
authUrl.searchParams.set('state', state);
authUrl.searchParams.set('code_challenge', challenge);
authUrl.searchParams.set('code_challenge_method', 'S256');

console.log('\nOpen this URL in your browser to authorize:\n');
console.log(authUrl.toString());
console.log('\nWaiting for callback...\n');

// Start local server to catch the callback
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${CALLBACK_PORT}`);

  if (url.pathname !== '/callback') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');

  if (returnedState !== state) {
    res.writeHead(400);
    res.end('State mismatch - possible CSRF attack');
    server.close();
    return;
  }

  if (!code) {
    res.writeHead(400);
    res.end('No authorization code received');
    server.close();
    return;
  }

  console.log('Authorization code received. Exchanging for tokens...');

  // Exchange code for tokens
  try {
    const tokenResponse = await fetch('https://api.etsy.com/v3/public/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: apiKey,
        redirect_uri: CALLBACK_URL,
        code,
        code_verifier: verifier,
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${tokenResponse.status} ${error}`);
    }

    const tokens = await tokenResponse.json();

    // Save tokens
    writeFileSync(TOKENS_PATH, JSON.stringify({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: Date.now() + (tokens.expires_in * 1000),
      token_type: tokens.token_type,
    }, null, 2));

    console.log('Tokens saved to', TOKENS_PATH);
    console.log('Access token expires in', tokens.expires_in, 'seconds');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h1>Authorization successful</h1><p>You can close this tab.</p>');
  } catch (err) {
    console.error('Token exchange error:', err.message);
    res.writeHead(500);
    res.end('Token exchange failed: ' + err.message);
  }

  server.close();
});

server.listen(CALLBACK_PORT, () => {
  console.log(`Callback server listening on port ${CALLBACK_PORT}`);
});
