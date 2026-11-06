import type { APIRoute } from 'astro';
import { getAllPageIndexes } from '../data';
import { llmsTxt } from '../data/agents';

export const GET: APIRoute = async () =>
  new Response(llmsTxt(await getAllPageIndexes()), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
