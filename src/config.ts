import { Timezones } from './globals';
export const TAG_KV = new pylon.KVNamespace('tags');
const config = {
  prefixes: ['.', 'use '],

  clientOwners: ['504698587221852172'],
  timezone: 'America/Chicago' as Timezones,
  storage: {
    channelId: '888962409144909876',
    identifier: `store-:rand: :filename:`
  },
  keys: {
    imagga:
      '', 
    // qr_generator:
    //   '' //private
    pxl_api: '', //private
    imgix: '', //private
    discard_cc:
      '' //private
  }
};
export default config;
