import type { PreviewMode, TemplateData, TemplateType } from '../src/app/templateModel.js';

export interface ExportPayload {
  fileName: string;
  templateType: TemplateType;
  previewMode: PreviewMode;
  interviewSlideIndex: number;
  data: TemplateData;
}

function getViewport(previewMode: PreviewMode) {
  return {
    width: previewMode === 'strip' ? 3240 : 1080,
    height: 1350
  };
}

export async function createExportPng(origin: string, payload: ExportPayload) {
  const targetUrl = new URL('/export-render.html', origin);
  const viewport = getViewport(payload.previewMode);

  const isVercel = Boolean(process.env.VERCEL);
  const protectionBypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
  let browser: any;
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  if (isVercel) {
    const chromium = (await import('@sparticuz/chromium')).default;
    const playwright = await import('playwright-core');
    browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true
    });
  } else {
    const playwright = await import('playwright');
    browser = await playwright.chromium.launch({ headless: true });
  }

  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 1
  });

  if (protectionBypassSecret) {
    await page.setExtraHTTPHeaders({
      'x-vercel-protection-bypass': protectionBypassSecret,
      'x-vercel-set-bypass-cookie': 'true'
    });
    targetUrl.searchParams.set('x-vercel-protection-bypass', protectionBypassSecret);
  }

  page.on('pageerror', (error: Error) => {
    pageErrors.push(error.message);
  });

  page.on('console', (message: any) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  try {
    await page.addInitScript((injectedPayload: ExportPayload) => {
      (window as any).__DECIPHER_EXPORT_PAYLOAD__ = injectedPayload;
    }, payload);

    await page.goto(targetUrl.toString(), { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('#export-root', { timeout: 10000 });

    try {
      await page.waitForFunction(
        () => {
          const status = document.body.dataset.exportReady;
          return status === 'true' || status === 'error';
        },
        null,
        {
          timeout: 12000
        }
      );

      const exportStatus = await page.evaluate(() => ({
        ready: document.body.dataset.exportReady,
        error: document.body.dataset.exportError
      }));

      if (exportStatus.ready !== 'true') {
        throw new Error(exportStatus.error || 'Export render did not become ready');
      }
    } catch {
      await page.waitForFunction(
        () => {
          const root = document.querySelector('#export-root');
          return Boolean(root && root.children.length > 0);
        },
        null,
        { timeout: 10000 }
      );
      await page.waitForTimeout(isVercel ? 4000 : 1500);
    }

    const buffer = await page.locator('#export-root').screenshot({
      type: 'png'
    });

    return buffer;
  } catch (error) {
    const diagnostics = [
      error instanceof Error ? error.message : 'Unknown export error',
      pageErrors.length ? `Page errors: ${pageErrors.join(' | ')}` : '',
      consoleErrors.length ? `Console errors: ${consoleErrors.join(' | ')}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    throw new Error(diagnostics || 'Export failed');
  } finally {
    await page.close().catch(() => {});
    await browser.close().catch(() => {});
  }
}
