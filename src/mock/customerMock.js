import uuid from 'uuid/v1';
import moment from 'moment';
import mock from 'src/utils/mock';
import PT from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const customers = {
  id: PT.number.isRequired,
  공급자명: PT.string.isRequired,
  avatar: PT.string.isRequired,
  email: PT.string.isRequired,
  일자: PT.string.isRequired,
  총액: PT.number.isRequired,
  비고: PT.string.isRequired,
  사용자: PT.string.isRequired,
  배치번호: PT.number.isRequired,
  location: PT.string.isRequired
};


mock.onGet('/api/management/customers').reply(200, {
  customers: [
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
      총액: '230.00',
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
      총액: '600.00',
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
      총액: '540.00',
      통화: '\\',
      비고: '그룹웨어 클라우드 비용/1',
      사용자: '이승우',
      배치번호: 2368,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: 'LG 전자',
      avatar: '/images/avatars/avatar_1.png',
      email: '',
      일자: '2020-01-30',
      총액: '33300.00',
      통화: '\\',
      비고: '그룹웨어 클라우드 비용/1',
      사용자: '이철용',
      배치번호: 2368,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: '케이씨프레쉬',
      avatar: '/images/avatars/avatar_3.png',
      email: '',
      일자: '2020-01-22',
      총액: '6000.00',
      통화: '\\',
      비고: '그룹웨어 클라우드 비용/1',
      사용자: '이승우',
      배치번호: 2368,
      location: 'West Virginia, USA'
    },
    {
      id: uuid(),
      공급자명: '대한민국',
      avatar: '/images/avatars/avatar_4.png',
      email: '',
      일자: '2020-01-31',
      총액: '300.00',
      통화: '\\',
      비고: '그룹웨어 클라우드 비용/1',
      사용자: '이승우',
      배치번호: 2368,
      location: 'West Virginia, USA'
    },
  ]
});

mock.onGet('/api/management/customers/1/summary').reply(200, {
  summary: {
    name: 'Ekaterina Tankova',
    email: 'ekaterina@devias.io',
    phone: '+55 748 327 439',
    state: 'Alabama',
    country: 'United States',
    zipCode: '240355',
    address1: 'Street John Wick, no. 7',
    address2: 'House #25',
    iban: '4142 **** **** **** ****',
    autoCC: false,
    verified: true,
    currency: '$',
    invoices: [
      {
        id: uuid(),
        type: 'paid',
        value: 10.0
      },
      {
        id: uuid(),
        type: 'paid',
        value: 15.0
      },
      {
        id: uuid(),
        type: 'due',
        value: 5
      },
      {
        id: uuid(),
        type: 'income',
        value: 10.0
      }
    ],
    vat: 19,
    balance: 0,
    emails: [
      {
        id: uuid(),
        description: 'Order confirmation',
        created_at: moment()
          .subtract(3, 'days')
          .subtract(5, 'hours')
          .subtract(34, 'minutes')
      },
      {
        id: uuid(),
        description: 'Order confirmation',
        created_at: moment()
          .subtract(4, 'days')
          .subtract(11, 'hours')
          .subtract(49, 'minutes')
      }
    ]
  }
});

mock.onGet('/api/management/customers/1/documents').reply(200, {
  invoices: [
    {
      id: uuid(),
      date: moment(),
      description: 'Freelancer Subscription (12/05/2019 - 11/06/2019)',
      paymentMethod: 'Credit Card',
      value: '5.25',
      currency: '$',
      status: 'paid'
    },
    {
      id: uuid(),
      date: moment(),
      description: 'Freelancer Subscription (12/05/2019 - 11/06/2019)',
      paymentMethod: 'Credit Card',
      value: '5.25',
      currency: '$',
      status: 'paid'
    }
  ]
});

mock.onGet('/api/management/customers/1/logs').reply(200, {
  logs: [
    {
      id: uuid(),
      status: 200,
      method: 'POST',
      route: '/api/purchase',
      desc: 'Purchase',
      IP: '84.234.243.42',
      created_at: moment()
        .subtract(2, 'days')
        .subtract(2, 'minutes')
        .subtract(56, 'seconds')
    },
    {
      id: uuid(),
      status: 522,
      error: 'Invalid credit card',
      method: 'POST',
      route: '/api/purchase',
      desc: 'Purchase',
      IP: '84.234.243.42',
      created_at: moment()
        .subtract(2, 'days')
        .subtract(2, 'minutes')
        .subtract(56, 'seconds')
    },
    {
      id: uuid(),
      status: 200,
      method: 'DELETE',
      route: '/api/products/d65654e/remove',
      desc: 'Cart remove',
      IP: '84.234.243.42',
      created_at: moment()
        .subtract(2, 'days')
        .subtract(8, 'minutes')
        .subtract(23, 'seconds')
    },
    {
      id: uuid(),
      status: 200,
      method: 'GET',
      route: '/api/products/d65654e/add',
      desc: 'Cart add',
      IP: '84.234.243.42',
      created_at: moment()
        .subtract(2, 'days')
        .subtract(20, 'minutes')
        .subtract(54, 'seconds')
    },
    {
      id: uuid(),
      status: 200,
      method: 'GET',
      route: '/api/products/c85727f/add',
      desc: 'Cart add',
      IP: '84.234.243.42',
      created_at: moment()
        .subtract(2, 'days')
        .subtract(34, 'minutes')
        .subtract(16, 'seconds')
    },
    {
      id: uuid(),
      status: 200,
      method: 'GET',
      route: '/api/products/c85727f',
      desc: 'View product',
      IP: '84.234.243.42',
      created_at: moment()
        .subtract(2, 'days')
        .subtract(54, 'minutes')
        .subtract(30, 'seconds')
    },
    {
      id: uuid(),
      status: 200,
      method: 'GET',
      route: '/api/products',
      desc: 'Get products',
      IP: '84.234.243.42',
      created_at: moment()
        .subtract(2, 'days')
        .subtract(56, 'minutes')
        .subtract(40, 'seconds')
    },
    {
      id: uuid(),
      status: 200,
      method: 'POST',
      route: '/api/login',
      desc: 'Login',
      IP: '84.234.243.42',
      created_at: moment()
        .subtract(2, 'days')
        .subtract(57, 'minutes')
        .subtract(5, 'seconds')
    }
  ]
});
