import { TrainerWordsInterface } from '../../../model/types/types';
import * as styles from './renderHearts.module.scss';
import React from 'react';

// @ts-expect-error PNG modules are handled by the bundler
import heartEmptyImg from '@/shared/assets/hearts/heart-empty.png';
// @ts-expect-error PNG modules are handled by the bundler
import heartFilledImg from '@/shared/assets/hearts/heart-filled.png';
// @ts-expect-error PNG modules are handled by the bundler
import heartOneImg from '@/shared/assets/hearts/heart-one.png';

export interface HeartIcons {
  empty?: React.ReactNode;
  filled?: React.ReactNode;
}

const imgNode = (src: string, alt: string) => (
  <img src={src} alt={alt} className={styles.heartImg} draggable={false} />
);

const defaultEmptyNode = imgNode(heartEmptyImg, 'empty heart');
const defaultFilledNode = imgNode(heartFilledImg, 'filled heart');
const oneLifeNode = imgNode(heartOneImg, 'one life heart');

export const renderHearts = (
  randomWord: TrainerWordsInterface,
  isOneLifeMode: boolean,
  icons: HeartIcons = {},
) => {
  const uncorrectTimes = randomWord.uncorrectTimes ?? 0;
  const consecutivelyTimes = randomWord.consecutivelyTimes ?? 0;

  let empty = defaultEmptyNode;
  let filled = defaultFilledNode;

  // Спец. логика для режима одной жизни
  if (isOneLifeMode) {
    filled = oneLifeNode; // начальное состояние — особая картинка
    empty = defaultEmptyNode; // при ошибке — обычная пустая
  } else {
    // если передали кастомные иконки — используем их
    // @ts-expect-error PNG modules are handled by the bundler
    if (icons.empty) empty = icons.empty;
    // @ts-expect-error PNG modules are handled by the bundler
    if (icons.filled) filled = icons.filled;
  }

  const heartsCount: 1 | 3 = isOneLifeMode ? 1 : (uncorrectTimes > 0 ? 3 : 1);

  const filledCount =
    isOneLifeMode
      ? (uncorrectTimes === 0 ? 1 : 0) // одна жизнь: 1 — без ошибок, 0 — при ошибке
      : (randomWord.inProgress
          ? heartsCount
          : heartsCount === 3
            ? Math.min(consecutivelyTimes, heartsCount)
            : 0);

  return (
    <span className={styles.TrainerHearts}>
      {Array.from({ length: heartsCount }).map((_, index) => (
        <span
          key={index}
          className={`${styles.TrainerHearts__heart} ${
            index < filledCount ? styles.TrainerHearts__heart__filled : ''
          }`}
          aria-label={index < filledCount ? 'filled' : 'empty'}
        >
          {index < filledCount ? filled : empty}
        </span>
      ))}
    </span>
  );
};