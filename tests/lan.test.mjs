import { test } from 'node:test';
import assert from 'node:assert/strict';
import { allowsPeer, checkLanRequest, selectInterface, subnetFor } from '../scripts/lan-policy.mjs';

const subnet = subnetFor('192.168.2.182', '192.168.2.182/24');
const config = { subnet, authority: '192.168.2.182:3000' };
const valid = { peer: '192.168.2.10', method: 'POST', host: config.authority, origin: `http://${config.authority}`, target: '/session' };

test('LAN boundary permits only direct private peers in the selected subnet', () => {
  assert.equal(allowsPeer('192.168.2.10', subnet), true);
  assert.equal(allowsPeer('::ffff:192.168.2.10', subnet), true);
  for (const peer of ['192.168.3.10', '10.0.0.2', '172.16.1.1', '8.8.8.8', '127.0.0.1', '::1', 'fe80::1', undefined, '192.168.2.0', '192.168.2.255']) {
    assert.equal(allowsPeer(peer, subnet), false, String(peer));
  }
  assert.equal(checkLanRequest(valid, config), null);
  assert.match(checkLanRequest({ ...valid, peer: '203.0.113.1', forwarded: '192.168.2.10' }, config), /outside/);
});

test('LAN guard rejects forged host, cross-site writes and proxy targets', () => {
  for (const change of [{ host: 'example.com' }, { origin: 'http://example.com' }, { origin: undefined }, { target: 'http://example.com' }, { target: '//example.com' }]) {
    assert.ok(checkLanRequest({ ...valid, ...change }, config));
  }
  assert.equal(checkLanRequest({ ...valid, method: 'GET', origin: undefined }, config), null);
  assert.throws(() => subnetFor('8.8.8.8', '8.8.8.8/24'), /private/);
  assert.throws(() => subnetFor('192.168.2.1', '192.168.2.1/0'), /private/);
  assert.throws(() => subnetFor('192.168.2.1', '192.168.3.1/24'), /subnet/);
});

test('startup selects one real interface and fails closed on ambiguity or missing interface', () => {
  const entry = { family: 'IPv4', internal: false, address: '192.168.2.182', cidr: '192.168.2.182/24' };
  assert.equal(selectInterface({ en0: [entry] }).address, entry.address);
  assert.equal(selectInterface({ en0: [entry], en1: [entry] }, 'en0').name, 'en0');
  assert.throws(() => selectInterface({ en0: [entry], en1: [entry] }), /Select one/);
  assert.throws(() => selectInterface({ en0: [entry] }, 'missing'), /Select one/);
});
