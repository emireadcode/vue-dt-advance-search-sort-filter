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
                          @click="open = false"
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
                                <span class="font-bold">{{
                                  cards[index].info.name
                                }}</span>
                              </label>
                            </div>
                            <AddSingleOrMultiplePaste
                              nospace="true"
                              :index="index"
                              :tree="cards[index].search"
                              areatype="search"
                            ></AddSingleOrMultiplePaste>
                          </div>
                        </template>
                        <template v-else>
                          <div class="d-block">
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
                                nospace="true"
                                :index="index"
                                :tree="cards[index].search"
                                areatype="search"
                              ></AddSingleOrMultiplePaste>
                            </div>
                            <template
                              v-for="(concatenated, cindex) in cards[index].concatenated"
                            >
                              <div class="d-block" style="padding: 10px 0">
                                <div class="d-block" style="padding-bottom: 5px">
                                  <label class="text-lowercase"
                                    >Search By
                                    <span class="font-bold">{{
                                      concatenated.name
                                    }}</span></label
                                  >
                                </div>
                                <AddSingleOrMultiplePaste
                                  nospace="true"
                                  :index="index"
                                  :tree="concatenated.search"
                                  :areatype="'search-' + cindex"
                                ></AddSingleOrMultiplePaste>
                              </div>
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