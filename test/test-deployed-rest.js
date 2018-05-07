// Assumes REST system deployed with one collection mindmap.
// Do that with > npm run create-rest

let chai = require('chai');
let assert = chai.assert;
let axios = require('axios');

let apiUrl = require('../build/create-details.json').apiUrl;
let mindMapUrl = apiUrl + '/mindmap';

// function showResponse(response){
//   console.log('--------------');
//   console.log(response.data);
//   console.log(response.status);
//   console.log(response.statusText);
//   console.log(response.headers);
//   console.log(response.config);
//   console.log('--------------');
// }

describe('Simple GETs', function() {

  it('GET on collection returns 200', done => {
    axios.get(mindMapUrl)
    .then( response => {
      assert(response.status == 200, 'GET response should be 200');
      assert(Array.isArray(response.data), 'Get on collection should return an array');
      done();
    })
    .catch( error => {
      assert.fail('promise resolved','promise rejected','ERROR:'+error);
      done();
    });
  });

  it('GET missing collection returns 404', done => {
    axios.get(apiUrl + '/not-there')
      .then(response => {
        assert.fail('promise resolved', 'promise rejected', 'Response:' + response);
        done();
      })
      .catch(error => {
        assert(error.response.status == 404, 'GET response should be 404');
        done();
      });
  });

  it('GET missing resource returns 404', function (done) {
    axios.get(mindMapUrl + '/not-there')
      .then(response => {
        assert.fail('promise resolved', 'promise rejected', 'response:' + response);
        done();
      })
      .catch(error => {
        assert(error.response.status == 404, 'GET response should be 404');
        done();
      });
  });


});


describe('Write, get, delete', function () {
  let o = { id: '123', content: {x:5} };

  it('post, get, delete', async () => {
    let postResponse = await axios.post(mindMapUrl, o);
    assert(postResponse.status == 201, 'unexpected post status ' + postResponse.status);
    let getResponse = await axios.get(mindMapUrl + '/123');
    assert(getResponse.status == 200, 'unexpected get status ' + getResponse.status);
    assert(getResponse.data.content.x == o.content.x, 'Did not get back what was posted');
    let deleteResponse = await axios.delete(mindMapUrl + '/123');
    assert(deleteResponse.status == 200, 'unexpected delete status ' + deleteResponse.status);
  });
  it('put, get, delete', async () => {
    let putResponse = await axios.put(mindMapUrl + '/123', o);
    assert(putResponse.status == 201, 'unexpected put status ' + putResponse.status);
    let getResponse = await axios.get(mindMapUrl + '/123');
    assert(getResponse.status == 200, 'unexpected get status ' + getResponse.status);
    assert(getResponse.data.content.x == o.content.x, 'Did not get back what was posted');
    let deleteResponse = await axios.delete(mindMapUrl + '/123');
    assert(deleteResponse.status == 200, 'unexpected delete status ' + deleteResponse.status);
  });

  it('post without id should inject id', async () => {
    let postResponse = await axios.post(mindMapUrl, { foo: 'bar' });
    assert(postResponse.status == 201, 'unexpected post status ' + postResponse.status);
    let o = postResponse.data;
    assert(typeof o == 'object', 'Since object was posted, an object is expected for response');
    assert(o.id, 'id property was not injected');
    console.log('------');
    console.log(JSON.stringify(o));
    console.log('------');
    let deleteResponse = await axios.delete(mindMapUrl + '/' + o.id);
    assert(deleteResponse.status == 200, 'unexpected delete status ' + deleteResponse.status);
  });

  it('post of array with some missing ids to inject', async () => {
    const ary = [{ id: 'one' }, { id: 'two', foo: 'bar' }, { }, { joe: 'schmoe' }, { id: 'five', content: '{}' }];
    let postResponse = await axios.post(mindMapUrl, ary);
    assert(postResponse.status == 201, 'unexpected post status ' + postResponse.status);
    let d = postResponse.data;
    assert(Array.isArray(d), 'An array was posted so expected an array back but got ' + typeof d);
    assert(d.length == ary.length,'Expected same number of objects as posted');
    console.log('------');
    console.log(JSON.stringify(postResponse.data));
    console.log('------');
    assert(d.every( o => o.id ), 'Expected every object in response to have an id');
  });

});
