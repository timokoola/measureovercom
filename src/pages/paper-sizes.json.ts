import type { APIRoute } from 'astro';
import { paperSizesJson } from '../data/agents';

export const GET: APIRoute = () =>
  new Response(JSON.stringify(paperSizesJson(), null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
