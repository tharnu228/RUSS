import { Flex } from '@/shared/lib/Stack';
import { Fragment, memo, useContext } from 'react';
import { tabletMediaQueryWidth } from '@/shared/const/global';
import { useTrainerWords } from '../../../model/selectors/getTrainerWords/getTrainerWords';
import { TrainerPageContext } from '../../../model/context/TrainerPageContext';
import { TrainerWord } from '@/shared/ui/TrainerWord';
import { PrimaryWordsInterface } from '../../../model/types/primary';
import {
  wordActionsFunctionType,
  wordActionsFunctionExtendType,
} from '../../../lib/hooks/useWordActions';

import { renderHearts } from '../../TrainerWords/lib/renderHearts';

interface TrainerPrimaryWordsProps {
  randomWord: PrimaryWordsInterface;
  randomWordsIsReverse: boolean;
  wordOnSuccess: wordActionsFunctionType;
  wordOnFail: wordActionsFunctionExtendType;
  showHearts?: boolean;
}

export const TrainerPrimaryWords: React.FC<TrainerPrimaryWordsProps> = memo(
  ({
    randomWord,
    randomWordsIsReverse,
    wordOnFail,
    wordOnSuccess,
    showHearts = true,
  }): React.JSX.Element => {
    // Инициализация данных и контекста
    const storeWords = useTrainerWords();
    const { isIncorrect, isErrorWork, isOneLifeMode } =
      useContext(TrainerPageContext);

    // Функция для показа слова
    const printWord = (word: string): React.ReactNode => {
      return (
        <>
          {randomWord.differenceIndexes ? (
            <Flex>
              {word.split('').map((letter, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Fragment key={word + letter + index}>
                  {letter === ' ' ? (
                    <span style={{ width: 7 }}></span>
                  ) : (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={word + letter + index}
                      style={{
                        fontWeight:
                          randomWord.differenceIndexes &&
                          randomWord.differenceIndexes.includes(index + 1)
                            ? 'bold'
                            : 'normal',
                      }}
                    >
                      {letter}
                    </span>
                  )}
                </Fragment>
              ))}
            </Flex>
          ) : (
            word
          )}
        </>
      );
    };

    return (
      <>
        {showHearts && renderHearts(randomWord, isOneLifeMode)}
        {randomWord.valid && (
          <Flex
            justify="center"
            direction={
              tabletMediaQueryWidth.matches
                ? randomWordsIsReverse
                  ? 'columnReverse'
                  : 'column'
                : randomWordsIsReverse
                  ? 'rowReverse'
                  : 'row'
            }
            width="100"
          >
            <TrainerWord
              dataTestId="TrainerPrimaryWords__valid"
              onClick={() =>
                wordOnSuccess(storeWords, isErrorWork, randomWord.id)
              }
              style={{
                borderRightWidth: tabletMediaQueryWidth.matches
                  ? 3
                  : !randomWordsIsReverse && !isIncorrect
                    ? 0
                    : 3,

                borderBottomWidth: !tabletMediaQueryWidth.matches
                  ? 3
                  : !randomWordsIsReverse && !isIncorrect
                    ? 0
                    : 3,

                fontSize: randomWord.valid.length >= 10 ? 20 : 36,
              }}
            >
              {printWord(randomWord.valid)}
            </TrainerWord>

            <TrainerWord
              dataTestId="TrainerPrimaryWords__invalid"
              onClick={() =>
                wordOnFail(storeWords, isErrorWork, randomWord.id, 'primary')
              }
              type={isIncorrect ? 'invalid' : 'default'}
              style={{
                borderRightWidth: tabletMediaQueryWidth.matches
                  ? 3
                  : randomWordsIsReverse
                    ? 0
                    : 3,

                borderBottomWidth: !tabletMediaQueryWidth.matches
                  ? 3
                  : randomWordsIsReverse
                    ? 0
                    : 3,

                fontSize: randomWord.valid.length >= 10 ? 20 : 36,
              }}
            >
              {printWord(randomWord.invalid)}
            </TrainerWord>
          </Flex>
        )}
      </>
    );
  },
);

TrainerPrimaryWords.displayName = 'TrainerPrimaryWords';
