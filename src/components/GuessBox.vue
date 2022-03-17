<template>
  <div
    class="guess-box"
    :data-animation="flip"
    :data-status="statusColor"
  >
    <span
      :class="{
        'guess-letter': true,
      }"
    >
      {{ letter }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import {  computed, nextTick, onMounted, ref, Ref } from 'vue';
  import { Guess, GuessStatus } from '../composables/useGuesses'
  interface Props {
    letter?: Guess["letter"],
    status?: Guess["status"],
    type: 'previous' | 'last' | 'current' | 'empty'
    index: number
  }
  const props = defineProps<Props>()
  const flip = ref<"idle" | "flipIn" | "flipOut">('idle')
  const statusColor = computed<"empty" | "absent" | "correct" | "present">(() => {
    switch(props.status) {
      case GuessStatus.absent:
        return 'absent'
      case GuessStatus.correct:
        return 'correct'
        break
      case GuessStatus.present:
        return 'present'
      default:
        return 'empty'
    }
  })


  onMounted(() => {
    if (props.letter) {
      setTimeout(() => {
        flip.value = 'flipIn'
        setTimeout(() => {
          flip.value = 'flipOut'
        }, 250)
      }, props.index * 150)

    }
  })
</script>

<style scoped>
.guess-box {
  @apply border-2 border-gray-700 h-[62px] w-[62px] flex items-center justify-center;
  user-select: none;
  transition: background-color 0.6s;
  &[data-status='present']{
    background-color: var(--bg-color-present);
  }
  &[data-status='correct'] {
    background-color: var(--bg-color-correct);
  }
  &[data-status='absent'] {
    background-color: var(--bg-color-absent);
  }

  .guess-letter {
    @apply text-3xl font-bold uppercase;
  }
}
.guess-box[data-animation='flipIn'] {
    animation-name: FlipIn;
    animation-duration: 250ms;
    animation-timing-function: ease-in;
  }
.guess-box[data-animation='flipOut'] {
  animation-name: FlipOut;
  animation-duration: 250ms;
  animation-timing-function: ease-in;
}

@keyframes FlipIn {
  0% {
    transform: rotateX(0);
  }
  100% {
    transform: rotateX(-90deg);
  }
}

@keyframes FlipOut {
  0% {
    transform: rotateX(-90deg);
  }
  100% {
    transform: rotateX(0);
  }
}
</style>

