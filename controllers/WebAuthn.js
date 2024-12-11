import { Fido2Lib } from 'fido2-lib';
import crypto from 'crypto';
import base64url from 'base64url';

/**
 * L'authentification ne se fait pas via le password mais via un passkey qui sera enregistrer dans google password
 * process env de DOMAIN et ORIGIN pour gérer la prod / dev
 * Fonctionne en DEV mais erreur de CORS en PROD
 */

const fido = new Fido2Lib({
  timeout: 60000,
  rpId: process.env.DOMAIN, // nom du site qui apparaitra dans google password pour le retrouver
  rpName: 'PWA authentification test', // display name inside google password
  rpIcon: 'https://whatpwacando.today/src/img/icons/icon-512x512.png', // icon display inside google password
  challengeSize: 128,
  attestation: 'none',
  cryptoParams: [-7, -257],
  authenticatorAttachment: 'platform',
  authenticatorRequireResidentKey: false,
  authenticatorUserVerification: 'required',
});

export async function registrationOptions(req, res) {
  const registrationOptions = await fido.attestationOptions();

  req.session.challenge = Buffer.from(registrationOptions.challenge);
  req.session.userHandle = crypto.randomBytes(32);

  registrationOptions.user.id = req.session.userHandle;
  registrationOptions.challenge = Buffer.from(registrationOptions.challenge);

  // iOS
  registrationOptions.authenticatorSelection = {
    authenticatorAttachment: 'platform',
  };

  res.json(registrationOptions);
}

export async function register(req, res) {
  const { credential } = req.body;

  const challenge = new Uint8Array(req.session.challenge.data).buffer;
  credential.rawId = new Uint8Array(
    Buffer.from(credential.rawId, 'base64')
  ).buffer;
  credential.response.attestationObject = base64url.decode(
    credential.response.attestationObject,
    'base64'
  );
  credential.response.clientDataJSON = base64url.decode(
    credential.response.clientDataJSON,
    'base64'
  );

  const attestationExpectations = {
    challenge,
    origin: process.env.ORIGIN,
    factor: 'either',
  };

  try {
    const regResult = await fido.attestationResult(
      credential,
      attestationExpectations
    );

    req.session.publicKey = regResult.authnrData.get('credentialPublicKeyPem');
    req.session.prevCounter = regResult.authnrData.get('counter');

    res.json({ status: 'ok' });
  } catch (e) {
    console.log('error', e);
    res.status(500).json({ status: 'failed' });
  }
}

export async function authenticationOptions(req, res) {
  const authnOptions = await fido.assertionOptions();

  req.session.challenge = Buffer.from(authnOptions.challenge);

  authnOptions.challenge = Buffer.from(authnOptions.challenge);

  res.json(authnOptions);
}

export async function authenticate(req, res) {
  const { credential } = req.body;

  credential.rawId = new Uint8Array(
    Buffer.from(credential.rawId, 'base64')
  ).buffer;

  const challenge = new Uint8Array(req.session.challenge.data).buffer;
  const { publicKey, prevCounter } = req.session;

  if (publicKey === 'undefined' || prevCounter === undefined) {
    res.status(404).json({ status: 'not found' });
  } else {
    const assertionExpectations = {
      challenge,
      origin: process.env.ORIGIN,
      factor: 'either',
      publicKey,
      prevCounter,
      userHandle: new Uint8Array(Buffer.from(req.session.userHandle, 'base64'))
        .buffer, //new Uint8Array(Buffer.from(req.session.userHandle.data)).buffer
    };

    try {
      await fido.assertionResult(credential, assertionExpectations); // will throw on error

      /* 
      Si authentifier renverra ici toutes les données dont un user a besoin post authentification
      */

      res.json({ status: 'ok' });
    } catch (e) {
      console.log('error', e);
      res.status(500).json({ status: 'failed' });
    }
  }
}
