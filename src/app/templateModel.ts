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
    tag: '@decipher_guest',
    image: null
  },
  interview: {
    name: '16기 함윤식',
    role: '@ham379888',
    tag: '@decipher_global',
    image: null,
    slides: [
      {
        title: '간단한 자기소개',
        body:
          '안녕하세요. 새로운 기술과 아이디어를 실제 서비스와 연결하는 과정에 관심이 많은 디사이퍼 학회원입니다.\n\n평소에는 제품, 콘텐츠, 커뮤니티가 어떻게 함께 성장할 수 있는지 고민하며 다양한 프로젝트를 접하고 있습니다. 작은 실험을 반복하면서 사람들에게 더 자연스럽게 다가가는 경험을 만드는 일을 좋아합니다.\n\n최근에는 빠르게 변하는 기술 환경 속에서도 본질적인 문제를 풀어내는 방식에 주목하고 있으며, 디사이퍼 안에서 다양한 사람들과 시야를 넓혀 가고 있습니다.'
      },
      {
        title: '나에게 블록체인이란?',
        body:
          '저에게 블록체인은 디지털 환경에서 신뢰를 새롭게 설계할 수 있게 해 주는 도구입니다.\n\n단순히 기술 자체를 보는 것이 아니라, 사람들이 더 투명하게 협업하고 가치를 주고받을 수 있도록 만드는 구조에 더 큰 의미가 있다고 생각합니다. 그래서 블록체인은 특정 산업에만 머무는 기술이 아니라, 다양한 서비스 경험을 다시 정의할 수 있는 기반으로 느껴집니다.\n\n앞으로도 기술적 가능성뿐 아니라 실제 사용자에게 어떤 변화를 줄 수 있는지 중심으로 계속 탐구해 보고 싶습니다.'
      }
    ]
  }
});
