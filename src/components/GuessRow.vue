<template>
  <div class="guess-row flex flex-row gap-1">
    <GuessBox
      v-for="ind in 5"
      :letter="guesses[ind - 1] && guesses[ind - 1].letter"
      :status="guesses[ind - 1] && guesses[ind - 1].status"
      :type="type"
      :index="ind - 1"
      :key="`${type}-${ind}`"
    />
  </div>
</template>

<script setup lang="ts">
import { Guess } from '../composables/useGuesses';
import GuessBox from './GuessBox.vue';

const props = defineProps<{
  guesses: Guess[]
  type: 'previous' | 'last' | 'current' | 'empty'
}>()
</script>

<style scoped>
</style>
