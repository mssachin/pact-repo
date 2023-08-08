import { Matchers, Pact } from "@pact-foundation/pact";
import { like } from "@pact-foundation/pact/src/dsl/matchers";
import { string } from "@pact-foundation/pact/src/v3/matchers";
import chai from 'chai';
import chaiHttp from 'chai-http';
import path from "path";

const { expect } = chai;
chai.use(chaiHttp);

let provider: Pact;

beforeAll(async () => {
  provider = new Pact({
    consumer: 'post-secrets-proxy-api-secret-store',
    provider: 'post-secrets-secret-store-proxy-api',
    port: 5000,
    log: path.resolve('logs', 'pact.log'),
    dir: path.resolve('pacts'),
    logLevel: 'debug',
    pactfileWriteMode: 'overwrite'
  });
  await provider.setup();
});

const expectedRequest =

beforeEach(() => {
  return provider.addInteraction({
    state: 'I post credentials token',
    uponReceiving: 'A Request for storing credentials',
    withRequest: {
      method: 'POST',
      path: '/Prod', 
      headers: {
        'Content-Type': 'application/json',
         'host': Matchers.string(),
         'x-amz-date': Matchers.string(),
         'x-amz-security-token': Matchers.string(),
         'x-amz-content-sha256': Matchers.string(),
         'authorization': Matchers.string(),
      },
      body: {
        "details": "user credential details as string"
      }
    },
    willRespondWith: {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
      body:  {
        id: Matchers.somethingLike("c08b1650-f6d6-440f-90d5-3e901534a90e"),
        details: Matchers.somethingLike("AQICAHgfObFEEgKhfV7w69GBqVV2nG64WMK4O2h6CBt0qrbnJQGkOo9R3aoSX2MWItcSCLBzAAAAcDBuBgkqhkiG9w0BBwagYTBfAgEAMFoGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMcJp6YEAQwlPXRuyLAgEQgC37w7Su/AmWOZXhaYymUxhXVUI8bq2VxOySQiGbCSbKVO507QF5GOR46ug5j+M=")
      },
    },
  });
});

it('Stores Credentials in Secret Store and Returns a Unique Id and JWT Token', (done) => {
  chai
    .request("http://127.0.0.1:5000")
    .post('/Prod')
    .set('Content-Type','application/json')
    .set('host','string')
    .set('x-amz-date','string')
    .set('x-amz-security-token', 'string')
    .set('x-amz-content-sha256', 'string')
    .set('authorization', 'string')
    .send({"details": "user credential details as string"})
    .end((err, res) => { 
      expect(res.status).to.equal(201); 
      expect(res.body).to.deep.equal({"id":"c08b1650-f6d6-440f-90d5-3e901534a90e", "details": "AQICAHgfObFEEgKhfV7w69GBqVV2nG64WMK4O2h6CBt0qrbnJQGkOo9R3aoSX2MWItcSCLBzAAAAcDBuBgkqhkiG9w0BBwagYTBfAgEAMFoGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMcJp6YEAQwlPXRuyLAgEQgC37w7Su/AmWOZXhaYymUxhXVUI8bq2VxOySQiGbCSbKVO507QF5GOR46ug5j+M="})
      done();
    });
});

afterEach(() => {
  return provider.verify();
});

afterAll(async () => {
  await provider.finalize();
});
