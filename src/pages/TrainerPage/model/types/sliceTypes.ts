import { WordsForTrainersTypes } from './types';

export interface TrainerPageSliceSchema {
  words: WordsForTrainersTypes[];
}

export interface changeWordProbabilityPayload {
  id: number;
  probability: number;
}

export interface changeWordUncorrectTimesPayload {
  id: number;
  uncorrectTimes: number;
}

export interface changeWordConsecutivelyTimesPayload {
  id: number;
  consecutivelyTimes: number;
}

export interface changeWordInProgressStatusPayload {
  id: number;
  inProgress: boolean;
}

export interface deleteWordPayload {
  id: number;
}