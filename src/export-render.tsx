import { createRoot } from 'react-dom/client';
import { useEffect } from 'react';
import { TemplateCanvas } from './app/TemplateCanvas';
import { createDefaultTemplateData } from './app/templateModel';
import type { PreviewMode, TemplateData, TemplateType } from './app/templateModel';
import './styles/index.css';

declare global {
  interface Window {
    __DECIPHER_EXPORT_PAYLOAD__?: {
      templateType: TemplateType;
      previewMode: PreviewMode;
      interviewSlideIndex: number;
      data: TemplateData;
    };
  }
}

function ExportRenderApp() {
  const payload = window.__DECIPHER_EXPORT_PAYLOAD__ ?? {
    templateType: 'speaker' as TemplateType,
    previewMode: 'single' as PreviewMode,
    interviewSlideIndex: 0,
    data: createDefaultTemplateData()
  };

  useEffect(() => {
    let cancelled = false;
    document.body.dataset.exportReady = 'false';
    delete document.body.dataset.exportError;

    const waitWithTimeout = async (promise: Promise<unknown>, timeoutMs: number) => {
      await Promise.race([
        promise,
        new Promise<void>((resolve) => {
          window.setTimeout(resolve, timeoutMs);
        }),
      ]);
    };

    const markReady = async () => {
      if ('fonts' in document) {
        await waitWithTimeout(document.fonts.ready, 4000);
      }

      const images = Array.from(document.querySelectorAll('#export-root img'));
      await Promise.all(
        images.map(async (image) => {
          if (image.complete) {
            try {
              await waitWithTimeout(image.decode(), 2500);
            } catch {
              // Ignore decode errors and continue.
            }
            return;
          }

          await waitWithTimeout(
            new Promise<void>((resolve) => {
              const done = () => resolve();
              image.addEventListener('load', done, { once: true });
              image.addEventListener('error', done, { once: true });
            }),
            4000
          );
        })
      );

      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      if (!cancelled) {
        document.body.dataset.exportReady = 'true';
      }
    };

    markReady().catch((error) => {
      document.body.dataset.exportError = error instanceof Error ? error.message : 'Export render failed';
      document.body.dataset.exportReady = 'error';
    });

    return () => {
      cancelled = true;
    };
  }, [payload]);

  const { previewMode, templateType, interviewSlideIndex, data } = payload;

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
      <TemplateCanvas
        data={data}
        templateType={templateType}
        previewMode={previewMode}
        interviewSlideIndex={interviewSlideIndex}
      />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<ExportRenderApp />);
