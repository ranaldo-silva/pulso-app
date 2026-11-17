const fs = require('fs');
const path = require('path');

function generateWav(filename, toneConfig) {
  const sampleRate = 8000;
  let allSamples = [];

  for (const part of toneConfig) {
    const numSamples = Math.floor(sampleRate * (part.durationMs / 1000));
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      // apply simple attack/decay envelope to avoid clicking
      let env = 1.0;
      const fadeSamples = Math.min(80, Math.floor(numSamples / 4));
      if (i < fadeSamples) {
        env = i / fadeSamples;
      } else if (i > numSamples - fadeSamples) {
        env = (numSamples - i) / fadeSamples;
      }
      const val = Math.sin(2 * Math.PI * part.freq * t) * 0.8 * env;
      const sample = Math.max(-32768, Math.min(32767, Math.floor(val * 32767)));
      allSamples.push(sample);
    }
  }

  const dataSize = allSamples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32);  // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (const s of allSamples) {
    buffer.writeInt16LE(s, offset);
    offset += 2;
  }

  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(filename, buffer);
  console.log(`Generated: ${filename} (${buffer.length} bytes)`);
}

const soundsDir = path.join(__dirname, '..', 'assets', 'sounds');

// PTT Start chirp: 1200Hz 40ms + 1600Hz 40ms
generateWav(path.join(soundsDir, 'ptt_start.wav'), [
  { freq: 1200, durationMs: 45 },
  { freq: 1600, durationMs: 55 }
]);

// PTT Stop roger beep: 880Hz 90ms
generateWav(path.join(soundsDir, 'ptt_stop.wav'), [
  { freq: 880, durationMs: 90 }
]);
