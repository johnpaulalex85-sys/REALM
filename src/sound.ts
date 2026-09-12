// Web Audio API RPG sound effects synthesizer

class SoundManager {
  private ctx: AudioContext | null = null;
  public soundEnabled: boolean = true;

  private getContext(): AudioContext | null {
    if (!this.soundEnabled) return null;
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  public playQuestProgress(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [440, 554.37, 659.25].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.07, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.13);
      });
    } catch {}
  }

  public playQuestComplete(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Arpeggio in D major / magical chime
      const notes = [587.33, 739.99, 880.00, 1174.66];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.1, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.38);
      });
    } catch {}
  }

  public playLevelUp(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      // Fanfare chord
      const chords = [
        [523.25, 659.25, 783.99], // C
        [587.33, 739.99, 880.00], // D
        [659.25, 830.61, 987.77], // E
        [1046.50, 1318.51, 1567.98] // C high octave victory
      ];
      chords.forEach((chord, step) => {
        chord.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + step * 0.14);
          gain.gain.setValueAtTime(0.08, now + step * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, now + step * 0.14 + (step === 3 ? 0.8 : 0.25));
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + step * 0.14);
          osc.stop(now + step * 0.14 + (step === 3 ? 0.85 : 0.28));
        });
      });
    } catch {}
  }

  public playCelebration(): void {
    this.playLevelUp();
  }

  public playAchievementUnlock(): void {
    this.playQuestComplete();
  }
}

export const soundFx = new SoundManager();
