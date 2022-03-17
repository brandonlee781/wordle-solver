import { ref } from 'vue';
import { Guess, GuessStatus } from './useGuesses';
import wordList from '../word-list'

let checks: Set<string>[] = [
  new Set(),
  new Set(),
  new Set(),
  new Set(),
  new Set(),
]
let scoredWords: { [key: string]: number } = {}

const predictions = ref<[string, number][]>()

const findLetterStatus = (status: GuessStatus, previousGuesses: Guess[][]) => {
  const lets: string[] = []
  const prev = [...previousGuesses]
    .reduce((a, b) => a.concat(b), [])
  prev.forEach((g) =>{
    // check for multiples
    const dups = prev.filter(p => p.letter === g.letter).sort((a, b) => {
      const aStat = a.status || 0
      const bStat = b.status || 0
      return (bStat - aStat);
    })
    if (dups.length > 1 && dups[0].status === status) {
      lets.push(dups[0].letter)
    } else if (dups.length === 1 && dups[0].status === status) {
      lets.push(dups[0].letter)
    }
  })
  return Array.from(new Set(lets));
}

const letterScore = (pList: string[] = []) => {
  let list = pList.length ? pList : wordList
  list = list
    .join('')
    .split('')
  const letters: { [key: string]: number; } = list.reduce(
    (totals:{ [key: string]: number; }, letter: string) => {
      totals[letter] ? totals[letter]++ : totals[letter] = 1;
      return totals
    }, {}
  )
  return Object.keys(letters)
    .map((l): [string, number] => {
      return [l, (letters[l] / list.length)]
    })
    .reduce((a: {[key: string]: number}, b) => {
      a[b[0]] = b[1]
      return a
    },{})
}

const doubleLetterScore = () => {
  const list: string[] = wordList
  const letters: { [key: string]: number; } = {}
  for (let i = 0; i < wordList.length; i++) {
    const word = list[i];

    for (let j = 0; j < word.length; j++) {
      const letter = word[j];
      const foundCount = word.split('').filter(l => l === letter).length

      if (foundCount === 1) continue

      if (letters[letter]) {
        letters[letter] += (1 / foundCount)
      } else {
        letters[letter] = (1 / foundCount)
      }
    }
  }
  for (const lett in letters) {
    letters[lett] = Math.floor(letters[lett]) 
  }
  return letters;
}

const calculatePredictions = (previousGuesses: Guess[][], pWord?: string[], ) => {
  predictions.value = []
  const absentLetters = findLetterStatus(GuessStatus.absent, previousGuesses)
  const presentLetters = findLetterStatus(GuessStatus.present, previousGuesses)
  const allGuesses: string[] = previousGuesses.map(g => g.reduce((a, b) => a += b.letter, ''));
  let previous: Guess[];

  const list = Object.keys(scoredWords).length ? Object.keys(scoredWords) : wordList

  if (pWord) {
    previous = pWord.map(l => ({ letter: l, status: 1 }))
  } else {
    previous = previousGuesses[previousGuesses.length - 1]
  }

  const lettersScored = letterScore()
  for (let i = 0; i < list.length; i++) {
    const wordArray = list[i].split('');
    const word = wordArray.join('')
    if (!scoredWords[word]) {
      scoredWords[word] = 0;
    }
    
    let score = 0;
    for (let j = 0; j < wordArray.length; j++) {
      const scoreLetter = wordArray[j];
      const letterValue = lettersScored[scoreLetter]
      const {
        letter: guessLetter,
        status: guessStatus,
      } = previous[j];

      if (allGuesses.includes(word) || absentLetters.includes(scoreLetter)) {
        score = -(100 * letterValue)
      } else if (scoreLetter === guessLetter && guessStatus === GuessStatus.correct) {
        score += (5 * letterValue);
      }
      else if (
        presentLetters.includes(scoreLetter) && 
        new Set(wordArray).size !== wordArray.length
      ) {
        score += (0.35 * letterValue);
      }
      else if (presentLetters.includes(scoreLetter)) {
        // only give a point if the present letter is in the new word
        // and it's not in a place already checked
       
        if (!checks[j].has(scoreLetter)) {
          score += letterValue
          previous.forEach((p, ind) => {
            if (p.letter === scoreLetter) {
              checks[ind].add(scoreLetter)
            }
          })
        }
      }
    }
    if ((pWord && score >= 0) || (!pWord && score > 0)) {
      scoredWords[word] += score
    } else {
      delete scoredWords[word]
    }
    score = 0;
  }
  const findFirstDiff = (str1: string, str2: string): string[] => {
    const arr2 = str2.split('')
    return str1.split('').filter(l => !arr2.includes(l))
  }
  // sort scored words and give top score
  const scoredLetters = letterScore()
  const sortedWords = Object.keys(scoredWords)
    .filter(w => {
      const correctLetters = findLetterStatus(GuessStatus.correct, previousGuesses)
      const wordArr = w.split('')
      return presentLetters.every(l => wordArr.includes(l))
        && correctLetters.every(l => wordArr.includes(l))
    })
    .map((w: string): [string, number] => {
      const diff = findFirstDiff(w, previous.reduce((a, b) => a += b.letter, ''))
      let sc = scoredWords[w]
      diff.forEach(l => {
        if (sc >= 0) {
          sc += scoredLetters[l]
        }
      })
      return [w, sc]
    })
    .sort((a, b) => {
      return b[1] - a[1]
    })
  
  if (sortedWords.length) {
    predictions.value = sortedWords.slice(0, 5)
  } else if (!pWord) {
    const topLetters = Object.keys(scoredLetters)
      .map((letter): [string, number] => {
        return [letter, scoredLetters[letter]]
      })
      .sort((a, b) => {
        return b[1] - a[1]
      })
      .slice(0, 5)
      .map(l => l[0])
    calculatePredictions(previousGuesses, topLetters)
  }
}

export default function() {
  const reset = () => {
    predictions.value = []
    scoredWords = {}
    checks = [
      new Set(),
      new Set(),
      new Set(),
      new Set(),
      new Set(),
    ]
  }
  return {
    predictions,
    calculatePredictions,
    reset,
  }
}