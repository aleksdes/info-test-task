<script setup lang="ts">
import type { ScaffoldSlots } from './scaffold'

defineOptions({
  name: 'Scaffold',
})
defineSlots<ScaffoldSlots>()
</script>

<template>
  <div
    class="scaffold w-full overflow-hidden"
    :class="{
      'scaffold--with-sidebar': $slots.side,
    }"
  >
    <main class="scaffold__body-main flex-1 min-w-0 h-screen overflow-y-auto overflow-x-auto">
      <slot />
    </main>

    <slot name="side" />
  </div>
</template>

<style scoped lang="scss">
.scaffold {
  position: relative;
  min-height: 100dvh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: white;

  @media (min-width: 768px) {
    flex-direction: row-reverse;
  }

  &__side {
    box-sizing: border-box;
  }

  &__body-main {
    width: 100%;
  }
}
</style>
