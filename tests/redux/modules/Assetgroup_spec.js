import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import assetGroups from '../../../app/redux/modules/assetGroups';


describe('assetGroups', () => {
  it('handles ADD_CLOUD', () => {
    //const initialState = Map();
    const initialState = {
       newGroupId:0,
        groups: []
    }
    const action = {type: 'ADD_CLOUD', id:1,name:'cloud1',grouptype:'cloud',regionsSelected:'Us-west-1',accesskey:'aaaa',secretaccesskey:'1111',rolename:'role1',credential:'linux',vpcselect:'vpc1',currentdate:'9th June',deployment:'Cloud' };

    const nextState = assetGroups(initialState, action);

    //expect(nextState).to.equal(fromJS({
    expect(nextState).to.deep.equal({
	newGroupId:1,
	groups: [
    {id:1,
    name:'cloud1',
	grouptype:'cloud',
	regionsSelected:'Us-west-1',
	accesskey:'aaaa',
	secretaccesskey:'1111',
	rolename:'role1',
	credential:'linux',
	vpcselect:'vpc1',
	deployment:'Cloud',
	lasttime:"9th June",
    description:"cloud",
    createdby:"abc"
  	}]
    //}));
    });
  });
  
 
it('handles ADD_ONPREMISES', () => {
    //const initialState = Map();
    const initialState = {
       newGroupId:0,
        groups: []
    }
    const action = {type: 'ADD_ONPREMISES', id:1,name:'onpremises1',grouptype:'onpremises',startingip:'10.101.10.111',endingip:'10.101.10.111',description:'onpremises',credential:'linux',currentdate:'9th June',deployment:'Cloud'};

    const nextState = assetGroups(initialState, action);

    //expect(nextState).to.equal(fromJS({
    expect(nextState).to.deep.equal({
	newGroupId:1,
	groups: [
    {id:1,
    name:'onpremises1',
	grouptype:'onpremises',
	startingip:'10.101.10.111',
	endingip:'10.101.10.111',
	credential:'linux',
	deployment:'Cloud',
	lasttime:'9th June',
	description:'onpremises',
	createdby:"abc"
	}]
    //}));
    });
  });
 
  
  
})