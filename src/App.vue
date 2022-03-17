<script setup lang="ts">
import Keyboard from './components/Keyboard.vue'
import GuessGrid from './components/GuessGrid.vue'
import useGuesses from './composables/useGuesses'
import { onMounted, ref } from 'vue'
import wordList from './word-list'

const {
  addLetter,
  removeLetter,
  checkGuess,
  gameOver,
  clearGuesses,
  predictions,
} = useGuesses()
const answer = ref('')

// const getNewAnswer = () => {
//   const rand = Math.floor(Math.random() * (wordList.length + 1))
//   const word = wordList[rand]
//   localStorage.setItem('wordle-answer', JSON.stringify({ answer: word, time: new Date().getTime() }))
//   return word
// }

// onMounted(() => {
//   const savedAnswer = JSON.parse(localStorage.getItem('wordle-answer') || '{}')
//   if (!savedAnswer.answer || new Date(savedAnswer.time).getDate() !== new Date().getDate()) {
//     answer.value = getNewAnswer()
//   } else {
//     answer.value = savedAnswer.answer
//   }
// })

const startOver = () => {
  localStorage.removeItem('wordle-answer')
  clearGuesses()
}

document.addEventListener('keydown', (e) => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    addLetter(e.key)
  }
  if (e.code === 'Backspace') {
    removeLetter()
  }
  if (e.code === 'Enter') {
    checkGuess()
  }
})

</script>

<template>
  <div class="game">
    <h1 class="text-3xl font-bold uppercase border-b pb-1 title-bar">
      <span class="game-name">Wordle Solver</span>
      <button @click="startOver">
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path fill="currentColor" d="M2 12C2 16.97 6.03 21 11 21C13.39 21 15.68 20.06 17.4 18.4L15.9 16.9C14.63 18.25 12.86 19 11 19C4.76 19 1.64 11.46 6.05 7.05C10.46 2.64 18 5.77 18 12H15L19 16H19.1L23 12H20C20 7.03 15.97 3 11 3C6.03 3 2 7.03 2 12Z" />
        </svg>
      </button>
    </h1>
    <div>
      <h2>Guesses</h2>
      <div v-for="(guess, ind) in predictions" :key="ind">
        {{ guess[0] }}: {{ guess[1] }}
      </div>
    </div>
    <GuessGrid />
    <Keyboard
      @update:letter="letter => addLetter(letter)"
      @remove="() => removeLetter()"
      @solve="() => checkGuess()"
    />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100vh;
  padding: 1rem;
}
.game {
  width: 500px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
}
.title-bar {
  display: grid;
  grid-template-columns: 24px 1fr 24px;
}

.game-name {
  grid-column: 2 / span 1;
}
</style>
