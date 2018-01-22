import React from 'react';
import { shallow } from 'enzyme';
import AuthButton from '../../../app/components/AuthButton/AuthButton';
import sinon from 'sinon';
import {expect} from 'chai';

describe('<AuthButton />', () => {
  it('renders the login button', () => {
    const spy = sinon.spy;
    const wrapper = shallow(<AuthButton onAuth={spy} isFetching={false} />);
    const buttons = wrapper.find('Button');
    expect(buttons).to.have.length.of(1);
    buttons.at(0).simulate('click');
    expect(buttons.at(0).prop('children')).to.equal('Sign In')
   });
});