import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const config = JSON.parse(
  await readFile(new URL('../src/config/config.prod.json', import.meta.url), 'utf8')
);

assert.deepEqual(
  Object.keys(config).sort(),
  ['knora'],
  'Production browser configuration must contain only the public DSP settings.'
);

assert.deepEqual(
  Object.keys(config.knora).sort(),
  ['apiHost', 'apiPath', 'apiPort', 'apiProtocol', 'logErrors'].sort(),
  'Production DSP configuration contains an unexpected key.'
);

const serializedKeys = JSON.stringify(Object.keys(config.knora));
assert.doesNotMatch(
  serializedKeys,
  /secret|password|token|api.?key|access.?key|private.?key|credential|authorization/i,
  'Production browser configuration must not contain secret-like keys.'
);

console.log('Public production configuration policy passed.');
