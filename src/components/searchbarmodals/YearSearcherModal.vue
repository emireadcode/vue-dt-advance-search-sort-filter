<template>
  <transition name="modal">
    <div
      class="position-fixed h-100 w-100 overflow-auto user-select-none"
      style="z-index: 1800"
    >
      <div class="modal-mask h-100 w-100">
        <div class="modal-wrapper text-center">
          <div class="modal-container d-block">
            <div class="d-block">
              <div
                style="background-color: #fff; padding: 3px 10px"
                class="shadow-sm d-block"
              >
                <a
                  class="underline-none cursor-pointer align-middle"
                  @click="open = false"
                >
                  <img
                    src="/src/assets/icons/close.png"
                    class="align-middle"
                    style="width: 24px; height: 24px"
                  />
                </a>
              </div>
              <div
                class="d-block text-center"
                style="padding: 7px; font-size: 0.6rem"
              >
                {{ cards[index].info.name }}
              </div>
            </div>
            <div class="d-block m-0" style="padding: 0 10px"></div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>