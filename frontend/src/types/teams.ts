// 팀 목록 타입 정의
export interface Team {
    value: string;
    label: string;
}

export const TEAMS: Team[] = [
  { value: 'LG_TWINS', label: 'LG 트윈스' },
  { value: 'SAMSUNG_LIONS', label: '삼성 라이온즈' },
  { value: 'KIWOOM_HEROS', label: '키움 히어로즈' },
  { value: 'HANHWA_EAGLES', label: '한화 이글스' },
  { value: 'KT_WIZ', label: 'KT 위즈' },
  { value: 'DOOSAN_BEARS', label: '두산 베어스' },
  { value: 'NC_DINOS', label: 'NC 다이노스' },
  { value: 'SSG_LANDERS', label: 'SSG 랜더스' },
  { value: 'KIA_TIGERS', label: 'KIA 타이거즈' },
];