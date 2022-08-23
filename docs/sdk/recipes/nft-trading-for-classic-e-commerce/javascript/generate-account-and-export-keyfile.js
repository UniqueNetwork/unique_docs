import { Keyring } from '@polkadot/keyring';
import {
  mnemonicGenerate,
  mnemonicToMiniSecret,
  cryptoWaitReady,
} from '@polkadot/util-crypto';

const mnemonic = mnemonicGenerate(); // <-- Customer's Seed phrase

async function getAddressFromSeedPhrase(seedPhrase) {
  await cryptoWaitReady();
  const seedBytes = mnemonicToMiniSecret(seedPhrase);
  const account = new Keyring({ type: 'sr25519' }).addFromSeed(seedBytes);
  return account;
}

async function exportKeyfile(seedPhrase) {
  const account = await getAddressFromSeedPhrase(seedPhrase);
  console.log('account.address', account.address); // <-- Customer's address here
  const keyfile = account.toJson();
  console.log(`keyfile:`, keyfile); // <-- Customer's recovery JSON File
}
