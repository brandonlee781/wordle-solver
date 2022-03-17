<template>
  <div class="guess-grid flex flex-col gap-1">
    <template v-for="(guesses, index) in previousGuesses">
      <GuessRow 
        :type="index === previousGuesses.length ? 'last' : 'previous'"
        :guesses="guesses"
      />
    </template>
    
    <CurrentGuessRow v-if="!gameOver" />

    <template v-for="guesses in emptyRows">
      <GuessRow type="empty" :guesses="[]" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import useGuesses, { GuessStatus } from '../composables/useGuesses'
import GuessRow from './GuessRow.vue';
import CurrentGuessRow from './CurrentGuessRow.vue'
const {
  previousGuesses,
  currentGuess,
  gameOver
} = useGuesses()

const guesses = computed(() => {
  const arr = new Array(6)
  const count = previousGuesses.value?.length || 0
  previousGuesses.value.forEach((guess, index) => {
    arr[index] = guess
  })
  arr[count] = currentGuess.value

  arr.fill(
    [],
    count + 1
  )

  return arr
})
const emptyRows = computed(() => {
  if (gameOver.value) return 6 - previousGuesses.value.length;
  let count = 6
  count -= previousGuesses.value.length
  // Remove currentGuess
  count -= 1
  return count >= 0 ? count : -1
})

watch(previousGuesses, (oldGuess, newGuess) => {
  if (oldGuess.length < newGuess.length) {
    
  }
})
</script>

<style scoped>
.guess-grid {
  width: 330px;
  margin: 0 auto;
}


.flip-card {
  background-color: transparent;
  width: 300px;
  height: 200px;
  border: 1px solid #f1f1f1;
  perspective: 1000px; /* Remove this if you don't want the 3D effect */
}

/* This container is needed to position the front and back side */
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
}

/* Do an horizontal flip when you move the mouse over the flip box container */
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* Position the front and back side */
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden; /* Safari */
  backface-visibility: hidden;
}

/* Style the front side (fallback if image is missing) */
.flip-card-front {
  background-color: #bbb;
  color: black;
}

/* Style the back side */
.flip-card-back {
  background-color: dodgerblue;
  color: white;
  transform: rotateX(180deg);
}
</style>
