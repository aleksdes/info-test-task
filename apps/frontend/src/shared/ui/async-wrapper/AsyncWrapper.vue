<script setup lang="ts">
import type { AsyncWrapperEmits, AsyncWrapperProps, AsyncWrapperSlots } from './async-wrapper'
import { whenever } from '@vueuse/core'
import ProgressSpinner from 'primevue/progressspinner'
import { computed, ref, toRefs, watch } from 'vue'

const props = withDefaults(defineProps<AsyncWrapperProps>(), {
  disableUpdatingAnimation: false,
  isErrorFixed: false,
  isLoadingFixed: false,
  isUpdatingFixed: false,
  disableShowErrorPopup: false,
  spinnerColor: '#313037',
})
const emits = defineEmits<AsyncWrapperEmits>()
defineSlots<AsyncWrapperSlots>()

const {
  isLoading,
  isUpdating,
  noData,
  error,
  disableUpdatingAnimation,
  disableShowErrorPopup,
  spinnerColor,
} = toRefs(props)

const _isErrorShown = ref(false)
let timeout: any

function queueHide() {
  timeout = setTimeout(() => {
    _isErrorShown.value = false
    emits('closeError')
  }, 5000)
}

function unQueueHide() {
  clearTimeout(timeout)
}

function revealError() {
  unQueueHide()
  _isErrorShown.value = true
  queueHide()
}

function hideError() {
  _isErrorShown.value = false
  emits('closeError')
}

function onLoading(loading: boolean) {
  if (loading) {
    if (_isErrorShown.value)
      hideError()
  }
  else if (error.value) {
    revealError()
  }
}

whenever(error, revealError, { once: false })
watch(isLoading, onLoading)

const loadingStateShouldReveal = computed(
  () => !isUpdating.value && isLoading.value,
)
const updatingStateShouldReveal = computed(() => isUpdating.value)
const errorShouldReveal = computed(() => {
  return error.value && _isErrorShown.value && !disableShowErrorPopup.value
})
</script>

<template>
  <div
    class="async-wrapper"
  >
    <div v-if="loadingStateShouldReveal" class="async-wrapper__loading" :class="[{ 'async-wrapper__loading--fixed': isLoadingFixed }]">
      <slot name="loading">
        <div class="async-wrapper__loading-slug">
          <ProgressSpinner class="async-wrapper__loading-indicator" />
          <div v-if="loadingLabel" class="async-wrapper__loading-text">
            {{ loadingLabel }}
          </div>
        </div>
      </slot>
    </div>

    <div v-else-if="noData" class="async-wrapper__no-data">
      <slot name="noData" />
    </div>

    <div v-else class="async-wrapper__content">
      <!-- Оверлей индикатора обновления -->
      <!-- Оверлей и сам индикатор разделены для разных анимаций -->
      <Transition
        name="async-wrapper__cross-blur-transition"
        :css="!disableUpdatingAnimation"
      >
        <div
          v-show="updatingStateShouldReveal"
          class="async-wrapper__overlay"
        />
      </Transition>
      <Transition
        name="async-wrapper__cross-blur-transition"
        :css="!disableUpdatingAnimation"
      >
        <div
          v-if="updatingStateShouldReveal"
          class="async-wrapper__updating"
          :class="[
            { 'async-wrapper__updating--fixed': isUpdatingFixed },
          ]"
        >
          <slot name="loading">
            <div class="async-wrapper__loading-slug">
              <ProgressSpinner
                class="async-wrapper__loading-indicator"
              />
              <div v-if="loadingLabel" class="async-wrapper__loading-text">
                {{ loadingLabel }}
              </div>
            </div>
          </slot>
        </div>
      </Transition>
      <!-- END: Оверлей индикатора обновления -->

      <slot />
    </div>

    <Transition
      name="async-wrapper__cross-fade-transition"
      appear
    >
      <div
        v-if="errorShouldReveal"
        class="async-wrapper__error"
        :class="[
          { 'async-wrapper__error--fixed': isErrorFixed },
        ]"
        @mouseover="unQueueHide"
        @mouseout="queueHide"
      >
        <div class="async-wrapper__error-caption">
          это уведомление исчезнет через 5 секунд
          <a
            class="async-wrapper__close-error"
            role="button"
            @click="hideError"
          >
            закрыть сейчас
          </a>
        </div>
        <div class="async-wrapper__error-description">
          <slot name="error">
            <div class="async-wrapper__text">
              Ошибка: "{{ error }}"
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.async-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  &--hidden-overflow {
    overflow: hidden;
  }

  &__cross-blur-transition {
    @include crossBlurTransition();
  }
  &__cross-fade-transition {
    @include crossFadeTransition(350ms);
  }

  &__content {
    position: relative;
    overflow: hidden;
    height: -webkit-fill-available;
  }

  &__loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    flex: 1;

    &--fixed {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
    }
  }

  &__updating {
    position: absolute;
    z-index: 4;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    &--fixed {
      position: fixed;
    }
  }

  &__loading-indicator {
    width: 70px;
    height: 70px;

    :deep(circle) {
      stroke: v-bind(spinnerColor);
      stroke-width: 4px;
    }
  }

  &__loading-slug {
    flex-direction: column;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    gap: 8px;
    padding: 24px 24px 24px 24px;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    max-width: 250px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    user-select: none;
  }

  &__overlay {
    position: absolute;
    z-index: 4;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background-color: var(--async-wrapper__bg-overlay, rgba(white, 0.7));
  }

  &__error {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    z-index: 3;
    padding: 12px 24px 24px 24px;
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    max-width: 250px;
    text-align: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    user-select: none;

    &--fixed {
      position: fixed;
    }
  }
  &__error-description {
    font-weight: bold;
    color: rgba(0, 0, 0, 0.5);
    margin-bottom: 12px;
  }
  &__error-caption {
    font-family: $font-family-roboto;
    color: rgba(0, 0, 0, 0.3);
    font-size: 12px;
    font-weight: 400;
    line-height: 1.2;
    margin-bottom: 12px;
  }
  &__close-error {
    padding: 2px 8px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: inline-block;
    @include acceleratedTransition((background-color, transform));

    &:hover {
      background-color: rgba(0, 0, 0, 0.15);
    }
    &:active {
      transform: scale(0.95);
    }
  }
}
</style>
