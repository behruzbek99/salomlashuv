import test from 'node:test';
import assert from 'node:assert/strict';
import { makeShareUrl, readShareData } from '../src/share.mjs';

test('shared greeting survives opening on another device and origin', () => {
  const link = makeShareUrl(
    'G‘ulnoza Karimova',
    'formal',
    2,
    'sage',
    'Siz bilan faxrlanamiz. Barcha ezgu niyatlaringiz amalga oshsin!',
    'parent',
    'https://birthday.example.uz/tabrik/',
  );
  const shared = readShareData(link);

  assert.equal(new URL(link).origin, 'https://birthday.example.uz');
  assert.equal(shared.name, 'G‘ulnoza Karimova');
  assert.equal(shared.tone, 'formal');
  assert.equal(shared.theme, 'sage');
  assert.equal(shared.relation, 'parent');
  assert.equal(shared.wishIndex, 2);
  assert.equal(shared.customMessage, 'Siz bilan faxrlanamiz. Barcha ezgu niyatlaringiz amalga oshsin!');
});

test('share links omit an empty custom message and accept generated wishes', () => {
  const link = makeShareUrl('Aziz', 'warm', 1, 'midnight', '   ', 'friend', 'https://birthday.example.uz/');
  const shared = readShareData(link);

  assert.equal(new URL(link).searchParams.has('message'), false);
  assert.equal(shared.name, 'Aziz');
  assert.equal(shared.wishIndex, 1);
  assert.equal(shared.customMessage, '');
});

test('share data is sanitized and invalid options use safe defaults', () => {
  const link = 'https://birthday.example.uz/?name=%20Aziz%20%20Ali%20&tone=unexpected&theme=neon&wish=-4&message=ok';
  const shared = readShareData(link);

  assert.equal(shared.name, 'Aziz Ali');
  assert.equal(shared.tone, 'warm');
  assert.equal(shared.theme, 'midnight');
  assert.equal(shared.relation, 'friend');
  assert.equal(shared.wishIndex, -1);
  assert.equal(shared.customMessage, 'ok');
  assert.equal(shared.relation, 'friend');
});

test('custom-message links do not pretend to contain a generated wish', () => {
  const link = makeShareUrl('Nodira', 'warm', -1, 'midnight', 'Yurakdan chiqqan tilak.', 'partner', 'https://birthday.example.uz/');
  const shared = readShareData(link);

  assert.equal(shared.wishIndex, -1);
  assert.equal(shared.customMessage, 'Yurakdan chiqqan tilak.');
  assert.equal(shared.relation, 'partner');
});
