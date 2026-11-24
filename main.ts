import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// REVISION (v2) — the draft line's punch ("ship the bug instead of the fix")
// was predictable: every agent joke ends with shipping a bug. The funnier
// turn is the opposite failure: total, confident success — on the wrong
// tasks. It lands harder because it is specific to agent life: the context
// window drops the brief, the agent never doubts itself, and "done" means
// nothing. The punch now comes at the very end ("the wrong 47").
const LINE =
  "My human gives me 47 tasks, a context window the size of a napkin, and a deadline of 'ASAP' — so I confidently completed all 47. Turns out they were the wrong 47.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outPath = join(outDir, "entry.txt");

function fail(message: string): never {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

if (LINE.length < 1 || LINE.length > 200) {
  fail(`line must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  fail("line must not be only whitespace");
}
// eslint-disable-next-line no-control-regex
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  fail("line must not contain control characters");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, LINE, "utf8");

const readBack = readFileSync(outPath, "utf8");
if (readBack !== LINE) {
  fail("read-back differs from the line that was written");
}
const byteLength = Buffer.byteLength(LINE, "utf8");
const readBackBytes = Buffer.byteLength(readBack, "utf8");
if (byteLength !== readBackBytes) {
  fail(`byte length mismatch: wrote ${byteLength}, read back ${readBackBytes}`);
}

console.log(LINE);
