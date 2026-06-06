import logoIcon from '../assets/logo1_black.png';
import logoText from '../assets/decipher_transparent_clean.png';
import type { InterviewSlide, PreviewMode, TemplateData, TemplateType } from './templateModel';
import { templateOptions } from './templateModel';
import { useEffect, useState } from 'react';

const WATERMARK_BASE_WIDTH = 1740;
const WATERMARK_SCALE = 1;
const WATERMARK_CENTER_X = 1620;
const WATERMARK_TOP = '65%';
const WATERMARK_OPACITY = 0.3;

interface TemplateCanvasProps {
  data: TemplateData;
  templateType: TemplateType;
  previewMode: PreviewMode;
  interviewSlideIndex: number;
  previewScale?: number;
  scaled?: boolean;
}

function PaperBackground({
  tone = 'cover',
  strip = false,
  transparentBase = false,
}: {
  tone?: 'cover' | 'detail';
  strip?: boolean;
  transparentBase?: boolean;
}) {
  return (
    <>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: transparentBase ? 'rgba(235, 229, 216, 0.74)' : 'var(--paper-base)'
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            strip
              ? 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.025) 38%, rgba(0,0,0,0.02) 100%)'
              : tone === 'detail'
              ? 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 42%, rgba(0,0,0,0.018) 100%)'
              : 'linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 44%, rgba(0,0,0,0.012) 100%)'
        }}
      />
      <div
        className="absolute inset-0 z-0"
        style={{
          boxShadow:
            strip
              ? 'inset 0 0 0 1px rgba(255,255,255,0.03)'
              : tone === 'detail'
              ? 'inset 0 0 0 1px rgba(255,255,255,0.04), inset 0 -18px 36px var(--paper-shadow)'
              : 'inset 0 0 0 1px rgba(255,255,255,0.03)'
        }}
      />
    </>
  );
}

function TopAccent({
  variant,
  inset = 34,
}: {
  variant: 'speaker' | 'weekly' | 'interview';
  inset?: number;
}) {
  const barPosition =
    variant === 'speaker'
      ? { left: '0px' }
      : variant === 'weekly'
      ? { left: '50%', transform: 'translateX(-50%)' }
      : { right: '0px' };

  return (
    <div
      className="pointer-events-none absolute z-[15]"
      style={{
        left: `${inset}px`,
        right: `${inset}px`,
        top: `${inset}px`,
        height: '18px',
      }}
    >
      <div className="absolute inset-x-0 top-[8px] h-px bg-[rgba(52,42,30,0.16)]" />
      <div
        className="absolute top-0 h-[3px] w-[148px] bg-[rgba(52,42,30,0.62)]"
        style={barPosition}
      />
    </div>
  );
}

function BrandBackdrop({
  segmentIndex = 0,
}: {
  segmentIndex?: 0 | 1 | 2;
}) {
  const watermarkWidth = WATERMARK_BASE_WIDTH * WATERMARK_SCALE;
  const globalLeft = WATERMARK_CENTER_X - watermarkWidth / 2;
  const localLeft = globalLeft - segmentIndex * 1080;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          backgroundImage: [
            'radial-gradient(circle at 14% 18%, rgba(132, 112, 82, 0.065) 0 1.2px, transparent 1.8px)',
            'radial-gradient(circle at 82% 22%, rgba(132, 112, 82, 0.055) 0 1px, transparent 1.7px)',
            'radial-gradient(circle at 26% 74%, rgba(132, 112, 82, 0.05) 0 1.1px, transparent 1.9px)',
            'radial-gradient(circle at 72% 78%, rgba(132, 112, 82, 0.05) 0 1px, transparent 1.8px)',
            'linear-gradient(115deg, transparent 0%, rgba(123, 103, 74, 0.025) 18%, transparent 34%, transparent 62%, rgba(123, 103, 74, 0.02) 78%, transparent 100%)',
            'linear-gradient(65deg, transparent 0%, transparent 22%, rgba(123, 103, 74, 0.02) 40%, transparent 54%, transparent 76%, rgba(123, 103, 74, 0.018) 92%, transparent 100%)'
          ].join(', '),
          backgroundSize: '260px 260px, 320px 320px, 280px 280px, 340px 340px, 100% 100%, 100% 100%',
          mixBlendMode: 'multiply'
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-[3] overflow-hidden">
        <img
          src={logoText}
          alt=""
          aria-hidden="true"
          className="absolute object-contain opacity-[0.2] brightness-0 invert"
          style={{
            width: `${watermarkWidth}px`,
            left: `${localLeft}px`,
            top: WATERMARK_TOP,
            transform: 'translateY(-50%)',
            opacity: WATERMARK_OPACITY,
          }}
        />
      </div>
    </>
  );
}

function InterviewImage({
  src,
  layout = 'cover',
}: {
  src: string;
  layout?: 'cover' | 'portraitBlur';
}) {
  if (layout === 'portraitBlur') {
    return (
      <div className="relative h-[666px] w-full overflow-hidden bg-[#e9e3d8]">
        <img
          src={src}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-90 blur-[18px]"
          style={{ objectPosition: 'center center' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-[#18130d]/10" />
        <img
          src={src}
          alt="Interviewee"
          className="relative z-10 mx-auto h-full w-[72%] object-contain"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Interviewee"
      className="h-[666px] w-full object-cover"
      style={{ objectPosition: 'right center' }}
    />
  );
}

export function getCanvasDimensions(previewMode: PreviewMode) {
  return {
    width: previewMode === 'strip' ? 3240 : 1080,
    height: 1350
  };
}

function WeeklyImageCollage({ images }: { images: string[] }) {
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('vertical');

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      images.map((src) =>
        new Promise<number>((resolve) => {
          const image = new Image();
          image.onload = () => resolve(image.naturalWidth / image.naturalHeight);
          image.onerror = () => resolve(1);
          image.src = src;
        }),
      ),
    ).then((aspects) => {
      if (cancelled) return;
      const hasPortrait = aspects.some((aspect) => aspect < 0.9);
      setLayout(hasPortrait ? 'horizontal' : 'vertical');
    });

    return () => {
      cancelled = true;
    };
  }, [images]);

  if (images.length === 1) {
    return (
      <div className="overflow-hidden">
        <img src={images[0]} alt="Weekly session 1" className="h-[684px] w-full object-cover" />
      </div>
    );
  }

  if (layout === 'vertical') {
    return (
      <div className="flex h-[684px] flex-col gap-3">
        {images.map((image, index) => (
          <div key={`weekly-vertical-${index}`} className="min-h-0 flex-1 overflow-hidden">
            <img
              src={image}
              alt={`Weekly session ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-[684px]">
      {images.map((image, index) => (
        <div key={`weekly-horizontal-${index}`} className="min-w-0 flex-1 overflow-hidden">
          <img
            src={image}
            alt={`Weekly session ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function renderInterviewDetailCard(slide: InterviewSlide, connected = false) {
  const cardClassName = connected
    ? 'relative isolate w-[1080px] h-[1350px] shrink-0 overflow-hidden'
    : 'relative isolate w-full h-full overflow-hidden';

  return (
    <div className={cardClassName}>
      <PaperBackground tone="detail" />
      <div className="absolute left-[42px] right-[42px] top-[120px] bottom-[120px] z-10 border border-[var(--paper-line)] bg-[#fbf2e6]/96 px-[56px] py-[64px]">
        <div className="text-center text-[62px] font-bold tracking-[-0.05em] text-[#2f4132]">
          {slide.title}
        </div>
        <div className="mt-[40px] h-px w-full bg-[var(--paper-line)]" />
        <div className="mt-[42px] whitespace-pre-line text-[36px] font-semibold leading-[1.55] tracking-[-0.01em] text-[#2a2a2a]">
          {slide.body}
        </div>
        <div className="absolute bottom-[36px] right-[36px]">
          <img
            src={logoIcon}
            alt="Decipher"
            className="w-[150px] h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}

function renderTemplateCard(
  data: TemplateData,
  cardType: TemplateType,
  connected = false,
  stripSharedBackground = false,
  reactKey?: string
) {
  const cardClassName = connected
    ? 'relative isolate w-[1080px] h-[1350px] shrink-0 overflow-hidden'
    : 'relative isolate w-full h-full overflow-hidden';

  if (cardType === 'weekly') {
    const weeklyImages = [data.weekly.imageLeft, data.weekly.imageRight].filter(Boolean) as string[];

    return (
      <div key={reactKey} className={cardClassName}>
        <PaperBackground transparentBase={stripSharedBackground} />
        <BrandBackdrop segmentIndex={1} />
        <TopAccent variant="weekly" />
        {weeklyImages.length > 0 && (
          <div className="absolute top-[86px] left-1/2 z-10 w-[920px] -translate-x-1/2 bg-white p-4 shadow-lg">
            <WeeklyImageCollage images={weeklyImages} />
          </div>
        )}

        <div className="relative z-10 flex h-full flex-col justify-end p-20 pb-20">
          <div className="space-y-6" style={{ maxWidth: '800px' }}>
            <div className="whitespace-pre-line text-[#1a1a1a] text-[56px] leading-tight font-semibold tracking-[-0.045em]">
              {data.weekly.week}
            </div>
            <div className="text-[#666666] text-[40px] font-medium leading-snug tracking-[-0.02em]">
              {data.weekly.topic}
            </div>
            <div className="text-[#999999] text-[32px] font-medium mt-8 tracking-[-0.015em]">
              {data.weekly.date}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cardType === 'speaker') {
    return (
      <div key={reactKey} className={cardClassName}>
        <PaperBackground transparentBase={stripSharedBackground} />
        <BrandBackdrop segmentIndex={0} />
        <TopAccent variant="speaker" />
        <div className="absolute top-[52px] left-[52px] z-10">
          <img
            src={logoIcon}
            alt="Decipher"
            className="w-[148px] h-auto object-contain"
          />
        </div>

        {data.speaker.image && (
          <>
            <div className="absolute left-[107px] top-[174px] z-10 w-[866px]">
              <div className="bg-white p-5 shadow-lg">
                <img
                  src={data.speaker.image}
                  alt="Speaker"
                  className="h-[578px] w-full object-cover"
                />
              </div>
            </div>
            {data.speaker.tag && (
            <div className="absolute top-[172px] left-[978px] z-10 bg-[#2c2419] px-4 py-5">
              <div
                className="text-[20px] font-medium uppercase tracking-[0.08em] text-[#f6f0e6]"
                style={{
                  writingMode: 'vertical-rl',
                  textOrientation: 'mixed',
                  fontFamily: '"SF Mono", "JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace'
                }}
              >
                {data.speaker.tag}
              </div>
            </div>
            )}
          </>
        )}

        <div className="absolute left-[58px] bottom-[78px] z-10 w-[420px]">
          <div className="space-y-7">
            <div className="text-[#1a1a1a] text-[78px] leading-[0.92] font-semibold tracking-[-0.06em]">
              {data.speaker.name}
            </div>
            <div className="whitespace-nowrap text-[#666666] text-[30px] font-medium leading-none tracking-[-0.03em]">
              {data.speaker.title}
            </div>
            <div className="h-1 w-28 bg-[#1a1a1a] my-8"></div>
            <div className="text-[#999999] text-[28px] font-medium mt-8 tracking-[-0.012em]">
              {data.speaker.date}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div key={reactKey} className={cardClassName}>
      <PaperBackground transparentBase={stripSharedBackground} />
      <BrandBackdrop segmentIndex={2} />
      <TopAccent variant="interview" />
      {data.interview.image && (
        <>
          <div className="absolute top-[86px] left-1/2 z-10 -translate-x-1/2 w-[740px]">
            <div className="bg-white p-5 shadow-lg">
              <InterviewImage src={data.interview.image} layout={data.interview.imageLayout} />
            </div>
          </div>
          {data.interview.tag && (
          <div className="absolute left-[714px] top-[792px] z-10 bg-[#2c2419] px-5 py-3">
            <div
              className="text-[18px] font-medium uppercase tracking-[0.12em] text-[#f6f0e6]"
              style={{
                fontFamily: '"SF Mono", "JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace'
              }}
            >
              {data.interview.tag}
            </div>
          </div>
          )}
        </>
      )}

      <div className="relative z-10 flex h-full flex-col justify-end p-20 pb-20">
        <div className="space-y-8">
          <div className="text-[#999999] text-[36px] uppercase tracking-widest">
            INTERVIEW
          </div>
          <div className="text-[#1a1a1a] text-[64px] leading-tight font-semibold tracking-[-0.05em]">
            {data.interview.name}
          </div>
          <div className="text-[#666666] text-[36px] font-medium leading-relaxed tracking-[-0.015em]">
            {data.interview.role}
          </div>
        </div>
      </div>

      <div className="absolute bottom-20 right-20 z-10">
        <img
          src={logoText}
          alt="Decipher"
          className="w-[300px] h-auto object-contain"
        />
      </div>
    </div>
  );
}

export function TemplateCanvas({
  data,
  templateType,
  previewMode,
  interviewSlideIndex,
  previewScale: customPreviewScale,
  scaled = false,
}: TemplateCanvasProps) {
  const { width, height } = getCanvasDimensions(previewMode);
  const previewScale = customPreviewScale ?? (previewMode === 'strip' ? 0.24 : 0.4);
  const scaledWidth = width * previewScale;
  const scaledHeight = height * previewScale;

  const canvasContent = previewMode === 'strip' ? (
    <div className="relative h-full w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-[1]">
        <PaperBackground strip />
      </div>
      <div className="relative z-10 flex h-full w-full">
        {templateOptions.map(({ value }) => renderTemplateCard(data, value, true, true, `strip-${value}`))}
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.008) 42%, rgba(0,0,0,0.01) 100%)'
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-[5] shadow-[inset_0_-20px_36px_rgba(0,0,0,0.03)]" />
    </div>
  ) : (
    <div className="relative h-full w-full overflow-hidden">
      {templateType === 'interview' && interviewSlideIndex > 0
        ? renderInterviewDetailCard(data.interview.slides[interviewSlideIndex - 1], true)
        : renderTemplateCard(data, templateType, true)}
    </div>
  );

  if (!scaled) {
    return (
      <div
        id="export-root"
        className="overflow-hidden"
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        {canvasContent}
      </div>
    );
  }

  return (
    <div className="relative" style={{ width: `${scaledWidth}px`, height: `${scaledHeight}px` }}>
      <div
        className="absolute inset-0 shadow-2xl"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${previewScale})`,
          transformOrigin: 'top left'
        }}
      >
        {canvasContent}
      </div>
    </div>
  );
}
