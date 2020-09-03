import uuid from 'uuid/v1';
import moment from 'moment';
import mock from 'src/utils/mock';
import PT from 'prop-types';

export const type = {"결재": 0, "합의": 1, "참조": 2};

// eslint-disable-next-line import/prefer-default-export
export const users = {
  id: PT.string.isRequired,
  name: PT.string.isRequired,
  avatar: PT.string.isRequired,
  department: PT.string.isRequired,
  position: PT.string.isRequired,
  type: PT.number.isRequired,
  order: PT.number.isRequired
};


mock.onGet('/api/allUsers').reply(200, {
  users: [
    {
      id: 'cyl20509',
      name: '이철용',
      avatar: '/images/avatars/avatar_4.png',
      department: '전산팀',
      position: '부장',
      type: type["결재"],
      order: 0
    },
    {
      id: 'bhl21111',
      name: '이병학',
      avatar: '/images/avatars/avatar_3.png',
      department: '구매팀',
      position: '대리',
      type: type["합의"],
      order: 1
    },
    {
      id: 'jyy20510',
      name: '윤주영',
      avatar: '/images/avatars/avatar_4.png',
      department: '임원',
      position: '부사장',
      type: type["결재"],
      order: 2
    },
  ]
});

mock.onGet('/api/defaultUsers').reply(200, {
  users: [
    {
      id: 'cyl20509',
      name: '이철용',
      avatar: '/images/avatars/avatar_4.png',
      department: '전산팀',
      position: '부장',
      type: type["결재"],
      order: 0
    },
    {
      id: 'bhl21111',
      name: '이병학',
      avatar: '/images/avatars/avatar_3.png',
      department: '구매팀',
      position: '대리',
      type: type["합의"],
      order: 1
    },
    {
      id: 'jyy20510',
      name: '윤주영',
      avatar: '/images/avatars/avatar_4.png',
      department: '임원',
      position: '부사장',
      type: type["결재"],
      order: 2
    },
  ]
});

mock.onGet('/api/departmentUsers').reply(200, {
  users: [
    {
      id: 'cyl20509',
      name: '이철용',
      avatar: '/images/avatars/avatar_4.png',
      department: '전산팀',
      position: '부장',
      type: type["결재"],
      order: 0
    },
    {
      id: 'jyy20510',
      name: '윤주영',
      avatar: '/images/avatars/avatar_4.png',
      department: '임원',
      position: '부사장',
      type: type["결재"],
      order: 2
    },
  ]
});
