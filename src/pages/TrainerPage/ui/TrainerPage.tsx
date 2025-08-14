import { Flex } from '@/shared/lib/Stack';
import { WordsForTrainersItem } from '../model/types/types';
import * as styles from './TrainerPage.module.scss';
import { DynamicModuleLoader } from '@/shared/lib/DynamicModuleLoader';
import { Hint } from '@/shared/ui/Hint';
import {
  memo,
  useState,
  useContext,
  useEffect,
  useMemo,
  Fragment,
  useRef,
  useLayoutEffect,
} from 'react';
import { Page } from '@/widgets/Page';
import { TrainerPageContext } from '../model/context/TrainerPageContext';
import { useTrainerWords } from '../model/selectors/getTrainerWords/getTrainerWords';
import { TrainerReducer } from '../model/slice/TrainerPageSlice';
import { TrainerTotalResult } from './TrainerTotalResult/TrainerTotalResult';
import { useRandomWord } from '../lib/hooks/useRandomWord';
import { useInitializeWords } from '../lib/hooks/useInitializeWords';
import { TrainerProgressBar } from './TrainerProgressBar/TrainerProgressBar';
import { TrainerModeSwitcher } from './TrainerModeSwitcher/TrainerModeSwitcher';
import { useArrowsActions } from '../lib/hooks/useArrowsActions';
import { useWordActions } from '../lib/hooks/useWordActions';
import { laptopMediaQueryWidth } from '@/shared/const/global';
import { generateTrainerWords } from '../config/generateTrainerWords';
import {
  addRefEventListener,
  deleteRefEventListener,
} from '@/shared/utils/eventListeners';
import { checkTrainerRender } from '../model/selectors/checkTrainerIsRender/checkTrainerIsRender';

export interface TrainerPageProps {
  words: WordsForTrainersItem;
  theme: string;
}

const TrainerInner: React.FC<TrainerPageProps> = memo(
  ({ words, theme }): React.JSX.Element => {
    // Инициализация данных, хуков, контекста
    const [randomWordId, setRandomWordId] = useState<number | null>(null);

    const [randomWordsIsReverse, setRandomWordsIsReverse] =
      useState<boolean>(false);

    const { randomWord, updateRandomWord } = useRandomWord(
      randomWordId,
      setRandomWordsIsReverse,
      setRandomWordId,
    );

    const {
      totalTime,
      setIsIncorrect,
      isIncorrect,
      setIsErrorWork,
      setTotalTime,
    } = useContext(TrainerPageContext);

    useEffect(() => {
      if (!randomWord) setRandomWordId(0);
    }, [randomWord, randomWordId]);

    // Появление плашки "Неверно"
    const { wordOnFail, wordOnSuccess, showNewWord } = useWordActions(
      randomWordId,
      setRandomWordsIsReverse,
      setRandomWordId,
      setIsIncorrect,
    );

    // Получение случайного слова
    const storeWords = useTrainerWords();

    useEffect(() => {
      if (storeWords.length && randomWordId === null) {
        updateRandomWord();
      }
    }, [randomWordId, storeWords, updateRandomWord]);

    // При нажатии на стрелочки, фокус падает на соответствующее слово
    const { checkArrowsPress } = useArrowsActions(
      randomWordId,
      setRandomWordId,
      setRandomWordsIsReverse,
      setIsIncorrect,
      randomWordsIsReverse,
    );

    const keydownEventListenerRef = useRef<((e: KeyboardEvent) => void) | null>(
      null,
    );

    useEffect(() => {
      if (!['primary', 'views'].includes(words.type)) return;

      addRefEventListener(
        keydownEventListenerRef,
        'keydown',
        (e: KeyboardEvent) => checkArrowsPress(e, words),
      );

      return () => {
        deleteRefEventListener(keydownEventListenerRef, 'keydown');
      };
    }, [checkArrowsPress, words]);

    // Инициализация слов
    const { initializeWords } = useInitializeWords(words.items);

    const isTrainerRender = checkTrainerRender();

    useLayoutEffect(() => {
      if (!isTrainerRender) return;

      setIsIncorrect(false);
      setIsErrorWork(false);
      setTotalTime(0);
      initializeWords();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [theme, isTrainerRender]);

    // Определение, нужно ли использовать maxHeight
    const withoutMaxHeight = useMemo(
      () => words.type === 'choice' && laptopMediaQueryWidth.matches,
      [words.type],
    );

    return (
      <Page className={styles.TrainerPage} withMaxHeight={!withoutMaxHeight}>
        {storeWords.length > 0 && (
          <>
            {!totalTime ? (
              <>
                {words.type === 'primary' && (
                  <Flex width="100">
                    <Hint
                      text={`Выбирайте ответ, а система будет предлагать новые слова или
                    те, в которых были допущены ошибки. Когда вы перестанете их
                    допускать, шкала полностью заполнится. Заполните шкалу
                    несколько раз, сделайте работу над ошибками - и вы готовы.`}
                      textClassName={styles.TrainerPage__hint}
                    />
                  </Flex>
                )}

                {theme === 'Виды союзов' && (
                  <Flex width="100">
                    <Hint
                      text={`В этом тренажере под подчинительным союзом понимается любое
                    средство подчинительной связи, т.е. союз, союзное слово,
                    частица`}
                      textClassName={styles.TrainerPage__hint}
                    />
                  </Flex>
                )}

                {theme === 'Звуки' && (
                  <Flex width="100">
                    <Hint
                      text={`Помните, что глухие согласные произносятся без участия голоса, 
                    а звонкие - с участием голоса. Чтобы проверить, приложите руку 
                    к горлу: если вы чувствуете вибрацию - согласный звонкий, 
                    если нет - глухой.`}
                      textClassName={styles.TrainerPage__hint}
                    />
                  </Flex>
                )}

                {isIncorrect && (
                  <Flex
                    className={styles.TrainerPage__uncorrect}
                    data-testid="Trainer__uncorrect"
                    justify="center"
                  >
                    Неверно
                  </Flex>
                )}

                {randomWord && (
                  <>
                    {Object.entries(
                      generateTrainerWords(
                        randomWord,
                        randomWordsIsReverse,
                        wordOnFail,
                        wordOnSuccess,
                        words,
                        showNewWord,
                        theme,
                      ),
                    ).map(([type, element]) => (
                      <Fragment key={type}>
                        {words.type === type && element}
                      </Fragment>
                    ))}
                  </>
                )}

                <TrainerProgressBar />
                <TrainerModeSwitcher />
              </>
            ) : (
              <TrainerTotalResult
                words={words}
                updateRandomWord={updateRandomWord}
                theme={theme}
                type={words.type}
              />
            )}
          </>
        )}
      </Page>
    );
  },
);

TrainerInner.displayName = 'TrainerInner';

export const TrainerPage: React.FC<TrainerPageProps> = memo(
  ({ words, theme }): React.JSX.Element => {
    // Настройка контекста
    const [totalTime, setTotalTime] = useState<number>(0);
    const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
    const [isErrorWork, setIsErrorWork] = useState<boolean>(false);
    const [isOneLifeMode, setIsOneLifeMode] = useState<boolean>(false);
    const [isCheckMode, setIsCheckMode] = useState<boolean>(false);
    const [allAttemptsCount, setAllAttemptsCount] = useState<number>(0);

    return (
      <TrainerPageContext.Provider
        value={{
          totalTime,
          setTotalTime,
          isIncorrect,
          setIsIncorrect,
          isErrorWork,
          setIsErrorWork,
          isOneLifeMode,
          setIsOneLifeMode,
          isCheckMode,
          setIsCheckMode,
          allAttemptsCount,
          setAllAttemptsCount,
        }}
      >
        <DynamicModuleLoader
          removeAfterUnmount={false}
          reducers={{ Trainer: TrainerReducer }}
        >
          <TrainerInner words={words} theme={theme} />
        </DynamicModuleLoader>
      </TrainerPageContext.Provider>
    );
  },
);

TrainerPage.displayName = 'TrainerPage';
