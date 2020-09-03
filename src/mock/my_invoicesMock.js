import uuid from 'uuid/v1';
import moment from 'moment';
import mock from 'src/utils/mock';
import PT from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const invoices = {
  id: PT.string.isRequired,
  공급자명: PT.string.isRequired,
  avatar: PT.string.isRequired,
  email: PT.string.isRequired,
  일자: PT.string.isRequired,
  총액: PT.number.isRequired,
  비고: PT.string.isRequired,
  사용자: PT.string.isRequired,
  배치번호: PT.number.isRequired,
  // 문서번호: PT.number.isRequired,
  location: PT.string.isRequired
};

export const voucher = {
  id: PT.number.isRequired,
  batchNumber: PT.number.isRequired,
  gl_ymd: PT.string.isRequired,
  supplyNumber: PT.string.isRequired,
  accountName: PT.string.isRequired,
  price: PT.number.isRequired,
  bigo: PT.string.isRequired,
  author: PT.string.isRequired,
};


mock.onGet('/api/invoices').reply(200, {
  invoices: [
    {
      id: uuid(),
      공급자명: '오리진 컨설팅',
      avatar: '/images/avatars/avatar_3.png',
      email: '',
      일자: '2020-01-02',
      총액: 500.00,
      통화: '\\',
      비고: '화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1화상회의 임대료/1',
      사용자: '이승우',
      배치번호: 2367,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: '(주)TCC INS',
      avatar: '/images/avatars/avatar_4.png',
      email: '',
      일자: '2020-01-30',
      총액: 230.00,
      통화: '\\',
      비고: '서버비/1',
      사용자: '이승우',
      배치번호: 2368,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: '새하컴즈',
      avatar: '/images/avatars/avatar_4.png',
      email: '',
      일자: '2020-01-30',
      총액: 600.00,
      통화: '\\',
      비고: '오라클 유지보수비/1',
      사용자: '이철용',
      배치번호: 2368,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: '삼성전자',
      avatar: '/images/avatars/avatar_5.png',
      email: '',
      일자: '2020-01-30',
      총액: 540.00,
      통화: '\\',
      비고: '그룹웨어 클라우드 비용/1',
      사용자: '이승우',
      배치번호: 2369,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: 'LG 전자',
      avatar: '/images/avatars/avatar_1.png',
      email: '',
      일자: '2020-01-30',
      총액: 33300.00,
      통화: '\\',
      비고: '그룹웨어 클라우드 비용/1',
      사용자: '이철용',
      배치번호: 2369,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: '케이씨프레쉬',
      avatar: '/images/avatars/avatar_3.png',
      email: '',
      일자: '2020-01-22',
      총액: 6000.00,
      통화: '\\',
      비고: '그룹웨어 클라우드 비용/1',
      사용자: '이승우',
      배치번호: 2369,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: '대한민국',
      avatar: '/images/avatars/avatar_4.png',
      email: '',
      일자: '2020-01-31',
      총액: 300.00,
      통화: '\\',
      비고: '그룹웨어 클라우드 비용/1',
      사용자: '이승우',
      배치번호: 2370,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: '대한민국',
      avatar: '/images/avatars/avatar_4.png',
      email: '',
      일자: '2020-01-31',
      총액: 300.00,
      통화: '\\',
      비고: '그룹웨어 클라우드 비용/1',
      사용자: '이승우',
      배치번호: 2370,
      location: 'West Virginia, USA'
    },
  ]
});
