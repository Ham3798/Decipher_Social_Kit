export type TemplateType = 'weekly' | 'speaker' | 'interview';
export type PreviewMode = 'single' | 'strip';
export type ImageField = 'image' | 'imageLeft' | 'imageRight';

export const templateOptions: Array<{ value: TemplateType; label: string }> = [
  { value: 'speaker', label: 'Speaker Session' },
  { value: 'weekly', label: 'Weekly Session' },
  { value: 'interview', label: 'Interview' }
];

export interface InterviewSlide {
  title: string;
  body: string;
}

export interface TemplateData {
  weekly: {
    week: string;
    date: string;
    topic: string;
    imageLeft: string | null;
    imageRight: string | null;
  };
  speaker: {
    name: string;
    title: string;
    date: string;
    tag: string;
    image: string | null;
  };
  interview: {
    name: string;
    role: string;
    tag: string;
    image: string | null;
    imageLayout?: 'cover' | 'portraitBlur';
    slides: InterviewSlide[];
  };
}

export const DECIPHER_DEFAULT_INSTAGRAM_HANDLE = '@decipher_global';

export const defaultInterviewSlideTitles = [
  '간단한 자기소개',
  '디사이퍼에 들어온 계기',
  '나에게 블록체인이란?',
  '가장 기억에 남는 활동',
  '앞으로의 목표',
] as const;

const defaultInterviewSlideBodies = [
  '안녕하세요. 새로운 기술과 아이디어를 실제 서비스와 연결하는 과정에 관심이 많은 디사이퍼 학회원입니다.\n\n평소에는 제품, 콘텐츠, 커뮤니티가 어떻게 함께 성장할 수 있는지 고민하며 다양한 프로젝트를 접하고 있습니다. 작은 실험을 반복하면서 사람들에게 더 자연스럽게 다가가는 경험을 만드는 일을 좋아합니다.\n\n최근에는 빠르게 변하는 기술 환경 속에서도 본질적인 문제를 풀어내는 방식에 주목하고 있으며, 디사이퍼 안에서 다양한 사람들과 시야를 넓혀 가고 있습니다.',
  '디사이퍼에는 블록체인을 기술과 산업, 커뮤니티의 관점에서 함께 탐구하는 사람들이 모여 있다는 점이 인상적이었습니다.\n\n혼자 공부할 때는 놓치기 쉬운 질문들을 세션과 프로젝트를 통해 구체화할 수 있고, 서로 다른 배경을 가진 멤버들과 토론하면서 더 넓은 시야를 얻을 수 있다는 기대가 컸습니다.',
  '저에게 블록체인은 디지털 환경에서 신뢰를 새롭게 설계할 수 있게 해 주는 도구입니다.\n\n단순히 기술 자체를 보는 것이 아니라, 사람들이 더 투명하게 협업하고 가치를 주고받을 수 있도록 만드는 구조에 더 큰 의미가 있다고 생각합니다. 그래서 블록체인은 특정 산업에만 머무는 기술이 아니라, 다양한 서비스 경험을 다시 정의할 수 있는 기반으로 느껴집니다.\n\n앞으로도 기술적 가능성뿐 아니라 실제 사용자에게 어떤 변화를 줄 수 있는지 중심으로 계속 탐구해 보고 싶습니다.',
  '가장 기억에 남는 활동은 하나의 주제를 준비하면서 여러 관점을 맞춰 본 세션입니다.\n\n기술적인 설명뿐 아니라 왜 이 문제가 중요한지, 실제 생태계에서는 어떤 맥락으로 받아들여지는지 함께 이야기하며 내용을 다듬는 과정이 좋았습니다. 그 과정에서 디사이퍼다운 학습 방식과 협업 문화를 더 잘 느낄 수 있었습니다.',
  '앞으로는 배운 내용을 기록하고 공유하는 일을 꾸준히 이어가고 싶습니다.\n\n새로운 기술을 빠르게 따라가는 것에 그치지 않고, 사람들이 이해하고 활용할 수 있는 형태로 정리하는 데 관심이 있습니다. 디사이퍼 안에서 더 많은 멤버들과 함께 실험하고, 의미 있는 결과물을 만들어 가고 싶습니다.',
];

export const createDefaultInterviewSlide = (index: number): InterviewSlide => ({
  title: defaultInterviewSlideTitles[index] ?? `슬라이드 ${index + 1}`,
  body: defaultInterviewSlideBodies[index] ?? '',
});

export const createDefaultTemplateData = (): TemplateData => ({
  weekly: {
    week: 'Perp Dex 101',
    date: '2026-1 Weekly Session # 1',
    topic: 'by 이도현, 박정원',
    imageLeft: null,
    imageRight: null
  },
  speaker: {
    name: '함윤식',
    title: 'Lead Designer / Decipher',
    date: '2026.04.20',
    tag: '',
    image: null
  },
  interview: {
    name: '16기 함윤식',
    role: DECIPHER_DEFAULT_INSTAGRAM_HANDLE,
    tag: '',
    image: null,
    slides: defaultInterviewSlideTitles.map((_, index) => createDefaultInterviewSlide(index))
  }
});
