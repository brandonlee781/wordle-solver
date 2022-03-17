<template>
  <div class="keyboard">
    <div class="flex pb-1">
      <KeyboardKey item="q" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="w" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="e" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="r" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="t" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="y" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="u" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="i" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="o" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="p" @click:item="(e: string) => $emit('update:letter', e)" />
    </div>
    <div class="flex pb-1">
      <KeyboardKey item="a" @click:item="(e: string) => $emit('update:letter', e)"/>
      <KeyboardKey item="s" @click:item="(e: string) => $emit('update:letter', e)"/>
      <KeyboardKey item="d" @click:item="(e: string) => $emit('update:letter', e)"/>
      <KeyboardKey item="f" @click:item="(e: string) => $emit('update:letter', e)"/>
      <KeyboardKey item="g" @click:item="(e: string) => $emit('update:letter', e)"/>
      <KeyboardKey item="h" @click:item="(e: string) => $emit('update:letter', e)"/>
      <KeyboardKey item="j" @click:item="(e: string) => $emit('update:letter', e)"/>
      <KeyboardKey item="k" @click:item="(e: string) => $emit('update:letter', e)"/>
      <KeyboardKey item="l" @click:item="(e: string) => $emit('update:letter', e)"/>
    </div>
    <div class="flex pb-1">
      <KeyboardKey large item="enter" @click:item="$emit('solve')" />
      <KeyboardKey item="z" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="x" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="c" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="v" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="b" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="n" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey item="m" @click:item="(e: string) => $emit('update:letter', e)" />
      <KeyboardKey large item="delete" icon @click:item="$emit('remove')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import KeyboardKey from './KeyboardKey.vue'
const emits = defineEmits<{
  (e: 'update:letter', item: string): string
  (e: 'solve'): void
  (e: 'remove'): void
}>()
</script>

<style scoped>
.keyboard {
  @apply flex flex-col items-center;
}
</style>
