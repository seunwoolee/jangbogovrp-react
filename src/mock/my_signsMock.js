import uuid from 'uuid/v1';
import moment from 'moment';
import mock from 'src/utils/mock';
import PT from 'prop-types';

export const signType = {"결재": 10, "합의": 20, "참조": 30};

// eslint-disable-next-line import/prefer-default-export
export const signs = {
  id: PT.string.isRequired,
  name: PT.string.isRequired,
  department: PT.string.isRequired,
  position: PT.string.isRequired,
  comment: PT.string.isRequired,
  signType: PT.number.isRequired,
  sign_date: PT.string.isRequired,
  order: PT.number.isRequired
};

mock.onGet('/api/signs').reply(200, {
  users: [
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
  ]
});
