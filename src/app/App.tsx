import { useState } from 'react';
import { Download, Upload, X } from 'lucide-react';
import { TemplateCanvas } from './TemplateCanvas';
import {
  createDefaultTemplateData,
  templateOptions,
  type ImageField,
  type InterviewSlide,
  type PreviewMode,
  type TemplateData,
  type TemplateType,
} from './templateModel';

export default function App() {
  const [templateType, setTemplateType] = useState<TemplateType>('speaker');
  const [previewMode, setPreviewMode] = useState<PreviewMode>('single');
  const [interviewSlideIndex, setInterviewSlideIndex] = useState(0);
  const [data, setData] = useState<TemplateData>(createDefaultTemplateData);

  const updateField = (field: string, value: string) => {
    setData(prev => ({
      ...prev,
      [templateType]: {
        ...prev[templateType],
        [field]: value
      }
    }));
  };

  const handleImageUpload = (imageField: ImageField) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
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
    } catch (error) {
      console.error('Failed to export PNG', error);
      const message = error instanceof Error ? error.message : 'Unknown export error';
      window.alert(`PNG export failed: ${message}`);
    }
  };

  const handleExportAll = async () => {
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

      for (const item of exportQueue) {
        await requestExportPng(item);
        await new Promise(resolve => setTimeout(resolve, 120));
      }
    } catch (error) {
      console.error('Failed to export all PNGs', error);
      const message = error instanceof Error ? error.message : 'Unknown export error';
      window.alert(`Export All failed: ${message}`);
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
          {
            title: `슬라이드 ${prev.interview.slides.length + 1}`,
            body: ''
          }
        ]
      }
    }));
    setInterviewSlideIndex(data.interview.slides.length + 1);
  };

  const renderImageUploader = (
    label: string,
    image: string | null,
    imageField: ImageField,
  ) => (
    <div>
      <label className="block mb-2 text-sm">{label}</label>
      {image ? (
        <div className="relative">
          <img
            src={image}
            alt={`${label} preview`}
            className="w-full h-32 object-cover rounded-lg"
          />
          <button
            onClick={removeImage(imageField)}
            className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-90"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="w-full h-32 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
          <Upload size={24} className="mb-2 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Upload {label}</span>
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
    <div className="min-h-screen bg-[#fafafa] flex">
      <div className="w-80 bg-white border-r border-border p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="mb-1">Decipher Templates</h1>
          <p className="text-sm text-muted-foreground">Instagram 1080×1350</p>
        </div>

        <div className="mb-8">
          <label className="block mb-3 text-sm">Template Type</label>
          <div className="space-y-2">
            {templateOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTemplateType(value)}
                className={`w-full px-4 py-3 text-left rounded-lg transition-colors ${
                  templateType === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <label className="block mb-3 text-sm">Preview Mode</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'single', label: 'Single Card' },
              { value: 'strip', label: '3-Card Strip' }
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setPreviewMode(value as PreviewMode)}
                className={`px-4 py-3 text-left rounded-lg transition-colors ${
                  previewMode === value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-accent'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {templateType === 'interview' && previewMode === 'single' && (
          <div className="mb-8">
            <label className="block mb-3 text-sm">Interview Slide</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: 0, label: 'Cover' }, ...data.interview.slides.map((_, index) => ({
                value: index + 1,
                label: `Slide ${index + 1}`
              }))].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setInterviewSlideIndex(value)}
                  className={`px-3 py-3 text-left rounded-lg transition-colors ${
                    interviewSlideIndex === value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-accent'
                  }`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={addInterviewSlide}
                className="px-3 py-3 text-left rounded-lg transition-colors bg-muted hover:bg-accent"
              >
                + Add Slide
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 space-y-4 overflow-y-auto">
          {templateType === 'weekly' && (
            <>
              {renderImageUploader('Photo 1', data.weekly.imageLeft, 'imageLeft')}
              {renderImageUploader('Photo 2', data.weekly.imageRight, 'imageRight')}
              <div>
                <label className="block mb-2 text-sm">Week</label>
                <input
                  type="text"
                  value={data.weekly.week}
                  onChange={(e) => updateField('week', e.target.value)}
                  className="w-full px-3 py-2 bg-input-background rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Date</label>
                <input
                  type="text"
                  value={data.weekly.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full px-3 py-2 bg-input-background rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Topic</label>
                <textarea
                  value={data.weekly.topic}
                  onChange={(e) => updateField('topic', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-input-background rounded-lg resize-none"
                />
              </div>
            </>
          )}

          {templateType === 'speaker' && (
            <>
              {renderImageUploader('Image', data.speaker.image, 'image')}
              <div>
                <label className="block mb-2 text-sm">Speaker Name</label>
                <input
                  type="text"
                  value={data.speaker.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3 py-2 bg-input-background rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Title</label>
                <input
                  type="text"
                  value={data.speaker.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full px-3 py-2 bg-input-background rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Date</label>
                <input
                  type="text"
                  value={data.speaker.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  className="w-full px-3 py-2 bg-input-background rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Tag</label>
                <input
                  type="text"
                  value={data.speaker.tag}
                  onChange={(e) => updateField('tag', e.target.value)}
                  className="w-full px-3 py-2 bg-input-background rounded-lg"
                />
              </div>
            </>
          )}

          {templateType === 'interview' && (
            <>
              {renderImageUploader('Image', data.interview.image, 'image')}
              <div>
                <label className="block mb-2 text-sm">Interviewee Name</label>
                <input
                  type="text"
                  value={data.interview.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-3 py-2 bg-input-background rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Role</label>
                <input
                  type="text"
                  value={data.interview.role}
                  onChange={(e) => updateField('role', e.target.value)}
                  className="w-full px-3 py-2 bg-input-background rounded-lg"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm">Tag</label>
                <input
                  type="text"
                  value={data.interview.tag}
                  onChange={(e) => updateField('tag', e.target.value)}
                  className="w-full px-3 py-2 bg-input-background rounded-lg"
                />
              </div>
              {data.interview.slides.map((slide, index) => (
                <div key={`interview-slide-${index}`} className="space-y-3 rounded-lg border border-border p-3">
                  <div className="text-sm font-medium text-muted-foreground">Slide {index + 1}</div>
                  <div>
                    <label className="block mb-2 text-sm">Title</label>
                    <input
                      type="text"
                      value={slide.title}
                      onChange={(e) => updateInterviewSlide(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-input-background rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm">Body</label>
                    <textarea
                      value={slide.body}
                      onChange={(e) => updateInterviewSlide(index, 'body', e.target.value)}
                      rows={7}
                      className="w-full px-3 py-2 bg-input-background rounded-lg resize-none"
                    />
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            onClick={handleExport}
            className="px-4 py-3 bg-primary text-primary-foreground rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <Download size={18} />
            Export PNG
          </button>
          <button
            onClick={handleExportAll}
            className="px-4 py-3 bg-muted text-foreground rounded-lg flex items-center justify-center gap-2 hover:bg-accent transition-colors"
          >
            <Download size={18} />
            Export All
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-12">
        <TemplateCanvas
          data={data}
          templateType={templateType}
          previewMode={previewMode}
          interviewSlideIndex={interviewSlideIndex}
          scaled
        />
      </div>
    </div>
  );
}
