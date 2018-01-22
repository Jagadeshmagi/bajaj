import {Map, fromJS} from 'immutable';
import {expect} from 'chai';
import credentialsList from '../../../app/redux/modules/credentials';


describe('credentialsList', () => {

  it('handles ADD_CREDENTIAL', () => {

    const initialState = 
    {
        newcredId:0,
        credentials:[]
    }
    const action = {type:'ADD_CREDENTIAL',id:1,credType:'Linux Server-SSH',credname:'RHEL-Test',credUsage:'Global'};
    const nextState = credentialsList(initialState, action);

    expect(nextState).to.deep.equal({
      credentials:[{
            id: 1,
            credType: 'Linux Server-SSH',
            credname: 'RHEL-Test',
            credUsage: 'Global'
          }],

    newcredId:1
    });
  });

it('handles DELETE_CREDENTIAL', ()=>{
     const initialState = 
    {
        credentials:[{
           id: 1,
            credType: 'Linux Server-SSH',
            credname: 'RHEL-Test',
            credUsage: 'Global'
        },

        {id:2,
         credType:"Windows Server",
          credname:"Windows-Test" , 
          credUsage:"Restricted"
        },
        ]
    }
    const action = {type:'DELETE_CREDENTIAL',credname:'Windows-Test'};
    const nextState = credentialsList(initialState, action);

       expect(nextState).to.deep.equal({
      credentials:[{
           id: 1,
            credType: 'Linux Server-SSH',
            credname: 'RHEL-Test',
            credUsage: 'Global'
          }],
    });

  });

})