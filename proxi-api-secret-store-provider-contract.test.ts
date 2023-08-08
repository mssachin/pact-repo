import { Verifier, VerifierOptions } from '@pact-foundation/pact';
import chai from 'chai';
import chaiHttp from 'chai-http';
import { Sha256 } from "@aws-crypto/sha256-js";
import { SignatureV4 } from "@aws-sdk/signature-v4";
chai.use(chaiHttp);

let postRequestId: string = "";
if (!process.env.API_URL) {
    throw new Error("API_URL is not configured");
}
const requestUrl = new URL(process.env.API_URL);

const providerBaseUrl = process.env.API_URL;

// const sigv4 = new SignatureV4({
//     service: "execute-api",
//     region: process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION!,
//     credentials: {
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//       sessionToken: process.env.AWS_SESSION_TOKEN,
//     },
//     sha256: Sha256,
//   });

  // async function signRequest(): Promise<any> {
  // const signed = await sigv4.sign({
  //   method: "POST",
  //   hostname: requestUrl.host,
  //   path: requestUrl.pathname,
  //   protocol: requestUrl.protocol,
  //   headers: {
  //     "Content-Type": "application/json",
  //     host: requestUrl.hostname, // compulsory
  //   },
  //   body: JSON.stringify({ "details": "something to store" })
  // });
  // return signed;
  // }
  let contentType: string;
  let host: string;
  let date: string;
  let securityToken: string;
  let contentSha256: string;
  let authorization: string;
  let signedHeadersReq: any;
beforeAll(async () => {
})

let rewriteUrl: string;

describe('Secret Store Pacts Verifications', () => {
  jest.setTimeout(120000);
  it('Check Token', async () => {
  return new Verifier({
            provider: 'post-secrets-secret-store-proxy-api',
            providerBaseUrl: providerBaseUrl,
            logLevel: 'debug',
            requestFilter:async(req, res, next) => {
                const sigv4 = new SignatureV4({
                  service: "execute-api",
                  region: process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION!,
                  credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
                    sessionToken: process.env.AWS_SESSION_TOKEN,
                  },
                  sha256: Sha256,
                });                
                const signed = await sigv4.sign({
                  method: "POST",
                  hostname: requestUrl.host,
                  path: requestUrl.pathname,
                  protocol: requestUrl.protocol,
                  headers: {
                    "Content-Type": "application/json",
                     host: requestUrl.hostname, // compulsory
                  },
                  body: JSON.stringify({ "details": "something to store" })
                });
           

                if (req.url == 'http://127.0.0.1:52103/Prod') {
                  rewriteUrl = providerBaseUrl ;
                  req.baseUrl = rewriteUrl;
              }                
                signedHeadersReq = signed.headers;
                req.headers['Content-Type']= signed.headers['Content-Type'];    
                req.headers['host'] = signed.headers['host']; 
                req.headers['x-amz-date']= signed.headers['x-amz-date']; 
                req.headers['x-amz-security-token']= signed.headers['x-amz-security-token'];
                req.headers['x-amz-content-sha256']= signed.headers['x-amz-content-sha256'];
                req.headers['authorization']= signed.headers['authorization'];
                req.body = JSON.stringify({ "details": "something to store" });
                
              next()
            },
            pactBrokerUrl: 'http://ec2-44-208-250-63.compute-1.amazonaws.com/',
            pactBrokerUsername: 'cc-pact-broker',
            pactBrokerPassword: 'yIVIWFl5X24vzyr',
            providerVersion: 'latest',
            enablePending: true,
            consumerVersionSelectors: [
                {
                    latest: true,
                },
            ],
            publishVerificationResult: true,
        }).verifyProvider();
  });
        
        


    // it('validates expectations of consumers get', async () => {
    //     let rewriteUrl = "";
    //     return new Verifier({
    //         provider: 'get-secrets-secret-store-proxy-api',
    //         providerBaseUrl: process.env.PROVIDER_ENDPOINT,
    //         logLevel: 'info',
    //         requestFilter: (req, res, next) => {
    //             if (req.url != '/_pactSetup') {
    //                 rewriteUrl = "/" + postRequestId
    //                 req.url = rewriteUrl;
    //             }
    //             next();
    //         },
    //         stateHandlers: {
    //             ['I get credentials']: async () => {
    //                 await chai.request(process.env.PROVIDER_ENDPOINT)
    //                     .get(rewriteUrl)
    //                     .set('content-type', 'application/json')
    //             },
    //         },
    //         pactBrokerUrl: 'http://ec2-44-208-250-63.compute-1.amazonaws.com/',
    //         pactBrokerUsername: 'cc-pact-broker',
    //         pactBrokerPassword: 'yIVIWFl5X24vzyr',
    //         providerVersion: 'latest',
    //         changeOrigin: true,
    //         enablePending: true,
    //         consumerVersionSelectors: [
    //             {
    //                 latest: true,
    //             },
    //         ],
    //         publishVerificationResult: true,
    //     }).verifyProvider();
    // }, 20000);


    // it('validates expectations of consumers put', async () => {
    //     let requestBody = { "id": postRequestId, "details": "something to store" }
    //     return new Verifier({
    //         provider: 'put-secrets-secret-store-proxy-api',
    //         providerBaseUrl: process.env.PROVIDER_ENDPOINT,
    //         logLevel: 'info',
    //         requestFilter: (req, res, next) => {
    //             req.body = requestBody;
    //             next();
    //         },
    //         stateHandlers: {

    //             ['I put credentials token']: async () => {
    //                 await chai
    //                     .request(process.env.PROVIDER_ENDPOINT)
    //                     .put('/')
    //                     .set('Content-Type', 'application/json')
    //                     .send({
    //                         requestBody
    //                     })
    //             }

    //         },
    //         pactBrokerUrl: 'http://ec2-44-208-250-63.compute-1.amazonaws.com/',
    //         pactBrokerUsername: 'cc-pact-broker',
    //         pactBrokerPassword: 'yIVIWFl5X24vzyr',
    //         providerVersion: 'latest',
    //         enablePending: true,
    //         consumerVersionSelectors: [
    //             {
    //                 latest: true,
    //             },
    //         ],
    //         publishVerificationResult: true,
    //     }).verifyProvider();
    // }, 20000);

});