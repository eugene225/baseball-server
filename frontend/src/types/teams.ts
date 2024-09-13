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

export enum Stadium {
  CHANGWON_NC_PARK = '창원NC파크',
  DAEGU_SAMSUNG_LIONS_PARK = '대구삼성라이온즈파크',
  GOCHEOK_SKY_DOME = '고척스카이돔',
  GWANGJU_KIA_CHAMPIONS_FIELD = '광주기아챔피언스필드',
  INCHEON_SSG_LANDERS_FIELD = '인천SSG랜더스필드',
  SUWON_KT_WIZ_PARK = '수원KT위즈파크',
  SASIK_YAGUJANG = '사직야구장',
  SEOUL_JONGHAP_STADIUM = '서울종합운동장 야구장',
  DAEJEON_HANWHA_EAGLES_PARK = '대전한화생명이글스파크',
}