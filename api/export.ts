import { createExportPng } from '../server/exportPng.js';
import type { ExportPayload } from '../server/exportPng.js';

export const config = {
  runtime: 'nodejs'
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const payload = req.body as ExportPayload;
    const host = req.headers['x-forwarded-host'] ?? req.headers.host;
    const protocol = (req.headers['x-forwarded-proto'] as string | undefined) ?? 'https';

    if (!host) {
      res.status(400).send('Missing host header');
      return;
    }

    const buffer = await createExportPng(`${protocol}://${host}`, payload);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${payload.fileName}"`);
    res.status(200).send(buffer);
  } catch (error) {
    console.error(error);
    res.status(500).send(error instanceof Error ? error.message : 'Export failed');
  }
}
