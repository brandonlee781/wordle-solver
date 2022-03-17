<template>
  <div
    :class="{ 'keyboard-key': true, 'large': large }"
    :data-status="letterStatus"
    @click="$emit('click:item', item)"
  >
    <span v-if="!icon">{{ item.toUpperCase() }}</span>
    <svg v-else style="width:24px;height:24px" viewBox="0 0 24 24">
        <path fill="currentColor" d="M19,15.59L17.59,17L14,13.41L10.41,17L9,15.59L12.59,12L9,8.41L10.41,7L14,10.59L17.59,7L19,8.41L15.41,12L19,15.59M22,3A2,2 0 0,1 24,5V19A2,2 0 0,1 22,21H7C6.31,21 5.77,20.64 5.41,20.11L0,12L5.41,3.88C5.77,3.35 6.31,3 7,3H22M22,5H7L2.28,12L7,19H22V5Z" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useGuesses, { GuessStatus } from '../composables/useGuesses';
const props = defineProps({
  item: { type: String, default: null },
  icon: { type: Boolean, default: null },
  large: { type: Boolean, default: false }
})
const emits = defineEmits<{
  (e: 'click:item', item: string): string
}>()
const { previousGuesses } = useGuesses()
const letterStatus = computed(() => {
  const guesses = previousGuesses.value.reduce((a, b) => a.concat(b), [])
  const foundLetter = guesses
    .sort((a, b) => (b.status || 0) - (a.status || 0))
    .find(g => g.letter === props.item)
  if (foundLetter) {
    switch(foundLetter.status) {
      case GuessStatus.absent:
        return 'absent'
      case GuessStatus.correct:
        return 'correct'
      case GuessStatus.present:
        return 'present'
      default:
        return ''
    }
  }
  return ''
})
</script>

<style scoped>
.keyboard-key {
  @apply bg-gray-400 h-[58px] w-[43px] flex items-center justify-center text-sm font-semibold rounded-md cursor-pointer mr-1 select-none;

  &.large {
    @apply w-[64px];
  }
  &[data-status='present']{
    background-color: var(--bg-color-present);
  }
  &[data-status='correct'] {
    background-color: var(--bg-color-correct);
  }
  &[data-status='absent'] {
    background-color: var(--bg-color-absent);
  }
}
</style>
