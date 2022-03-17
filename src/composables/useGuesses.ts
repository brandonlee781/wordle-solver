import { onMounted, ref, watch } from 'vue';
import validWords from '../valid-words'
import answerList from '../word-list'
import usePrediction from './usePrediction';

export enum GuessStatus {
  'absent',
  'present',
  'correct'
}

export type Guess = {
  letter: string
  status?: GuessStatus
}

type SavedGuesses = {
  guesses: Guess[][]
  time: number
}

const wordList = [...validWords, ...answerList].sort()

const previousGuesses = ref<Guess[][]>([])
const currentGuess = ref<Guess[]>([])
const correctAnswer = ref(false)
const gameOver = ref(false)

const checkWordList = () => wordList.includes(currentGuess.value.map(g => g.letter).join(''))

export default function useGuesses() {
  const { predictions, calculatePredictions, reset } = usePrediction()
  const addLetter = (letter: string) => {
    if (gameOver.value) return
    if (currentGuess.value.length < 5) {
      currentGuess.value?.push({ letter })
    }
  }
  const removeLetter = () => {
    if (gameOver.value) return
    if (currentGuess.value?.length) {
      currentGuess.value.pop()
    }
  }

  const checkGuess = () => {
    if (gameOver.value) return
    if (!checkWordList()) {
      alert('Not in word list')
      return
    }

    let correctPlaceCount = 0
    let isValid = true

    currentGuess.value.forEach(guess => {
      if (!guess.letter || guess.status === undefined) {
        isValid = false
      }
    })

    if (!isValid) {
      window.alert('You need to enter a word and set each letter state')
      return
    }
    previousGuesses.value = [
      ...previousGuesses.value,
      currentGuess.value
    ]
    currentGuess.value = []
    calculatePredictions(previousGuesses.value)
    if (correctPlaceCount === 5) {
      correctAnswer.value = true
      gameOver.value = true
    }

    if (correctPlaceCount !== 5 && previousGuesses.value.length === 6) {
      gameOver.value = true
    }
  }

  watch(previousGuesses, (guesses) => {
    if (!guesses.length) return
    const toSave: SavedGuesses = {
      guesses,
      time: new Date().getTime()
    }
    if (window.localStorage.getItem('wordle-previous') !== JSON.stringify(toSave)) {
      window.localStorage.setItem('wordle-previous', JSON.stringify(toSave))
    }
  })
  onMounted(() => {
    const today = new Date()
    const savedGuesses: SavedGuesses = JSON.parse(window.localStorage.getItem('wordle-previous') || '{}')
    if (savedGuesses?.guesses?.length) {
      if (today.getDate() === new Date(savedGuesses.time).getDate()) {
        previousGuesses.value = savedGuesses.guesses
      }
    }
  })

  const clearGuesses = () => {
    localStorage.removeItem('wordle-previous')
    previousGuesses.value = []
    currentGuess.value = []
    correctAnswer.value = false
    gameOver.value = false
    reset()
  }

  return {
    correctAnswer,
    gameOver,
    previousGuesses,
    currentGuess,
    addLetter,
    removeLetter,
    checkGuess,
    clearGuesses,
    predictions,

    wordList,
  }
}