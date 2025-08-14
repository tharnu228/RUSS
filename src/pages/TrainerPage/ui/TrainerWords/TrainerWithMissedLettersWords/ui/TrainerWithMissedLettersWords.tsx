import { Flex } from '@/shared/lib/Stack';
import {
  wordActionsFunctionType,
  wordActionsFunctionExtendType,
} from '../../../../lib/hooks/useWordActions';
import { WithMissedLettersWordsInterface } from '../../../../model/types/withMissedLetters';
import * as styles from './TrainerWithMissedLettersWords.module.scss';
import { Fragment, memo, useContext, useEffect } from 'react';
import { Button } from '@/shared/ui/Button';
import { renderLetter } from '../lib/renderLetter';
import { onContinueHandler } from '../lib/onContinueHandler';
import { continueOnKeyDown } from '../lib/continueOnKeyDown';
import { MissedLetterInputContext } from '@/shared/ui/MissedLetterInput';
import { useTrainerWords } from '../../../../model/selectors/getTrainerWords/getTrainerWords';
import { TrainerPageContext } from '../../../../model/context/TrainerPageContext';
import { renderCorrectWord } from '../lib/renderCorrectWord';
import { renderHearts } from '../../../TrainerWords/lib/renderHearts';

export interface TrainerWithMissedLettersWordsProps {
  randomWord: WithMissedLettersWordsInterface;
  wordOnSuccess: wordActionsFunctionType;
  wordOnFail: wordActionsFunctionExtendType;
  showHearts?: boolean;
}

export const TrainerWithMissedLettersWords: React.FC<TrainerWithMissedLettersWordsProps> =
  memo(({ randomWord, wordOnSuccess, wordOnFail, showHearts = true }): React.JSX.Element => {
    // Получаем данные из контекстов
    const { incorrectInputsIDs, setIncorrectInputsIDs } = useContext(
      MissedLetterInputContext,
    );
    const { isErrorWork, isIncorrect, setIsIncorrect, isOneLifeMode } =
      useContext(TrainerPageContext);

    // Получаем данные из хранилища
    const storeWords = useTrainerWords();

    // Добавляем обработчик нажатия клавиши Enter
    useEffect(() => {
      document.addEventListener('keydown', continueOnKeyDown);

      return () => {
        document.removeEventListener('keydown', continueOnKeyDown);
      };
    }, []);

    // При изменении randomWord, обнуляем данные
    useEffect(() => {
      setIncorrectInputsIDs([]);

      // Проходимся по всем инпутам и удаляем значение
      const TrainerWithMissedLettersInputs =
        document.querySelectorAll<HTMLInputElement>(
          '[data-name="TrainerWithMissedLetters__input"',
        );

      for (const input of TrainerWithMissedLettersInputs) {
        input.value = '';
      }
    }, [randomWord, setIncorrectInputsIDs]);

    return (
      <Flex width="100" maxHeight justify="center" direction="column" gap="50">
        <Flex direction="column">
          {showHearts && renderHearts(randomWord, isOneLifeMode)}
          <span
            className={styles.TrainerWithMissedLettersWords__letter__medium}
          >
            {randomWord.word.split('').map((letter, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={index}>
                {renderLetter(
                  letter,
                  index + 1,
                  randomWord.missedLettersIndexes,
                  incorrectInputsIDs,
                )}
              </Fragment>
            ))}
          </span>

          {isIncorrect && renderCorrectWord(randomWord)}
        </Flex>

        <Button
          onClick={() =>
            onContinueHandler({
              randomWord,
              setIncorrectInputsIDs,
              wordOnSuccess,
              wordOnFail,
              storeWords,
              isErrorWork,
              setIsIncorrect,
            })
          }
          size="big"
          variant="inverse"
          id="TrainerWithMissedLettersWords__continueButton"
          data-testid="TrainerWithMissedLettersWords__continueButton"
        >
          Далее
        </Button>
      </Flex>
    );
  });

TrainerWithMissedLettersWords.displayName = 'TrainerWithMissedLettersWords';
