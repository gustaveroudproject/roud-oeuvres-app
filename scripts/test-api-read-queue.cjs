const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { Observable, of, throwError, VirtualTimeScheduler } = require('rxjs');
const filename = path.resolve(__dirname, '../src/app/api-read-queue.ts');
const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS }
}).outputText;
const moduleUnderTest = new Module(filename, module);
moduleUnderTest.filename = filename;
moduleUnderTest.paths = module.paths;
moduleUnderTest._compile(compiled, filename);
const { ApiReadQueue } = moduleUnderTest.exports;

// Shared FIFO starts across methods; cancelled queued work never makes a request.
{
  const clock = new VirtualTimeScheduler(), queue = new ApiReadQueue(250, clock);
  const starts = [], results = [];
  const read = queue.wrap(value => { starts.push([clock.now(), value]); return of(value); });
  const first = read('resource'), cancelled = read('cancel'), third = read('search');
  assert.equal(starts.length, 0, 'construction must remain lazy');
  first.subscribe(value => results.push(value));
  const sub = cancelled.subscribe();
  third.subscribe(value => results.push(value));
  sub.unsubscribe();
  clock.flush();
  assert.deepEqual(starts, [[0, 'resource'], [250, 'search']]);
  assert.deepEqual(results, ['resource', 'search']);
}

// Cancelling an active request tears it down; errors propagate, never disappear.
{
  const clock = new VirtualTimeScheduler(), queue = new ApiReadQueue(250, clock);
  let tornDown = false, receivedError, completed = false;
  const active = queue.wrap(() => new Observable(() => () => { tornDown = true; }));
  const fail = queue.wrap(() => throwError(new Error('upstream')));
  const next = queue.wrap(() => of('next'));
  const sub = active().subscribe();
  clock.schedule(() => sub.unsubscribe(), 50);
  fail().subscribe({ error: error => receivedError = error.message });
  next().subscribe({ complete: () => completed = true });
  clock.flush();
  assert(tornDown);
  assert.equal(receivedError, 'upstream');
  assert(completed);
}

// Nested reads scheduled by completion keep the same budget; no deadlock.
{
  const clock = new VirtualTimeScheduler(), queue = new ApiReadQueue(250, clock);
  const starts = [];
  const read = queue.wrap(value => { starts.push([clock.now(), value]); return of(value); });
  read(1).subscribe(() => read(3).subscribe());
  read(2).subscribe();
  clock.flush();
  assert.deepEqual(starts, [[0, 1], [250, 2], [500, 3]]);
}

// A thrown factory error is observable and does not wedge the queue.
{
  const clock = new VirtualTimeScheduler(), queue = new ApiReadQueue(250, clock);
  let error, result;
  queue.wrap(() => { throw new Error('factory'); })().subscribe({ error: e => error = e.message });
  queue.wrap(() => of(42))().subscribe(value => result = value);
  clock.flush();
  assert.equal(error, 'factory');
  assert.equal(result, 42);
}
console.log('API read queue: spacing, laziness, cancellation, errors and nested reads passed');
