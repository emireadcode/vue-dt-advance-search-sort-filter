<script setup lang="ts">
import AddSingleOrMultiplePaste from "./AddSingleOrMultiplePaste.vue";
import { inject } from "vue";

const props = defineProps<{
  index: any;
  open: boolean;
}>();

const emits = defineEmits<{
  (e: "close:open", action: boolean): void;
}>();

const cards = inject("cards") as any;
</script>

<template>
  <transition name="modal">
    <div
      class="position-fixed h-100 w-100 overflow-auto user-select-none"
      style="z-index: 1800"
    >
      <div class="modal-mask h-100 w-100 modal-mask-background-1">
        <div class="modal-wrapper text-center">
          <div class="modal-container" style="width: 480px">
            <div
              style="background-color: #fff; padding: 3px 10px"
              class="shadow-sm d-block"
            >
              <a
                class="underline-none cursor-pointer align-middle"
                @click="emits('close:open', false)"
              >
                <img
                  src="/src/assets/icons/close.png"
                  class="align-middle"
                  style="width: 24px; height: 24px"
                />
              </a>
            </div>
            <div class="d-block m-0" style="padding: 0 10px">
              <template v-if="!cards[index].concatenated">
                <div class="d-block" style="padding: 15px 0 10px 0">
                  <div class="d-block" style="padding-bottom: 5px">
                    <label class="text-lowercase">
                      Search By
                      <span class="font-bold">{{ cards[index].info.name }}</span>
                    </label>
                  </div>
                  <div class="d-block">
                    <input
                      type="text"
                      v-model="cards[index].search.single"
                      class="w-100 shadow-sm"
                      style="height: 30px"
                    />
                  </div>
                </div>
                <div class="d-block" style="padding: 10px 0">
                  <div class="d-block" style="padding-bottom: 5px">
                    <label class="text-lowercase align-middle">
                      include<span
                        class="font-bold"
                        style="padding-right: 4px; padding-left: 4px"
                        >{{ cards[index].info.name }}</span
                      >that
                    </label>
                  </div>
                  <div class="d-block" style="padding-bottom: 5px"></div>
                  <AddSingleOrMultiplePaste
                    nospace="false"
                    :index="index"
                    :tree="cards[index].search.include"
                    areatype="INCLUDE"
                  ></AddSingleOrMultiplePaste>
                </div>
                <div class="d-block" style="padding: 10px 0">
                  <div class="d-block" style="padding-bottom: 5px">
                    <label class="text-lowercase">
                      exclude<span
                        class="font-bold"
                        style="padding-left: 4px; padding-right: 4px"
                        >{{ cards[index].info.name }}</span
                      >that
                    </label>
                  </div>
                  <div class="d-block" style="padding-bottom: 5px"></div>
                  <AddSingleOrMultiplePaste
                    nospace="false"
                    :index="index"
                    :tree="cards[index].search.exclude"
                    areatype="EXCLUDE"
                  ></AddSingleOrMultiplePaste>
                </div>
              </template>
              <template v-else>
                <div class="d-block">
                  <template v-if="cards[index].concatenatedname !== undefined">
                    <div class="d-block" style="padding: 15px 0 10px 0">
                      <div class="d-block" style="padding-bottom: 5px">
                        <label class="text-lowercase">
                          Search by
                          <span class="font-bold">
                            {{ cards[index].concatenatedname }}
                          </span>
                        </label>
                      </div>
                      <AddSingleOrMultiplePaste
                        nospace="false"
                        :index="index"
                        :tree="cards[index].search"
                        areatype="ORDINARY"
                      ></AddSingleOrMultiplePaste>
                    </div>
                  </template>
                  <template v-for="(concatenated, cindex) in cards[index].concatenated">
                    <template v-if="!concatenated.aword">
                      <div class="d-block" style="padding: 10px 0">
                        <div class="d-block" style="padding-bottom: 5px">
                          <label class="text-lowercase">
                            Search By
                            <span class="font-bold">{{ concatenated.name }}</span>
                          </label>
                        </div>
                        <div class="d-block">
                          <input
                            type="text"
                            v-model="concatenated.search.single"
                            class="w-100 shadow-sm"
                            style="height: 30px"
                          />
                        </div>
                      </div>
                      <div class="d-block" style="padding: 10px 0">
                        <div class="d-block" style="padding-bottom: 5px">
                          <label class="text-lowercase align-middle">
                            include<span
                              class="font-bold"
                              style="padding-right: 4px; padding-left: 4px"
                              >{{ concatenated.name }}</span
                            >that
                          </label>
                        </div>
                        <div class="d-block" style="padding-bottom: 5px"></div>
                        <AddSingleOrMultiplePaste
                          nospace="false"
                          :index="index"
                          :tree="concatenated.search.include"
                          :areatype="'CONCATENATED-INCLUDE-' + cindex"
                        ></AddSingleOrMultiplePaste>
                      </div>
                      <div class="d-block" style="padding: 10px 0">
                        <div class="d-block" style="padding-bottom: 5px">
                          <label class="text-lowercase">
                            exclude<span
                              class="font-bold"
                              style="padding-right: 4px; padding-left: 4px"
                              >{{ concatenated.name }}</span
                            >that
                          </label>
                        </div>
                        <div class="d-block" style="padding-bottom: 5px"></div>
                        <AddSingleOrMultiplePaste
                          nospace="false"
                          :index="index"
                          :tree="concatenated.search.exclude"
                          :areatype="'CONCATENATED-EXCLUDE-' + cindex"
                        ></AddSingleOrMultiplePaste>
                      </div>
                    </template>
                    <template v-else>
                      <div class="d-block" style="padding: 10px 0">
                        <div class="d-block" style="padding-bottom: 5px">
                          <label class="text-lowercase"
                            >Search By
                            <span class="font-bold">{{ concatenated.name }}</span></label
                          >
                        </div>
                        <AddSingleOrMultiplePaste
                          nospace="false"
                          :index="index"
                          :tree="concatenated.search"
                          :areatype="'ORDINARY-' + cindex"
                        ></AddSingleOrMultiplePaste>
                      </div>
                    </template>
                  </template>
                </div>
              </template>
              <div class="d-block" style="padding: 15px 0">
                <button
                  class="btn w-100 shadow-sm"
                  style="padding: 7px; border-radius: 12px"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-mask-background-1 {
  background-color: rgba(0, 0, 0, 0.5);
}
.modal-mask-background-2 {
  background-color: rgba(255, 255, 255, 0.85);
}
.modal-mask {
  top: 0;
  left: 0;
  display: table;
  transition: opacity 0.3s ease;
}
.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-container {
  margin: 0px auto;
  background-color: #f8f8f8;
  border-radius: 2px;
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
.modal-enter,
.modal-leave-active {
  opacity: 0;
}
.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
