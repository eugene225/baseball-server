// 팀 목록 타입 정의
export interface Team {
    value: string;
    label: string;
    color: string;
}

export const TEAMS: Team[] = [
  { value: 'LG_TWINS', label: 'LG 트윈스', color: '#C30452' },
  { value: 'SAMSUNG_LIONS', label: '삼성 라이온즈', color: '#1D2088' },
  { value: 'KIWOOM_HEROS', label: '키움 히어로즈', color: '#76232F' },
  { value: 'HANHWA_EAGLES', label: '한화 이글스', color: '#EF7C00' },
  { value: 'KT_WIZ', label: 'KT 위즈', color: '#231F20' },
  { value: 'DOOSAN_BEARS', label: '두산 베어스', color: '#0C2340' },
  { value: 'NC_DINOS', label: 'NC 다이노스', color: '#1D4E89' },
  { value: 'SSG_LANDERS', label: 'SSG 랜더스', color: '#E61A20' },
  { value: 'KIA_TIGERS', label: 'KIA 타이거즈', color: '#E60012' },
  { value: 'LOTTE_GIANTS', label: '롯데 자이언츠', color: '#002955' },
];


export enum Stadium {
  CHANGWON_NC_PARK = '창원NC파크',
  DAEGU_SAMSUNG_LIONS_PARK = '대구삼성라이온즈파크',
  GOCHEOK_SKY_DOME = '고척스카이돔',
  GWANGJU_KIA_CHAMPIONS_FIELD = '광주기아챔피언스필드',
  INCHEON_SSG_LANDERS_FIELD = '인천SSG랜더스필드',
  SUWON_KT_WIZ_PARK = '수원KT위즈파크',
  SASIK_YAGUJANG = '사직야구장',
  SEOUL_JONGHAP_STADIUM = '잠실야구장',
  DAEJEON_HANWHA_EAGLES_PARK = '대전한화생명볼파크',
}

// 각 팀에 대한 스타디움 매핑
export const TEAM_STADIUMS: { [key: string]: Stadium } = {
  LG_TWINS: Stadium.INCHEON_SSG_LANDERS_FIELD,
  SAMSUNG_LIONS: Stadium.DAEGU_SAMSUNG_LIONS_PARK,
  KIWOOM_HEROS: Stadium.GOCHEOK_SKY_DOME,
  HANHWA_EAGLES: Stadium.DAEJEON_HANWHA_EAGLES_PARK,
  KT_WIZ: Stadium.SUWON_KT_WIZ_PARK,
  DOOSAN_BEARS: Stadium.GWANGJU_KIA_CHAMPIONS_FIELD,
  NC_DINOS: Stadium.CHANGWON_NC_PARK,
  SSG_LANDERS: Stadium.INCHEON_SSG_LANDERS_FIELD,
  KIA_TIGERS: Stadium.GWANGJU_KIA_CHAMPIONS_FIELD,
  LOTTE_GIANTS: Stadium.SASIK_YAGUJANG,
};