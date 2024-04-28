export interface Channel {
    playing: boolean;
    output: number;
    onWriteAudio(time: number): void;
}