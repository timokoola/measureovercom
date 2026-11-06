import type { APIRoute } from 'astro';
import { agentsMd } from '../data/agents';

export const GET: APIRoute = () =>
  new Response(agentsMd(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
