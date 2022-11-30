<script setup lang="ts">
import {
  watch,
  ref,
  nextTick,
  onMounted,
  onBeforeUnmount,
  onBeforeMount,
  inject,
  shallowRef,
  type ShallowRef,
  type Ref,
  type WatchStopHandle,
  triggerRef,
} from "vue";
import type { DuplicateCheckerObjectType, YearSelectionType, } from "../types/days_months_years_types";
import { addYear } from "../utility/days_months_years_utility_fns.vue";

const props1 = defineProps<{
  yyears: YearSelectionType;
  yformat: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO";
  updateyyearsvalue: boolean;
}>();

const emits = defineEmits<{
  (e: "change:format", action: 'MULTIPLE-OR-SINGLE'): void;
  (e: "update:yyears-and-page-value", action: { years: YearSelectionType; page: number; }): void;
}>();

let props = inject("yearprops") as {
    maxyear: string;
    minyear: string;
    yearselectionsandformat: {
      format: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO";
      years: {
        [key: string | number]: {
          selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
        }[];
      } | {};
    };
  },
  pastemultiplelines = ref(false),
  pasteboxref = ref(),
  pastedmultiplelinesoftext = ref(""),
  pastedmultiplelinesloading = ref(false),
  actualpasteddata = "",
  years = shallowRef(),
  format = ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">(),
  hassomethingtopaste = ref(false),
  duplicateCheckerObject = {} as DuplicateCheckerObjectType,
  processedpasteedit = ref<boolean[]>([]),
  processedpaste = ref<[string, string][]>([]),
  processedpasteerror = ref(0),
  processedpasteoutofrange = ref(0),
  processedpastelines = ref(0),
  pastemultiplelinescounter = ref(0),
  pastemultiplelinesexpand = ref(false),
  page = ref<number>(0),
  unwatchupdateyyearsvalue: WatchStopHandle,
  unwatchpastedmultiplelinesoftext: WatchStopHandle;

function addPasted() {
  format.value = "MULTIPLE-OR-SINGLE";
  nextTick(() => {
    for (let i = 0; i < processedpaste.value.length; i++) {
      let item = processedpaste.value[i];
      if (
        item[1] !== "ERROR" &&
        item[1] !== "OUT-OF-YEAR-RANGE" &&
        (item[0] as string).trim() !== ""
      ) {
        addYear(page as Ref<number>, undefined, undefined, undefined, undefined, parseInt(item[0]) as number, false, years as ShallowRef<YearSelectionType>, format as Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">);
      }
    }
    emits("update:yyears-and-page-value", {years: years.value as YearSelectionType, page: page.value as number});
    pastemultiplelines.value = false;
    pastemultiplelinesexpand.value = false;
    pastedmultiplelinesoftext.value = "";
    pastemultiplelinescounter.value = 0;
    pastedmultiplelinesloading.value = false;
    duplicateCheckerObject = {} as DuplicateCheckerObjectType;
  });
}

function processPastedTextAndFindRejectedAndAcceptedLines(actualtext: string, textareaacceptedtext: string): [
  number,
  [
    [string, string][],
    number,
    number
  ]
] {
  let actualtextArray = actualtext.split("\n");
  let textareaacceptedtextArray = textareaacceptedtext.split("\n");

  if (textareaacceptedtextArray[textareaacceptedtextArray.length - 1].trim() !== "") {
    if (
      textareaacceptedtextArray[textareaacceptedtextArray.length - 1] !==
      actualtextArray[textareaacceptedtextArray.length - 1]
    ) {
      textareaacceptedtextArray.splice(textareaacceptedtextArray.length - 1, 1);
      actualtextArray.splice(textareaacceptedtextArray.length - 1, 1);
    }
  }

  let lines = textareaacceptedtextArray.length;

  for (let i = 0; i < textareaacceptedtextArray.length; i++) {
    if (textareaacceptedtextArray[i].trim() === "") {
      textareaacceptedtextArray.splice(i, 1);
      continue;
    }
  }
  
  return [lines, removeDuplicateAndValidateLine(textareaacceptedtextArray)];
}

function removeDuplicateAndValidateLine(acceptedArray: string[]): [
  [string, string][],
  number,
  number
] {
  let newArray: [string, string][] = [],
    index = 0,
    error = 0,
    outofrange = 0;
  acceptedArray.forEach((item, i) => {
    if (item.trim() !== "") {
      if (
        (duplicateCheckerObject as DuplicateCheckerObjectType)[''+item] === undefined ||
        (duplicateCheckerObject as DuplicateCheckerObjectType)[''+item] === null
      ) {
        if(/^\d+$/g.test(item)) {
          if(parseInt(item) >= parseInt(props.minyear) && parseInt(item) <= parseInt(props.maxyear)) {
            (duplicateCheckerObject as DuplicateCheckerObjectType)[''+item] = "";
            newArray[index] = [item, "YEAR"];
            processedpasteedit.value[index] = false;
            hassomethingtopaste.value = true;
          }
          else {
            (duplicateCheckerObject as DuplicateCheckerObjectType)[''+item] = "";
            newArray[index] = [item, "OUT-OF-YEAR-RANGE"];
            processedpasteedit.value[index] = false;
            outofrange++;
          }
        } else {
          (duplicateCheckerObject as DuplicateCheckerObjectType)[''+item] = "";
          newArray[index] = [item, "ERROR"];
          processedpasteedit.value[index] = false;
          error++;
        }
        index++;
      }
    }
  });

  return [newArray, error, outofrange];
}

function openPasteArea() {
  pastemultiplelines.value = true;
  pastemultiplelinesexpand.value = false;
  pastedmultiplelinesoftext.value = "";
  pastemultiplelinescounter.value = 0;
  pastedmultiplelinesloading.value = false;
  duplicateCheckerObject = {} as DuplicateCheckerObjectType;
  format.value = "MULTIPLE-OR-SINGLE";
  emits("change:format", format.value);

  let tt;
  clearTimeout(tt);
  tt = setTimeout(() => {
    pasteboxref.value.focus();
    clearTimeout(tt);
  }, 50);
}

function handlePaste(e: { clipboardData: any; }) {
  var clipboardData, pastedData;

  // Get pasted data via clipboard API
  clipboardData = e.clipboardData || window.clipboardData;
  pastedData = clipboardData.getData("Text");

  return pastedData;
}

function pasteMultilineWordsCopiedFromSomewhere(e) {
  pasteboxref.value.maxLength = 5000;
  actualpasteddata = handlePaste(e);
  let pastelengthresizetimer;
  clearTimeout(pastelengthresizetimer);
  pastelengthresizetimer = setTimeout(() => {
    pasteboxref.value.maxLength = 0;
    clearTimeout(pastelengthresizetimer);
  }, 10);
}

onBeforeUnmount(() => {
  unwatchpastedmultiplelinesoftext();
  unwatchupdateyyearsvalue();
});

onBeforeMount(() => {
  years.value = props1.yyears;
  format.value = props1.yformat;
});

onMounted(() => {
  unwatchupdateyyearsvalue = watch(
    () => props1.updateyyearsvalue,
    (x) => {
      if(x && props1.yformat === 'MULTIPLE-OR-SINGLE') {
        years.value = props1.yyears as YearSelectionType;
        triggerRef(years);
      }
    }
  );
  unwatchpastedmultiplelinesoftext = watch(
    () => pastedmultiplelinesoftext.value,
    (text) => {
      if (pastemultiplelinescounter.value === 0) {
        pastedmultiplelinesloading.value = true;
        pastemultiplelinescounter.value = 1;
        let pt;
        clearTimeout(pt);
        pt = setTimeout(() => {
          pastedmultiplelinesloading.value = false;
          pastemultiplelinesexpand.value = true;
          let result = processPastedTextAndFindRejectedAndAcceptedLines(
            actualpasteddata,
            text
          );
          processedpaste.value = result[1][0];
          processedpasteerror.value = result[1][1];
          processedpasteoutofrange.value = result[1][2];
          processedpastelines.value = result[0];
          clearTimeout(pt);
        }, 200);
      }
    }
  );
});

</script>

<template>
  <div class="d-block position-relative">
    <template v-if="pastemultiplelines">
      <div
        class="shadow-sm w-100 t-0 l-0 position-absolute"
        style="height: 237.95px; background-color: #fff; border: 1px solid #fff"
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
              @click="pastemultiplelines = false"
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
        <div class="d-block position-relative" style="height: 177.95px;">
          <div class="d-block h-100" style="z-index: 800;">
            <textarea
              :ref="(el) => (pasteboxref = el)"
              style="border: 1px solid gray; padding: 5px; resize: none"
              class="w-100 h-100 text-left d-inline-block overflow-auto"
              maxlength="0"
              v-model="pastedmultiplelinesoftext"
              @paste="(e) => pasteMultilineWordsCopiedFromSomewhere(e)"
            ></textarea>
          </div>
          <template v-if="pastedmultiplelinesloading">
            <div
              style="padding: 38.975px 0px; z-index: 900"
              class="t-0 l-0 w-100 position-absolute m-0 h-100 modal-mask-background-1"
            >
              <img
                src="/src/assets/icons/loading.gif"
                style="width: 100px; height: 100px"
                class="align-middle"
              />
            </div>
          </template>
        </div>
        <div
          class="d-block font-family"
          style="height:30px; padding: 4px 0; font-size: 0.8rem;"
        >
          Max letters per line = 40, Total Max letters for all lines = 5000
        </div>
      </div>
      <Teleport to="body">
        <div v-if="pastemultiplelinesexpand" class="d-block position-relative">
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
                          <div
                            class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                          >
                            <div class="flex-fill text-center">
                              Pasted Lines = {{ processedpastelines }}
                            </div>
                            <div class="flex-fill text-center">
                              <div
                                class="d-inline-block align-middle"
                                style="background-color: red; width: 15px; height: 15px"
                              ></div>
                              Invalid Years = {{ processedpasteerror }}
                            </div>
                            <div class="flex-fill text-center">
                              <div
                                class="d-inline-block align-middle"
                                style="
                                  background-color: yellow;
                                  width: 15px;
                                  height: 15px;
                                "
                              ></div>
                              Out of Range = {{ processedpasteoutofrange }}
                            </div>
                          </div>
                        </div>
                        <div class="flex-grow-0 flex-shrink-0 text-center">
                          <a
                            @click="
                              () => {
                                pastedmultiplelinesoftext = '';
                                pastemultiplelinescounter = 0;
                                pastedmultiplelinesloading = false;
                                pastemultiplelinesexpand = false;
                                pastemultiplelines = false;
                                duplicateCheckerObject = {} as DuplicateCheckerObjectType;
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
                          @click="() => { hassomethingtopaste? addPasted() : ''}"
                          class="btn shadow-sm d-inline-block w-100"
                          :style="hassomethingtopaste? 'background-color: green; color: #fff' : 'background-color: grey; color: #fff'"
                        >
                          Done
                        </button>
                      </div>
                      <div class="d-block">
                        <ul class="d-block list-style-none m-0 p-0">
                          <li
                            v-for="(item, i) in processedpaste"
                            :key="'expand-include-' + i"
                          >
                            <div class="d-block" style="padding: 5px">
                              <template v-if="processedpasteedit[i]">
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
                                      @click=""
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
                                      : item[1] === 'OUT-OF-YEAR-RANGE'
                                      ? 'background-color:yellow;color:black;'
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
                                      <template v-if="item[1] === 'OUT-OF-YEAR-RANGE'">
                                        <div
                                          class="flex-shrink-0 flex-grow-0"
                                          style="padding-right: 4px"
                                        >
                                          <a
                                            @click="processedpasteedit[i] = true"
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
    <div class="d-block text-center" style="padding: 5px 0 10px 0">
      <button
        class="btn shadow-sm w-100"
        style="padding: 3px 0; font-size: 0.90rem; background-color: #f0e68c;"
        @click="openPasteArea()"
      >
        Paste multiple lines of year
      </button>
    </div>
  </div>
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
</style>