import uuid from 'uuid/v1';
import mock from 'src/utils/mock';
import PT from 'prop-types';
import {signs, signType} from "./my_signsMock";

// eslint-disable-next-line import/prefer-default-export
export const documents = {
  id: PT.string.isRequired,
  author: PT.string.isRequired,
  group: PT.string.isRequired,
  created: PT.string.isRequired,
  title: PT.string.isRequired,
  content: PT.string.isRequired,
  invoices: PT.array.isRequired,
  attachments: PT.array.isRequired,
  approvers: PT.arrayOf(PT.shape(signs)).isRequired,
  doc_status: PT.string.isRequired,
};

export const attachment = {
  title: PT.string.isRequired,
  size: PT.number.isRequired,
  path: PT.string.isRequired,
  isImg: PT.bool.isRequired,
};

const test_attachment1 = {
  title: '이미지1 파일',
  size: 2000,
  path: '/images/avatars/avatar_4.png',
  isImg: true
};
const test_attachment2 = {
  title: 'PDF 파일',
  size: 23000,
  path: '/images/test.pdf',
  isImg: false
};
const test_attachment3 = {
  title: '엑셀 파일',
  size: 20200,
  path: '/images/test.xlsx',
  isImg: false
};

mock.onGet('/api/documents').reply(200, {
  documents: [
    {
      id: uuid(),
      author: '이승우',
      group: '전산팀',
      created: '2020-01-02 17:37',
      title: '오라클 유지보수비',
      content: 'PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS'
        + ' 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비',
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
          배치번호: 2368,
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
        }
      ],
      attachments: [test_attachment1, test_attachment2, test_attachment3],
      approvers: [
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '',
          order: 2
        },
      ],
      doc_status: '결재대기중',
    },
    {
      id: uuid(),
      author: '이승우',
      group: '전산팀',
      created: '2020-01-02 17:37',
      title: '오라클 유지보수비',
      content: 'PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS'
        + ' 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비',
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
          배치번호: 2368,
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
        }
      ],
      attachments: [],
      approvers: [
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '',
          order: 2
        },
      ],
      doc_status: '결재대기중',
    },
    {
      id: uuid(),
      author: '이승우',
      group: '전산팀',
      created: '2020-01-02 17:37',
      title: '오라클 유지보수비',
      content: 'PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS'
        + ' 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비PNS 정보 오라클 유지보수비',
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
          배치번호: 2368,
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
        }
      ],
      attachments: [],
      approvers: [
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '',
          order: 2
        },
      ],
      doc_status: '결재대기중',
    },
    {
      id: uuid(),
      author: '최보균',
      group: '재무팀',
      created: '2020-01-03 15:17',
      title: '회계사 비용',
      content: '회계사 비용',
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
          배치번호: 2368,
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
        }
      ],
      attachments: [],
      approvers: [
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '',
          order: 2
        },
      ],
      doc_status: '결재대기중',
    },
    {
      id: uuid(),
      author: '이승우',
      group: '전산팀',
      created: '2020-01-22 11:37',
      title: '서버 비용',
      content: '서버 비용',
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
          배치번호: 2368,
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
        }
      ],
      attachments: [],
      approvers: [
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '',
          order: 2
        },
      ],
      doc_status: '결재대기중',
    },
    {
      id: uuid(),
      author: '이철용',
      group: '전산팀',
      created: '2020-02-02 17:37',
      title: '오랩 쇼핑몰 비용',
      content: '오랩 쇼핑몰 비용1',
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
          배치번호: 2368,
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
        }
      ],
      attachments: [],
      approvers: [
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '',
          order: 2
        },
      ],
      doc_status: '결재대기중',
    },
    {
      id: uuid(),
      author: '이승우',
      group: '전산팀',
      created: '2020-01-02 17:37',
      title: '오라클 유지보수비',
      content: 'PNS 정보 오라클 유지보수비',
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
          배치번호: 2368,
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
        }
      ],
      attachments: [],
      approvers: [
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '이철용',
          department: '전산팀',
          position: '부장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-01-30 15:30',
          order: 0
        },
        {
          id: uuid(),
          name: '윤주영',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '2019-02-02 11:30',
          order: 2
        },
        {
          id: uuid(),
          name: '김희철',
          department: '임원',
          position: '부사장',
          comment: '',
          signType: signType["결재"],
          sign_date: '',
          order: 2
        },
      ],
      doc_status: '결재대기중',
    },
  ]
});
