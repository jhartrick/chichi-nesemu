export interface LocalAudioSettings {
	sampleRate: number;
	mute: () => Promise<void>;
	unmute: () => Promise<void>;
	stop();
}