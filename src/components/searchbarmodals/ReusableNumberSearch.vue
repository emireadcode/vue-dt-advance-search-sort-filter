<template>
  <div class="d-block" style="z-index: 8992;padding: 0 10px">
    <div class="d-block" style="padding: 0 0 15px 0">
      <div
        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-w-50" style="padding-right: 10px">
          <div class="d-block shadow-sm" style="padding: 5px">
            <div class="d-block" style="padding-bottom: 5px">
              <img
                src="/src/assets/icons/greater-than.png"
                class="align-middle"
                style="width: 24px; height: 24px"
              />
            </div>
            <div class="d-block">
              <input
                @keyup="resetOthers('GREATER-THAN')"
                @keydown.space.prevent
                v-model.trim="(numbersearcherui as NumberSearcherUIType).greaterthan.value"
                type="text"
                class="w-100 text-center"
                style="height: 30px"
              />
            </div>
                        </div>
                      </div>
                      <div class="flex-w-50" style="padding-left: 10px">
                        <div class="d-block shadow-sm" style="padding: 5px">
                          <div class="d-block" style="padding-bottom: 5px">
                            <img
                              src="/src/assets/icons/less-than.png"
                              class="align-middle"
                              style="width: 24px; height: 24px"
                            />
                          </div>
                          <div class="d-block">
                            <input
                              @keyup="resetOthers('LESS-THAN')"
                              @keydown.space.prevent
                              v-model.trim="(numbersearcherui as NumberSearcherUIType).lessthan.value"
                              type="text"
                              class="w-100 text-center"
                              style="height: 30px"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="d-block" style="padding: 0 0 15px 0">
                    <div
                      class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                    >
                      <div class="flex-w-50" style="padding-right: 10px">
                        <div class="d-block shadow-sm" style="padding: 5px">
                          <div class="d-block" style="padding-bottom: 5px">
                            <img
                              src="/src/assets/icons/equal-to.png"
                              class="align-middle"
                              style="width: 24px; height: 24px"
                            />
                          </div>
                          <div
                            class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                          >
                            <div class="flex-fill p-0 m-0 align-self-stretch" style="padding-right:2px;">
                              <input
                                @keyup="resetOthers('EQUAL-TO')"
                                @keydown.space.prevent
                                v-model.trim="(numbersearcherui as NumberSearcherUIType).equalto.value"
                                type="text"
                                class="w-100 text-center"
                                style="height: 30px; z-index: 1110"
                              />
                            </div>
                            <div
                              class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                              style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
                            >
                              <button
                                :disabled="equaltoAddNew ? false : true"
                                @click="
                                  increaseIndexAndSavePrevious(
                                    'NON-RANGE',
                                    (numbersearcherui as NumberSearcherUIType).equalto.value,
                                    'EQUAL-TO'
                                  )
                                "
                                class="btn w-100"
                                :style="
                                  equaltoAddNew
                                    ? 'background-color: #F0E68C;'
                                    : 'background-color:#eee;'
                                "
                                style="height:28px; padding:0 2px;"
                              >
                                <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                              </button>
                            </div>
                          </div>
                          <Paste
                            title="numbers"
                            :owner="cards[index].info.datatype as 'Date' | 'Year' | 'MultipleWordsString' | 'SingleWordString' | 'NumberString' | 'Number'"
                            :max="(cards[index].result.max as string)"
                            :min="(cards[index].result.min as string)"
                            :text-area-height="'height:450px;'"
                          >
                            <template v-slot:controlbuttons></template>
                            <template v-slot:outcomeidentifier>
                              <div
                                class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                              >
                                <div class="flex-fill text-center">
                                  <div
                                    class="d-inline-block align-middle"
                                    style="background-color: #fff; width: 15px; height: 15px"
                                  ></div>
                                  Pasted Lines
                                </div>
                                <div class="flex-fill text-center">
                                  <div
                                    class="d-inline-block align-middle"
                                    style="background-color: red; width: 15px; height: 15px"
                                  ></div>
                                  Invalid Numbers
                                </div>
                              </div>
                            </template>
                          </Paste>
                          <div
                            class="d-block overflow-y-auto overflow-x-hidden"
                            style="height: 180px; z-index: 1000"
                          >
                            <ul
                              class="d-block list-style-none m-0"
                              style="padding: 5px 0px"
                            >
                              <li
                                class="w-100"
                                v-for="(data, dindex) in (numbersearcherui as NumberSearcherUIType).treeequalto
                                  .value"
                                :key="'exc' + dindex"
                              >
                                <Transition>
                                  <div
                                    :ref="
                                      (el) => {
                                        (numbersearcherui as NumberSearcherUIType).refequalto[dindex] = el as HTMLDivElement;
                                      }
                                    "
                                    v-if="(numbersearcherui as NumberSearcherUIType).treeequalto.show[dindex]"
                                    class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                    style="padding: 1px 5px"
                                    :class="{ shake: (numbersearcherui as NumberSearcherUIType).treeequalto.disabled[dindex] }"
                                  >
                                    <div class="flex-shrink-0 flex-grow-0">
                                      <a
                                        @click="deleteSaved(dindex, 'EQUAL-TO')"
                                        class="remove-selected m-0 d-inline-block underline-none"
                                      >
                                        <img
                                          class="align-middle"
                                          src="/src/assets/icons/close.png"
                                          style="width: 25px; height: 25px"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      class="flex-fill"
                                      style="padding-left: 5px"
                                    >
                                      <div class="d-block" style="padding: 5px">
                                        <div
                                          :ref="
                                            (el) => {
                                              (numbersearcherui as NumberSearcherUIType).refequaltoinner[dindex] = el as HTMLDivElement;
                                            }
                                          "
                                          class="text-left d-block text-wrap text-break shadow-sm"
                                          style="border-radius: 20px;padding: 8px;z-index: 999;background-color:#fff;"
                                        >
                                          <label
                                            class="d-block align-middle letter-spacing"
                                            style="font-size: 0.875rem"
                                          >{{ data }}</label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Transition>
                              </li>
                              <li :ref="(el) => (numbersearcherui as NumberSearcherUIType).equaltoref = el as HTMLLIElement"></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="flex-w-50" style="padding-left: 10px">
                        <div class="d-block shadow-sm" style="padding: 5px">
                          <div class="d-block" style="padding-bottom: 5px">
                            <img
                              src="/src/assets/icons/not-equal-to.png"
                              class="align-middle"
                              style="width: 24px; height: 24px"
                            />
                          </div>
                          <div
                            class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                          >
                            <div class="flex-fill p-0 m-0 align-self-stretch" style="padding-right:2px;">
                              <input
                                @keyup="resetOthers('NOT-EQUAL-TO')"
                                @keydown.space.prevent
                                v-model.trim="(numbersearcherui as NumberSearcherUIType).notequalto.value"
                                type="text"
                                class="w-100 text-center"
                                style="height: 30px; z-index: 1110"
                              />
                            </div>
                            <div
                              class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                              style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
                            >
                              <button
                                :disabled="notequaltoAddNew ? false : true"
                                @click="
                                  increaseIndexAndSavePrevious(
                                    'NON-RANGE',
                                    (numbersearcherui as NumberSearcherUIType).notequalto.value,
                                    'NOT-EQUAL-TO'
                                  )
                                "
                                class="btn w-100 cursor-pointer"
                                :style="
                                  notequaltoAddNew
                                    ? 'background-color: #F0E68C;'
                                    : 'background-color:#eee;'
                                "
                                style="height:28px; padding:0 2px;"
                              >
                                <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                              </button>
                            </div>
                          </div>
                          <Paste
                            title="numbers"
                            :owner="cards[index].info.datatype as 'Date' | 'Year' | 'MultipleWordsString' | 'SingleWordString' | 'NumberString' | 'Number'"
                            :max="(cards[index].result.max as string)"
                            :min="(cards[index].result.min as string)"
                            :text-area-height="'height:450px;'"
                          >
                            <template v-slot:controlbuttons></template>
                            <template v-slot:outcomeidentifier>
                              <div
                                class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                              >
                                <div class="flex-fill text-center">
                                  <div
                                    class="d-inline-block align-middle"
                                    style="background-color: #fff; width: 15px; height: 15px"
                                  ></div>
                                  Pasted Lines
                                </div>
                                <div class="flex-fill text-center">
                                  <div
                                    class="d-inline-block align-middle"
                                    style="background-color: red; width: 15px; height: 15px"
                                  ></div>
                                  Invalid Numbers
                                </div>
                              </div>
                            </template>
                          </Paste>
                          <div
                            class="d-block overflow-y-auto overflow-x-hidden"
                            style="height: 180px; z-index: 1000"
                          >
                            <ul
                              class="d-block list-style-none m-0"
                              style="padding: 5px 0px"
                            >
                              <li
                                class="w-100"
                                v-for="(data, dindex) in (numbersearcherui as NumberSearcherUIType).treenotequalto.value"
                                :key="'exc' + dindex"
                              >
                                <Transition>
                                  <div
                                    :ref="
                                      (el) => {
                                        (numbersearcherui as NumberSearcherUIType).refnotequalto[dindex] = el as HTMLDivElement;
                                      }
                                    "
                                    v-if="(numbersearcherui as NumberSearcherUIType).treenotequalto.show[dindex]"
                                    class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                    style="padding: 1px 5px"
                                    :class="{
                                      shake: (numbersearcherui as NumberSearcherUIType).treenotequalto.disabled[dindex],
                                    }"
                                  >
                                    <div class="flex-shrink-0 flex-grow-0">
                                      <a
                                        @click="deleteSaved(dindex, 'NOT-EQUAL-TO')"
                                        class="remove-selected m-0 d-inline-block underline-none"
                                      >
                                        <img
                                          class="align-middle"
                                          src="/src/assets/icons/close.png"
                                          style="width: 25px; height: 25px"
                                        />
                                      </a>
                                    </div>
                                    <div
                                      class="flex-fill"
                                      style="padding-left: 5px"
                                    >
                                      <div class="d-block" style="padding: 5px">
                                        <div
                                          :ref="
                                            (el) => {
                                              (numbersearcherui as NumberSearcherUIType).refnotequaltoinner[dindex] = el as HTMLDivElement;
                                            }
                                          "
                                          class="text-left d-block text-wrap text-break shadow-sm"
                                          style="border-radius: 20px;padding: 8px;z-index: 999;background-color:#fff;"
                                        >
                                          <label
                                            class="d-block align-middle letter-spacing"
                                            style="font-size: 0.875rem"
                                          >
                                            {{ data }}
                                          </label>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Transition>
                              </li>
                              <li :ref="(el) => (numbersearcherui as NumberSearcherUIType).notequaltoref = el as HTMLLIElement"></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div 
                    style="padding: 5px 5px 20px 5px"
                    class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
                  >
                    <div class="flex-grow-1 flex-shrink-1">
                      <div class="d-block" style="padding-bottom: 5px">
                        <label>From</label>
                      </div>
                      <div class="d-block">
                        <input
                          @keydown.space.prevent
                          v-model.trim="(numbersearcherui as NumberSearcherUIType).from.value"
                          @keyup="resetOthers('FROM-TO')"
                          type="text"
                          class="w-100 text-center"
                          style="height: 30px"
                        />
                      </div>
                    </div>
                    <div class="flex-grow-1 flex-shrink-1">
                      <div class="d-block" style="padding-bottom: 5px">
                        <label>To</label>
                      </div>
                      <div class="d-block">
                        <input
                          @keydown.space.prevent
                          v-model.trim="(numbersearcherui as NumberSearcherUIType).to.value"
                          @keyup="resetOthers('FROM-TO')"
                          type="text"
                          class="w-100 text-center"
                          style="height: 30px"
                        />
                      </div>
                    </div>
                  </div>
                </div>
</template>