import {expect} from 'chai';
import modal from '../../../app/redux/modules/modal';


describe('modal', () => {

  it('handles OPEN_MODAL', () => {
    const initialState = {
      text: '',
      isOpen: false,
    }
    const action = {type: 'OPEN_MODAL' };
    const nextState = modal(initialState, action);

    expect(nextState).to.deep.equal({
      text: '',
      isOpen: true,
    });
  });

  it('handles CLOSE_MODAL', () => {
    const initialState = {
      text: '',
      isOpen: true,
    }
    const action = {type: 'CLOSE_MODAL' };
    const nextState = modal(initialState, action);

    expect(nextState).to.deep.equal({
      text: '',
      isOpen: false,
    });
  });

})