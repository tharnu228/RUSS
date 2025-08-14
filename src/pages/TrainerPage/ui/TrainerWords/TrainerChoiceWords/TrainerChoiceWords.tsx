import { memo, useCallback, useContext, useEffect, useMemo } from 'react';
import * as styles from './TrainerChoiceWords.module.scss';
import {
  ChoiceWordInterface,
  ChoiceWordsCategory,
} from '../../../model/types/choice';
import { Flex } from '@/shared/lib/Stack';
import { useTrainerWords } from '../../../model/selectors/getTrainerWords/getTrainerWords';
import { TrainerPageContext } from '../../../model/context/TrainerPageContext';
import { clearClassesOnWord } from './lib/clearClassesOnWord';
import { ChoiceWordOnClick } from './lib/choiceWordOnClick';
import {
  wordActionsFunctionType,
  wordActionsFunctionExtendType,
} from '../../../lib/hooks/useWordActions';

import { renderHearts } from '../../TrainerWords/lib/renderHearts';

export interface TrainerChoiceWordsProps {
  randomWord: ChoiceWordInterface;
  categories: ChoiceWordsCategory[];
  wordOnSuccess: wordActionsFunctionType;
  wordOnFail: wordActionsFunctionExtendType;
  showNewWord: wordActionsFunctionType;
  showHearts?: boolean;
}

export const TrainerChoiceWords: React.FC<TrainerChoiceWordsProps> = memo(
  ({
    randomWord,
    categories,
    wordOnFail,
    wordOnSuccess,
    showNewWord,
    showHearts = true,
  }): React.JSX.Element => {
    // Инициализация данных и контекста
    const storeWords = useTrainerWords();
    const { isErrorWork, isIncorrect, isOneLifeMode } =
      useContext(TrainerPageContext);

    // При новом слове производим очистку классов у слов
    useEffect(() => {
      clearClassesOnWord();
    }, [randomWord]);

    // Определение того, что тренажер без категорий
    const isWithoutCategory = useMemo(
      () => !categories.find((category) => category.category),
      [categories],
    );

    // Обработка клика на слово
    const handleChoiceWordClick = useCallback(
      (e: React.MouseEvent<HTMLSpanElement>, choiceWord: string) => {
        ChoiceWordOnClick(
          e,
          randomWord,
          choiceWord,
          wordOnSuccess,
          wordOnFail,
          isErrorWork,
          storeWords,
          showNewWord,
          isIncorrect,
        );
      },
      [
        randomWord,
        wordOnSuccess,
        wordOnFail,
        isErrorWork,
        storeWords,
        showNewWord,
        isIncorrect,
      ],
    );

    return (
      <Flex
        className={styles.TrainerChoiceWords}
        maxHeight
        width="100"
        direction="column"
        gap="20"
        justify="center"
      >
        {showHearts && renderHearts(randomWord, isOneLifeMode)}
        <span
          data-testid="TrainerChoiceWords_word"
          className={styles.TrainerChoiceWords__word}
        >
          {randomWord.word}
        </span>

        <Flex
          className={`
          ${styles.TrainerChoiceWords__choiceWordsWrapper}
          ${isWithoutCategory ? styles.TrainerChoiceWords__choiceWordsWrapper__withoutCategory : ''}
          `}
          width="100"
          justify="center"
          direction="column"
          gap="50"
        >
          {categories.map((category) => (
            <Flex
              justify={isWithoutCategory ? 'center' : 'start'}
              width="100"
              key={category.choiceWords.join('')}
            >
              {category.category && (
                <span className={styles.TrainerChoiceWords__category}>
                  {category.category}
                </span>
              )}

              <div className={styles.TrainerChoiceWords__choiceWords}>
                {category.choiceWords.map((choiceWord) => (
                  <span
                    onClick={(e) => handleChoiceWordClick(e, choiceWord)}
                    className={styles.TrainerChoiceWords__choiceWord}
                    key={choiceWord}
                    data-name="TrainerChoiceWords_choiceWord"
                    data-value={choiceWord}
                    data-testid="TrainerChoiceWords_choiceWord"
                  >
                    {choiceWord}
                  </span>
                ))}
              </div>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  },
);

TrainerChoiceWords.displayName = 'TrainerChoiceWords';
