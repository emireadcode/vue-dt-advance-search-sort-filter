<template>
  <div
    class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
  >
    <div class="flex-fill p-0 m-0 align-self-stretch">
      <template v-if="nospace === 'false'">
        <input
          ref="newitementryinputref"
          @keypress.enter="addNewIncludeOrExclude()"
          maxlength="40"
          type="text"
          v-model="tree.single"
          class="w-100"
          style="height: 30px; padding-right: 1.75rem"
        />
      </template>
      <template v-else>
        <input
          ref="newitementryinputref"
          @keydown.space.prevent
          @keypress.enter="addNewIncludeOrExclude()"
          maxlength="40"
          type="text"
          v-model="tree.single"
          class="w-100"
          style="height: 30px; padding-right: 1.75rem"
        />
      </template>
    </div>
    <div
      class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
      style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
    >
      <a
        class="cursor-pointer d-block text-center"
        style="padding: 3px 0"
        @click="addNewIncludeOrExclude()"
      >
        <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
      </a>
    </div>
  </div>
</template>