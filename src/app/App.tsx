import { useEffect, useState, type ChangeEvent, type SVGProps } from 'react';
import {
  AtSign,
  CalendarDays,
  Check,
  Download,
  FileImage,
  ImagePlus,
  Instagram,
  Layers3,
  Linkedin,
  LayoutTemplate,
  LoaderCircle,
  Plus,
  Rows3,
  Send,
  Twitter,
  Type,
  Upload,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react';
import officialLogoMark from '../assets/decipher-site/decipher-logo.png';
import { TemplateCanvas } from './TemplateCanvas';
import {
  DECIPHER_DEFAULT_INSTAGRAM_HANDLE,
  createDefaultInterviewSlide,
  createDefaultTemplateData,
  templateOptions,
  type ImageField,
  type InterviewSlide,
  type PreviewMode,
  type TemplateData,
  type TemplateType,
} from './templateModel';

type TemplateMeta = {
  label: string;
  shortLabel: string;
  description: string;
  contentLabel: string;
  icon: LucideIcon;
};

type FieldProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  onChange: (value: string) => void;
  placeholder?: string;
  helper?: string;
};

const templateMeta: Record<TemplateType, TemplateMeta> = {
  speaker: {
    label: 'Speaker Session',
    shortLabel: 'Speaker',
    description: 'Photo, speaker, title, date, and handle.',
    contentLabel: 'Speaker content',
    icon: UserRound,
  },
  weekly: {
    label: 'Weekly Session',
    shortLabel: 'Weekly',
    description: 'Two photos, topic, author line, and session date.',
    contentLabel: 'Weekly content',
    icon: LayoutTemplate,
  },
  interview: {
    label: 'Interview',
    shortLabel: 'Interview',
    description: 'Cover information plus editable interview slides.',
    contentLabel: 'Interview content',
    icon: Rows3,
  },
};

const previewOptions: Array<{
  value: PreviewMode;
  label: string;
  description: string;
  icon: LucideIcon;
}> = [
  {
    value: 'single',
    label: 'Single Card',
    description: 'One 1080 x 1350 post.',
    icon: FileImage,
  },
  {
    value: 'strip',
    label: '3-Card Strip',
    description: 'Speaker, weekly, interview.',
    icon: Layers3,
  },
];

const MediumIcon = ({ className, ...props }: SVGProps<SVGSVGElement>) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

const officialChannelLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/decipher_snu/', icon: Instagram },
  { name: 'X', href: 'https://x.com/DecipherGlobal', icon: Twitter },
  { name: 'Medium', href: 'https://medium.com/decipher-media', icon: MediumIcon },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/decipher-ac', icon: Linkedin },
  { name: 'Telegram', href: 'http://t.me/snu_decipher', icon: Send },
] as const;

export default function App() {
  const [templateType, setTemplateType] = useState<TemplateType>('speaker');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('single');
  const [interviewSlideIndex, setInterviewSlideIndex] = useState(0);
  const [data, setData] = useState<TemplateData>(createDefaultTemplateData);
  const [compactPreview, setCompactPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportAction, setExportAction] = useState<'single' | 'all' | null>(null);
  const [exportStatus, setExportStatus] = useState('');

  useEffect(() => {
    const syncPreviewSize = () => {
      setCompactPreview(window.innerWidth < 768);
    };

    syncPreviewSize();
    window.addEventListener('resize', syncPreviewSize);
    return () => window.removeEventListener('resize', syncPreviewSize);
  }, []);

  const currentTemplate = templateMeta[templateType];
  const currentPreview = previewOptions.find(option => option.value === previewMode) ?? previewOptions[0];
  const exportSetCount = 3 + data.interview.slides.length;
  const exportTarget = previewMode === 'strip'
    ? '3-card strip'
    : templateType === 'interview' && interviewSlideIndex > 0
      ? `Interview slide ${interviewSlideIndex}`
      : currentTemplate.label;
  const exportStatusText = exportStatus || `Ready: ${exportTarget}`;
  const previewScale = compactPreview
    ? previewMode === 'strip'
      ? 0.105
      : 0.3
    : previewMode === 'strip'
      ? 0.24
      : 0.4;

  const updateField = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        [field]: value
      }
    }));
  };

  const handleImageUpload = (imageField: ImageField) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const imageUrl = readerEvent.target?.result as string;
      setData(prev => ({
        ...prev,
        [templateType]: {
          ...prev[templateType],
          [imageField]: imageUrl
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (imageField: ImageField) => () => {
    setData(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        [imageField]: null
      }
    }));
  };

  const downloadBlob = (blob: Blob, fileName: string) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = objectUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  };

  const requestExportPng = async ({
    fileName,
    template,
    preview,
    slideIndex,
  }: {
    fileName: string;
    template: TemplateType;
    preview: PreviewMode;
    slideIndex: number;
  }) => {
    const response = await fetch('/api/export', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName,
        templateType: template,
        previewMode: preview,
        interviewSlideIndex: slideIndex,
        data
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text || 'Export request failed');
    }

    const blob = await response.blob();
    downloadBlob(blob, fileName);
  };

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportAction('single');
    setExportStatus('Preparing PNG...');

    try {
      const stamp = Date.now();
      const isInterviewSlide = templateType === 'interview' && interviewSlideIndex > 0;
      const fileName = previewMode === 'strip'
        ? `decipher-strip-${stamp}.png`
        : isInterviewSlide
          ? `decipher-interview-slide-${interviewSlideIndex}-${stamp}.png`
          : `decipher-${templateType}-${stamp}.png`;

      await requestExportPng({
        fileName,
        template: templateType,
        preview: previewMode,
        slideIndex: interviewSlideIndex
      });
      setExportStatus(`Downloaded ${fileName}`);
    } catch (error) {
      console.error('Failed to export PNG', error);
      const message = error instanceof Error ? error.message : 'Unknown export error';
      setExportStatus('PNG export failed');
      window.alert(`PNG export failed: ${message}`);
    } finally {
      setIsExporting(false);
      setExportAction(null);
    }
  };

  const handleExportAll = async () => {
    if (isExporting) return;

    setIsExporting(true);
    setExportAction('all');
    setExportStatus('Preparing export set...');

    try {
      const stamp = Date.now();
      const exportQueue: Array<{ fileName: string; template: TemplateType; preview: PreviewMode; slideIndex: number }> = [
        {
          fileName: `decipher-speaker-${stamp}.png`,
          template: 'speaker',
          preview: 'single',
          slideIndex: 0
        },
        {
          fileName: `decipher-weekly-${stamp}.png`,
          template: 'weekly',
          preview: 'single',
          slideIndex: 0
        },
        {
          fileName: `decipher-interview-cover-${stamp}.png`,
          template: 'interview',
          preview: 'single',
          slideIndex: 0
        },
        ...data.interview.slides.map((_, index) => ({
          fileName: `decipher-interview-slide-${index + 1}-${stamp}.png`,
          template: 'interview' as TemplateType,
          preview: 'single' as PreviewMode,
          slideIndex: index + 1
        }))
      ];

      for (const [index, item] of exportQueue.entries()) {
        setExportStatus(`Exporting ${index + 1} of ${exportQueue.length}...`);
        await requestExportPng(item);
        await new Promise(resolve => setTimeout(resolve, 120));
      }

      setExportStatus(`Downloaded ${exportQueue.length} PNGs`);
    } catch (error) {
      console.error('Failed to export all PNGs', error);
      const message = error instanceof Error ? error.message : 'Unknown export error';
      setExportStatus('Export set failed');
      window.alert(`Export All failed: ${message}`);
    } finally {
      setIsExporting(false);
      setExportAction(null);
    }
  };

  const updateInterviewSlide = (index: number, field: keyof InterviewSlide, value: string) => {
    setData(prev => ({
      ...prev,
      interview: {
        ...prev.interview,
        slides: prev.interview.slides.map((slide, slideIndex) =>
          slideIndex === index ? { ...slide, [field]: value } : slide,
        )
      }
    }));
  };

  const addInterviewSlide = () => {
    setData(prev => ({
      ...prev,
      interview: {
        ...prev.interview,
        slides: [
          ...prev.interview.slides,
          createDefaultInterviewSlide(prev.interview.slides.length)
        ]
      }
    }));
    setInterviewSlideIndex(data.interview.slides.length + 1);
  };

  const renderTextInput = ({
    label,
    value,
    icon: Icon,
    onChange,
    placeholder,
    helper,
  }: FieldProps) => (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm font-medium text-[#403a32]">
        <Icon size={15} className="text-[#8d7d68]" aria-hidden="true" />
        {label}
      </span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-[#ded7cc] bg-[#fbfaf7] px-3 py-2.5 text-[15px] text-[#25211d] shadow-inner shadow-black/[0.015] outline-none transition-colors placeholder:text-[#a49a8c] focus:border-[#2c2419] focus:bg-white focus-visible:ring-2 focus-visible:ring-[#2c2419]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffefb]"
      />
      {helper && (
        <span className="block text-xs leading-relaxed text-[#8a8176]">
          {helper}
        </span>
      )}
    </label>
  );

  const renderTextArea = ({
    label,
    value,
    icon: Icon,
    onChange,
    placeholder,
    helper,
    rows = 4,
  }: FieldProps & { rows?: number }) => (
    <label className="block space-y-2">
      <span className="flex items-center gap-2 text-sm font-medium text-[#403a32]">
        <Icon size={15} className="text-[#8d7d68]" aria-hidden="true" />
        {label}
      </span>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        className="w-full resize-none rounded-md border border-[#ded7cc] bg-[#fbfaf7] px-3 py-2.5 text-[15px] leading-relaxed text-[#25211d] shadow-inner shadow-black/[0.015] outline-none transition-colors placeholder:text-[#a49a8c] focus:border-[#2c2419] focus:bg-white focus-visible:ring-2 focus-visible:ring-[#2c2419]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffefb]"
      />
      {helper && (
        <span className="block text-xs leading-relaxed text-[#8a8176]">
          {helper}
        </span>
      )}
    </label>
  );

  const renderImageUploader = (
    label: string,
    image: string | null,
    imageField: ImageField,
  ) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-[#403a32]">
        <ImagePlus size={15} className="text-[#8d7d68]" aria-hidden="true" />
        {label}
      </div>
      {image ? (
        <div className="relative overflow-hidden rounded-md border border-[#ded7cc] bg-[#f5f2ec]">
          <img
            src={image}
            alt={`${label} preview`}
            className="h-36 w-full object-cover"
          />
          <button
            type="button"
            onClick={removeImage(imageField)}
            aria-label={`Remove ${label}`}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-[#2c2419] text-white shadow-md transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-[#cfc5b8] bg-[#fbfaf7] px-4 py-5 text-center transition-colors hover:border-[#2c2419] hover:bg-white focus-within:border-[#2c2419] focus-within:ring-2 focus-within:ring-[#2c2419]/20 focus-within:ring-offset-2 focus-within:ring-offset-[#fffefb]">
          <Upload size={24} className="mb-2 text-[#7d7368]" aria-hidden="true" />
          <span className="text-sm font-medium text-[#403a32]">Upload {label}</span>
          <span className="mt-1 text-xs text-[#8c8378]">JPG, PNG, WEBP</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload(imageField)}
            className="hidden"
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f4ef] text-[#25211d]">
      <header className="border-b border-[#e2dbcf] bg-[#fffefb]">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-4 px-4 py-4 sm:flex-row sm:items-end sm:justify-between lg:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="mt-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[#2f281f] bg-[#1f1912] shadow-sm">
              <img
                src={officialLogoMark}
                alt=""
                aria-hidden="true"
                className="h-9 w-9 object-contain brightness-0 invert"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8f7f68]">
                Decipher Social Kit
              </p>
              <h1 className="mt-1 text-[28px] font-semibold leading-tight text-[#17130f] sm:text-[32px]">
                Instagram card maker
              </h1>
              <p className="mt-1 text-sm text-[#70675c]">
                No Codex required. Edit Decipher-ready cards directly in the browser.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap gap-2 text-xs font-medium text-[#51483e] sm:justify-end">
              <span className="rounded-md border border-[#ded7cc] bg-[#f8f5ee] px-3 py-2">3 templates</span>
              <span className="rounded-md border border-[#ded7cc] bg-[#f8f5ee] px-3 py-2">1080 x 1350 PNG</span>
              <span className="rounded-md border border-[#ded7cc] bg-[#f8f5ee] px-3 py-2">Browser editor</span>
            </div>
            <nav aria-label="Official Decipher channels" className="flex items-center gap-1.5">
              {officialChannelLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  title={name}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-[#ded7cc] bg-[#f8f5ee] text-[#50463a] transition-colors hover:border-[#2c2419] hover:bg-white hover:text-[#17130f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c2419]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffefb]"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-5 px-4 py-5 lg:grid-cols-[380px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-4 lg:sticky lg:top-5 lg:max-h-[calc(100vh-40px)] lg:overflow-y-auto lg:pr-1">
          <section className="rounded-md border border-[#ded7cc] bg-[#fffefb] p-4 shadow-sm shadow-black/[0.025]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#201b16]">Template</h2>
                <p className="text-sm text-[#756b60]">Choose the card family.</p>
              </div>
              <LayoutTemplate size={20} className="text-[#8f7f68]" aria-hidden="true" />
            </div>
            <div className="grid gap-2">
              {templateOptions.map(({ value }) => {
                const option = templateMeta[value];
                const Icon = option.icon;
                const isSelected = templateType === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTemplateType(value)}
                    aria-pressed={isSelected}
                    className={`rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c2419]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffefb] ${
                      isSelected
                        ? 'border-[#2c2419] bg-[#2c2419] text-white'
                        : 'border-[#e3ddd2] bg-[#fbfaf7] text-[#2f2a24] hover:border-[#b9ad9d] hover:bg-white'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                          isSelected ? 'bg-white/12' : 'bg-[#efe8dd]'
                        }`}
                      >
                        <Icon size={18} aria-hidden="true" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold">{option.label}</span>
                        <span className={`mt-0.5 block text-xs ${isSelected ? 'text-white/72' : 'text-[#776d62]'}`}>
                          {option.description}
                        </span>
                      </span>
                      <Check
                        size={16}
                        className={`ml-auto shrink-0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-md border border-[#ded7cc] bg-[#fffefb] p-4 shadow-sm shadow-black/[0.025]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#201b16]">Format</h2>
                <p className="text-sm text-[#756b60]">Match the final download.</p>
              </div>
              <FileImage size={20} className="text-[#8f7f68]" aria-hidden="true" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {previewOptions.map(({ value, label, description, icon: Icon }) => {
                const isSelected = previewMode === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPreviewMode(value)}
                    aria-pressed={isSelected}
                    className={`min-h-[92px] rounded-md border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c2419]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffefb] ${
                      isSelected
                        ? 'border-[#2c2419] bg-[#2c2419] text-white'
                        : 'border-[#e3ddd2] bg-[#fbfaf7] text-[#2f2a24] hover:border-[#b9ad9d] hover:bg-white'
                    }`}
                  >
                    <span className="mb-2 flex items-center justify-between">
                      <Icon size={18} aria-hidden="true" />
                      <Check size={15} className={`transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                    </span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className={`mt-1 block text-xs leading-snug ${isSelected ? 'text-white/72' : 'text-[#776d62]'}`}>
                      {description}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            aria-busy={isExporting}
            className="rounded-md border border-[#d4cabd] bg-[#fffefb] p-3 shadow-lg shadow-black/[0.045]"
          >
            <div className="mb-3 flex items-center justify-between gap-3 px-1 text-xs font-medium text-[#6d6358]">
              <span>{currentTemplate.shortLabel}</span>
              <span>{currentPreview.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                aria-label={`Export ${exportTarget} as PNG`}
                className="flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#2c2419] px-3 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c2419]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffefb]"
              >
                {exportAction === 'single' ? (
                  <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Download size={17} aria-hidden="true" />
                )}
                Export PNG
              </button>
              <button
                type="button"
                onClick={handleExportAll}
                disabled={isExporting}
                aria-label={`Export all ${exportSetCount} PNGs`}
                className="flex min-h-12 items-center justify-center gap-2 rounded-md border border-[#ded7cc] bg-[#f4efe7] px-3 py-3 text-sm font-semibold text-[#2f2a24] transition-colors hover:border-[#2c2419] hover:bg-white disabled:cursor-wait disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c2419]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffefb]"
              >
                {exportAction === 'all' ? (
                  <LoaderCircle size={17} className="animate-spin" aria-hidden="true" />
                ) : (
                  <Download size={17} aria-hidden="true" />
                )}
                <span>Export All</span>
                <span className="rounded bg-white/70 px-1.5 py-0.5 text-[11px] leading-none text-[#6d6358]">
                  {exportSetCount}
                </span>
              </button>
            </div>
            <p role="status" className="mt-3 px-1 text-xs text-[#6d6358]">
              {exportStatusText}
            </p>
          </section>

          {templateType === 'interview' && previewMode === 'single' && (
            <section className="rounded-md border border-[#ded7cc] bg-[#fffefb] p-4 shadow-sm shadow-black/[0.025]">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-[#201b16]">Interview slide</h2>
                <button
                  type="button"
                  onClick={addInterviewSlide}
                  className="flex h-9 items-center gap-1.5 rounded-md border border-[#ded7cc] bg-[#fbfaf7] px-3 text-sm font-medium text-[#2f2a24] transition-colors hover:border-[#2c2419] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c2419]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffefb]"
                >
                  <Plus size={15} aria-hidden="true" />
                  Add
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[{ value: 0, label: 'Cover' }, ...data.interview.slides.map((_, index) => ({
                  value: index + 1,
                  label: `Slide ${index + 1}`
                }))].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setInterviewSlideIndex(value)}
                    aria-pressed={interviewSlideIndex === value}
                    className={`rounded-md border px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2c2419]/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffefb] ${
                      interviewSlideIndex === value
                        ? 'border-[#2c2419] bg-[#2c2419] text-white'
                        : 'border-[#e3ddd2] bg-[#fbfaf7] text-[#2f2a24] hover:border-[#b9ad9d] hover:bg-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-md border border-[#ded7cc] bg-[#fffefb] p-4 shadow-sm shadow-black/[0.025]">
            <div className="mb-4">
              <h2 className="text-base font-semibold text-[#201b16]">{currentTemplate.contentLabel}</h2>
              <p className="text-sm text-[#756b60]">{currentTemplate.description}</p>
            </div>

            <div className="space-y-4">
              {templateType === 'weekly' && (
                <>
                  {renderImageUploader('Photo 1', data.weekly.imageLeft, 'imageLeft')}
                  {renderImageUploader('Photo 2', data.weekly.imageRight, 'imageRight')}
                  {renderTextInput({
                    label: 'Week',
                    value: data.weekly.week,
                    icon: Type,
                    onChange: (value) => updateField('week', value),
                    placeholder: 'Perp Dex 101',
                  })}
                  {renderTextInput({
                    label: 'Session label',
                    value: data.weekly.date,
                    icon: CalendarDays,
                    onChange: (value) => updateField('date', value),
                    placeholder: '2026-1 Weekly Session # N',
                    helper: 'Use the weekly session label; omit calendar dates unless the card type already uses them.',
                  })}
                  {renderTextArea({
                    label: 'Author line',
                    value: data.weekly.topic,
                    icon: Rows3,
                    rows: 3,
                    onChange: (value) => updateField('topic', value),
                    placeholder: 'by 이름, 이름',
                  })}
                </>
              )}

              {templateType === 'speaker' && (
                <>
                  {renderImageUploader('Image', data.speaker.image, 'image')}
                  {renderTextInput({
                    label: 'Speaker Name',
                    value: data.speaker.name,
                    icon: UserRound,
                    onChange: (value) => updateField('name', value),
                    placeholder: '홍길동',
                  })}
                  {renderTextInput({
                    label: 'Title',
                    value: data.speaker.title,
                    icon: Type,
                    onChange: (value) => updateField('title', value),
                    placeholder: 'Affiliation / Role',
                  })}
                  {renderTextInput({
                    label: 'Date',
                    value: data.speaker.date,
                    icon: CalendarDays,
                    onChange: (value) => updateField('date', value),
                    placeholder: 'YYYY.MM.DD',
                    helper: 'Speaker cards use date style, not the weekly session label.',
                  })}
                  {renderTextInput({
                    label: 'Speaker side tag',
                    value: data.speaker.tag,
                    icon: AtSign,
                    onChange: (value) => updateField('tag', value),
                    placeholder: '@personal_handle',
                    helper: 'Personal handle only; leave blank when there is no public speaker handle.',
                  })}
                </>
              )}

              {templateType === 'interview' && (
                <>
                  {renderImageUploader('Image', data.interview.image, 'image')}
                  {renderTextInput({
                    label: 'Interviewee Name',
                    value: data.interview.name,
                    icon: UserRound,
                    onChange: (value) => updateField('name', value),
                    placeholder: '16기 이름',
                  })}
                  {renderTextInput({
                    label: 'Instagram / lower label',
                    value: data.interview.role,
                    icon: Type,
                    onChange: (value) => updateField('role', value),
                    placeholder: DECIPHER_DEFAULT_INSTAGRAM_HANDLE,
                    helper: `Falls back to ${DECIPHER_DEFAULT_INSTAGRAM_HANDLE} when no Instagram handle is provided.`,
                  })}
                  {renderTextInput({
                    label: 'X side tag',
                    value: data.interview.tag,
                    icon: AtSign,
                    onChange: (value) => updateField('tag', value),
                    placeholder: '@x_handle',
                    helper: 'Use only X/Twitter here; leave blank when missing.',
                  })}
                  {data.interview.slides.map((slide, index) => (
                    <div key={`interview-slide-${index}`} className="space-y-3 rounded-md border border-[#e3ddd2] bg-[#fbfaf7] p-3">
                      <div className="text-sm font-semibold text-[#6f6559]">Slide {index + 1}</div>
                      {renderTextInput({
                        label: 'Title',
                        value: slide.title,
                        icon: Type,
                        onChange: (value) => updateInterviewSlide(index, 'title', value),
                      })}
                      {renderTextArea({
                        label: 'Body',
                        value: slide.body,
                        icon: Rows3,
                        rows: 7,
                        onChange: (value) => updateInterviewSlide(index, 'body', value),
                      })}
                    </div>
                  ))}
                </>
              )}
            </div>
          </section>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-md border border-[#ded7cc] bg-[#eeece6] shadow-sm shadow-black/[0.025]">
          <div className="flex flex-col gap-3 border-b border-[#ded7cc] bg-[#fffefb] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#201b16]">Live preview</h2>
              <p className="text-sm text-[#756b60]">
                {currentTemplate.label} · {currentPreview.label}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-medium text-[#51483e]">
              <span className="rounded-md border border-[#ded7cc] bg-[#f8f5ee] px-3 py-2">
                {previewMode === 'strip' ? '3240 x 1350' : '1080 x 1350'}
              </span>
              <span className="rounded-md border border-[#ded7cc] bg-[#f8f5ee] px-3 py-2">PNG</span>
            </div>
          </div>
          <div className="min-h-[340px] overflow-auto p-4 sm:min-h-[520px] sm:p-8 lg:flex lg:min-h-[calc(100vh-168px)] lg:items-center lg:justify-center">
            <div className="mx-auto w-max">
              <TemplateCanvas
                data={data}
                templateType={templateType}
                previewMode={previewMode}
                interviewSlideIndex={interviewSlideIndex}
                previewScale={previewScale}
                scaled
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
