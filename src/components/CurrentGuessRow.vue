<template>
  <div class="guess-row flex flex-row gap-1">
    <GuessBox
      v-for="ind in 5"
      :letter="currentGuess[ind - 1] && currentGuess[ind - 1].letter"
      :status="currentGuess[ind - 1] && currentGuess[ind - 1].status"
      type="current"
      :index="ind - 1"
      @click="toggleStatus(ind - 1)"
    />
  </div>
</template>

<script setup lang="ts">
import useGuesses, { Guess } from '../composables/useGuesses';
import GuessBox from './GuessBox.vue';

const props = defineProps()
const { currentGuess } = useGuesses()

const toggleStatus = (index: number) => {
  const guess = currentGuess.value[index];

  if (!guess) return

  if (!guess.status) {
    guess.status = 1
  } else if (guess.status === 2) {
    guess.status = 0
  } else {
    guess.status += 1
  }
}
</script>

<style scoped>
</style>
