<script setup lang="ts">

function pasteMultilineWordsCopiedFromSomewhere(e: any) {
  pastetextarearef.value.maxLength = 5000;
  actualpastedincludedata = handlePaste(e);
  let pastelengthresizetimer: NodeJS.Timeout;
  pastelengthresizetimer = setTimeout(() => {
    pastetextarearef.value.maxLength = 0;
    clearTimeout(pastelengthresizetimer);
  }, 10);
}
function addPasted() {
  let done = false,
    tt3: NodeJS.Timeout[] = [],
    tt3Index = 0;
  for (let i = 0; i < pasteditemvalidity.value.length; i++) {
    let item = pasteditemvalidity.value[i];
    if (item[1] !== "ERROR") {
      if (item[0].trim() !== "") {
        let increment = true;
        if (props.tree.value.length === 0) {
          increment = true;
        } else {
          if (current.value !== 0) {
            current.value = 0;
            props.tree.value = pages.value[0];
            nextTick(() => triggerRef(cards));
          }
          for (let i = 0; i < props.tree.value.length; i++) {
            if (props.tree.value[i] === item[0]) {
              increment = false;
              if (pasteditemsref.value[i] !== undefined && pasteditemsref.value[i] !== null) {
                pasteditemsref.value[i].style.backgroundColor = "red";
                pasteditemsref.value[i].style.color = "#fff";
                tt3[tt3Index] = setTimeout(() => {
                  if (pasteditemsref.value[i].style.backgroundColor !== "#fff") {
                    pasteditemsref.value[i].style.backgroundColor = "#fff";
                    pasteditemsref.value[i].style.color = "black";
                    clearTimeout(tt3[tt3Index]);
                  }
                }, 800);
                tt3Index++;
              }
              break;
            }
          }
        }
        if (increment && props.tree.addloading === false) {
          props.tree.done = true;
          props.tree.addloading = true;
          nextTick(() => triggerRef(cards));
          if (props.tree.temporary.length > 0) {
            for (let i = 0; i < props.tree.temporary.length; i++) {
              if (item[0] === props.tree.temporary[i]) {
                props.tree.temporary.splice(i, 1);
                nextTick(() => triggerRef(cards));
                break;
              }
            }
          }
          let temp = props.tree.temporary.slice(
            props.tree.value.length,
            props.tree.temporary.length
          );
          props.tree.value.push(item[0]);
          let newTree = JSON.parse(JSON.stringify(props.tree.value));
          props.tree.temporary = newTree;
          props.tree.temporary.push(...temp);
          props.tree.index = props.tree.value.length;
          props.tree.single = "";
          props.tree.addloading = false;
          temporary.value = props.tree;
          paginateFurther();
          nextTick(() => triggerRef(cards));
        }
      } else {
        props.tree.single = "";
        nextTick(() => triggerRef(cards));
      }
    }
  }
  let tt: NodeJS.Timeout;
  tt = setTimeout(() => {
    scrollToElement(lastpasteditemsref.value);
    clearTimeout(tt);
  }, 300);
  pastedtext.value = "";
  pasteditemcount.value = 0;
  pasteditemloading.value = false;
  pasteexpanded.value = false;
  pastemultiplelineitems.value = false;
  duplicateCheckerObject = {};
}
function handlePaste(e: { clipboardData: any; }) {
  var clipboardData, pastedData;
  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData("Text");
  return pastedData;
}
function deletePasted(index: number) {
  pasteditemvalidity.value.splice(index, 1);
  if (pasteditemvalidity.value.length === 0) {
    pastedtext.value = "";
    pasteditemcount.value = 0;
    pasteditemloading.value = false;
    pasteexpanded.value = false;
    pastemultiplelineitems.value = false;
    duplicateCheckerObject = {};
  }
}
</script>

<template>

<div
        class="w-100 position-absolute t-0 l-0 shadow-sm"
        style="height: 188px; background-color: #fff; border: 1px solid #fff"
      >
        <div
          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
          style="height: 30px"
        >
          <div class="flex-fill" style="font-size: 0.8rem">
            Press Ctrl + V on a PC or Command + V on an Apple Mac.
          </div>
          <div class="flex-grow-0 flex-shrink-0 text-center">
            <a
              @click="pastemultiplelineitems = false"
              class="d-inline-block cursor-pointer"
              title="Close"
            >
              <img
                src="/src/assets/icons/close.png"
                style="width: 20px; height: 20px"
                class="align-middle"
              />
            </a>
          </div>
        </div>
        <div class="d-block position-relative">
          <div class="d-block h-100" style="z-index: 800">
            <textarea
              :ref="(el) => (pastetextarearef = el)"
              style="border: 1px solid gray; padding: 5px; resize: none"
              class="w-100 h-100 text-left d-inline-block overflow-auto"
              maxlength="0"
              v-model="pastedtext"
              @paste="(e) => pasteMultilineWordsCopiedFromSomewhere(e)"
            ></textarea>
          </div>
          <template v-if="pasteditemloading">
            <div
              style="padding: 26px 0px; z-index: 900"
              class="t-0 l-0 w-100 position-absolute m-0 h-100 modal-mask-background-1"
            >
              <img
                src="/src/assets/icons/loading.gif"
                style="width: 80px; height: 80px"
                class="align-middle"
              />
            </div>
          </template>
        </div>
        <div
          class="d-block"
          style="background-color: #fff; height: 26px; padding: 2px 0; font-size: 0.8rem"
        >
          Max letters per line = 40, Total Max letters for all lines = 5000
        </div>
      </div>
      <Teleport to="body">
        <div v-if="pasteexpanded" class="d-block position-relative">
          <transition name="modal">
            <div
              class="position-fixed h-100 w-100 overflow-auto user-select-none"
              style="z-index: 1800"
            >
              <div class="modal-mask h-100 w-100 modal-mask-background-2">
                <div class="modal-wrapper text-center">
                  <div
                    class="modal-container d-block shadow"
                    style="height: auto; width: 560px"
                  >
                    <div class="d-block m-0 p-0">
                      <div
                        class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                        style="height: 30px; padding: 0 3px"
                      >
                        <div class="text-left flex-fill" style="font-size: 0.8rem">
                          Out of {{ acceptedpasteditemcount }} pasted
                          {{ acceptedpasteditemcount > 1 ? "lines" : "line" }}
                          of words,
                          {{
                            duplicatecount > 0
                              ? duplicatecount
                              : "no"
                          }}
                          {{
                            duplicatecount > 1
                              ? "duplicates"
                              : "duplicate"
                          }}
                          removed and
                          {{
                            errorcount > 0
                              ? errorcount
                              : "no"
                          }}
                          {{ errorcount > 1 ? "lines" : "line" }}
                          of words are too long
                        </div>
                        <div class="flex-grow-0 flex-shrink-0 text-center">
                          <a
                            @click="
                              () => {
                                pastedtext = '';
                                pasteditemcount = 0;
                                pasteditemloading = false;
                                pasteexpanded = false;
                                pastemultiplelineitems = false;
                                duplicateCheckerObject = {};
                              }
                            "
                            class="d-inline-block cursor-pointer"
                            title="Close"
                          >
                            <img
                              src="/src/assets/icons/close.png"
                              style="width: 20px; height: 20px"
                              class="align-middle"
                            />
                          </a>
                        </div>
                      </div>
                      <div class="d-block" style="padding: 10px">
                        <button
                          @click="addPasted()"
                          class="btn shadow-sm d-inline-block w-100"
                          style="background-color: green; color: #fff"
                        >
                          Add pasted
                        </button>
                      </div>
                      <div class="d-block">
                        <ul class="d-block list-style-none m-0 p-0">
                          <li
                            v-for="(item, i) in pasteditemvalidity"
                            :key="'expand-include-' + i"
                          >
                            <div class="d-block" style="padding: 5px">
                              <template v-if="pasteditemeditenabler[i]">
                                <div
                                  class="position-relative flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
                                >
                                  <div class="flex-fill p-0 m-0 align-self-stretch">
                                    <input
                                      type="text"
                                      class="w-100"
                                      v-model="item[0]"
                                      style="
                                        border-radius: 20px;
                                        padding: 8px;
                                        background-color: #ffcccb;
                                      "
                                    />
                                  </div>
                                  <div
                                    class="position-absolute flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                                    style="
                                      background-color: #eee;
                                      outline: 1px solid rgba(0, 0, 0, 0.2);
                                      border-top-right-radius: 20px;
                                      border-bottom-right-radius: 20px;
                                    "
                                  >
                                    <a
                                      class="cursor-pointer d-block text-center"
                                      style="padding: 7px 0"
                                      @click="saveEditedTooLong(item[0], i)"
                                    >
                                      <img
                                        src="/src/assets/icons/save.png"
                                        class="wh-1-dot-25-rem align-middle"
                                      />
                                    </a>
                                  </div>
                                </div>
                              </template>
                              <template v-else>
                                <div
                                  :style="
                                    item[1] === 'ERROR'
                                      ? 'background-color:red;color:#fff;'
                                      : 'background-color:#fff;'
                                  "
                                  class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                                  style="border-radius: 20px; padding: 8px"
                                >
                                  <div
                                    class="ellipsis overflow-hidden text-left flex-fill letter-spacing font-0-dot-875-rem"
                                  >
                                    {{ item[0] }}
                                  </div>
                                  <div
                                    class="flex-shrink-0 flex-grow-0 flex-w-3-dot-5-rem"
                                  >
                                    <div
                                      class="flex-box flex-direction-row w-100 flex-nowrap justify-content-end align-items-center"
                                    >
                                      <template v-if="item[1] === 'ERROR'">
                                        <div
                                          class="flex-shrink-0 flex-grow-0"
                                          style="padding-right: 4px"
                                        >
                                          <a
                                            @click="pasteditemeditenabler[i] = true"
                                            class="d-inline-block cursor-pointer"
                                          >
                                            <img
                                              src="/src/assets/icons/edit.png"
                                              style="width: 18px; height: 18px"
                                              class="align-middle"
                                            />
                                          </a>
                                        </div>
                                      </template>
                                      <div
                                        class="flex-shrink-0 flex-grow-0"
                                        style="padding-left: 4px"
                                      >
                                        <a
                                          @click="deletePasted(i)"
                                          class="d-inline-block cursor-pointer"
                                        >
                                          <img
                                            src="/src/assets/icons/delete.png"
                                            style="width: 18px; height: 18px"
                                            class="align-middle"
                                          />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </template>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </Teleport>
</template>