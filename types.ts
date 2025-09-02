
export enum AppStatus {
  IDLE,
  RECORDING,
  PROCESSING,
  SUCCESS,
  ERROR,
}

export interface AudioData {
  base64: string;
  mimeType: string;
  fileName: string;
}
