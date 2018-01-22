import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import users from '../../../app/redux/modules/users';


describe('users', () => {

  it('handles AUTH_USER', () => {

    const initialState = {
      isFetching: false,
      error: '',
      isAuthed: false,
      authedId: ''
    }
    const action = {type: 'AUTH_USER', uid: '12345' };
    const nextState = users(initialState, action);

    expect(nextState).to.deep.equal({
      isFetching: false,
      error: '',
      isAuthed: true,
      authedId: '12345'
    });
  });

  it('handles UNAUTH_USER', () => {

    const initialState = {
      isFetching: false,
      error: '',
      isAuthed: true,
      authedId: '12345'
    }
    const action = {type: 'UNAUTH_USER' };
    const nextState = users(initialState, action);

    expect(nextState).to.deep.equal({
      isFetching: false,
      error: '',
      isAuthed: false,
      authedId: ''
    });
  });

})