<script setup lang="ts">
import {
  format
} from "date-fns";
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
import type { VisibleCalendarType } from "../types/dd_mm_yy_types";
import type { DuplicateCheckerObjectType } from "../types/days_months_years_types";
import { addDate, removeDelimiters, countSelectedDateCells, } from "../utility/dd_mm_yy_utility_fns";


const parentprops = defineProps<{
}>();

const emits = defineEmits<{
  (e: "send:dd_mm_yyyy_excludecanceldoneforsearchreadiness", action: {mode: 'RANGE' | 'MULTIPLE-OR-SINGLE'; score: number; }): void;
  (e: "change:clickformat", action: 'MULTIPLE-OR-SINGLE'): void;
  (e: "update:vcalendar-value", action: { vcalendar: VisibleCalendarType; pastedclickedornot: boolean; }): void;
}>();

let pastemultiplelines = ref(false),
  pasteboxref = ref(),
  pastedmultiplelinesoftext = ref(""),
  pastedmultiplelinesloading = ref(false),
  actualpasteddata = "",
  multipleselectcount = ref(0),
  clickformat = ref(),
  title = ref(),
  visiblecalendar = shallowRef(),
  hassomethingtopaste = ref(false),
  duplicateCheckerObject = {} as DuplicateCheckerObjectType,
  pasteedit = ref<boolean[]>([]),
  paste = ref<[string, string][]>([]),
  pasteerror = ref(0),
  pasteoutofrange = ref(0),
  pasteindeterminate = ref(0),
  pastelines = ref(0),
  pastemultiplelinescounter = ref(0),
  pastemultiplelinesexpand = ref(false),
  unwatchupdatecalendarvalue: WatchStopHandle,
  unwatchmultipleselectcount: WatchStopHandle,
  unwatchpastedmultiplelinesoftext: WatchStopHandle;

function addPasted() {
  clickformat.value = "MULTIPLE-OR-SINGLE";
  emits("change:clickformat", 'MULTIPLE-OR-SINGLE');
  nextTick(() => {
    for (let i = 0; i < paste.value.length; i++) {
      let item = paste.value[i];
      if (
        item[1] !== "ERROR" &&
        item[1] !== "OUT-OF-DATE-RANGE" &&
        item[1] !== "INDETERMINATE" &&
        (item[0] as string).trim() !== ""
      ) {
        addDate(undefined, undefined, multipleselectcount, clickformat as Ref<"RANGE" | "MULTIPLE-OR-SINGLE">, item[0], false, true, props, visiblecalendar as ShallowRef<VisibleCalendarType>);
      }
    }
    emits("update:vcalendar-value", { vcalendar: visiblecalendar.value as VisibleCalendarType, pastedclickedornot: true });
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

function testInvalidDateValidity(pasteddate: string) {
  let delimiterRemovedDate = removeDelimiters(pasteddate),
    delimiterRemovedDateArray = (delimiterRemovedDate[0] as string).split(" "),
    teststringdate = "";
  try {
    if (delimiterRemovedDateArray.length === 3) {
      if (
        (parseInt(delimiterRemovedDateArray[1]) < 13 &&
          parseInt(delimiterRemovedDateArray[2]) < 13) ||
        (parseInt(delimiterRemovedDateArray[0]) < 13 &&
          parseInt(delimiterRemovedDateArray[1]) < 13)
      ) {
        return "INDETERMINATE";
      } else {
        for (let i = delimiterRemovedDateArray.length - 1; i >= 0; i--) {
          teststringdate += delimiterRemovedDateArray[i];
          if (i > 0) {
            teststringdate += " ";
          }
        }
        if (
          format(new Date(teststringdate), "yyyy-MM-dd") >=
            format(new Date(props.mindate), "yyyy-MM-dd") &&
          format(new Date(teststringdate), "yyyy-MM-dd") <=
            format(new Date(props.maxdate), "yyyy-MM-dd")
        ) {
          return "VALID";
        } else {
          return "OUT-OF-DATE-RANGE";
        }
      }
    } else {
      return "ERROR";
    }
  } catch (ex) {
    return "ERROR";
  }
}

function removeDuplicateAndValidateLine(acceptedArray: string[]): [
  [string, string][],
  number,
  number,
  number
] {
  let newArray: [string, string][] = [],
    index = 0,
    error = 0,
    outofrange = 0,
    indeterminate = 0;
  acceptedArray.forEach((item, i) => {
    if (item.trim() !== "") {
      if (
        duplicateCheckerObject["" + item] === undefined ||
        duplicateCheckerObject["" + item] === null
      ) {
        try {
          let removedDelimiter = removeDelimiters(item);
          if (removedDelimiter[1]) {
            if (
              format(new Date(removedDelimiter[0] as string), "yyyy-MM-dd") >=
                format(new Date(props.mindate), "yyyy-MM-dd") &&
              format(new Date(removedDelimiter[0] as string), "yyyy-MM-dd") <=
                format(new Date(props.maxdate), "yyyy-MM-dd")
            ) {
              duplicateCheckerObject["" + item] = "";
              newArray[index] = [item, "DATE"];
              pasteedit.value[index] = false;
              hassomethingtopaste.value = true;
            } else {
              duplicateCheckerObject["" + item] = "";
              newArray[index] = [item, "OUT-OF-DATE-RANGE"];
              pasteedit.value[index] = false;
              outofrange++;
            }
          } else {
            let splited = (removedDelimiter[0] as string).split(" ");
            if(splited.length === 1 || splited.length === 2) {
              duplicateCheckerObject["" + item] = "";
              newArray[index] = [item, "ERROR"];
              pasteedit.value[index] = false;
              error++;
            }
            else {
              duplicateCheckerObject["" + item] = "";
              newArray[index] = [item, "INDETERMINATE"];
              pasteedit.value[index] = false;
              indeterminate++;
            }
          }
        } catch (ex) {
          let invaliddatetest = testInvalidDateValidity(item);

          if (invaliddatetest === "VALID") {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "DATE"];
            pasteedit.value[index] = false;
            hassomethingtopaste.value = true;
          } else if (invaliddatetest === "OUT-OF-DATE-RANGE") {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "OUT-OF-DATE-RANGE"];
            pasteedit.value[index] = false;
            outofrange++;
          } else if (invaliddatetest === "INDETERMINATE") {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "INDETERMINATE"];
            pasteedit.value[index] = false;
            indeterminate++;
          } else {
            duplicateCheckerObject["" + item] = "";
            newArray[index] = [item, "ERROR"];
            pasteedit.value[index] = false;
            error++;
          }
        }
        index++;
      }
    }
  });

  return [newArray, error, outofrange, indeterminate];
}

function openPasteArea() {
  pastemultiplelines.value = true;
  pastemultiplelinesexpand.value = false;
  pastedmultiplelinesoftext.value = "";
  pastemultiplelinescounter.value = 0;
  pastedmultiplelinesloading.value = false;
  duplicateCheckerObject = {} as DuplicateCheckerObjectType;

  let tt: NodeJS.Timeout;
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
  let pastelengthresizetimer: NodeJS.Timeout;
  pastelengthresizetimer = setTimeout(() => {
    pasteboxref.value.maxLength = 0;
    clearTimeout(pastelengthresizetimer);
  }, 10);
}

onBeforeUnmount(() => {
  unwatchpastedmultiplelinesoftext();
  unwatchupdatecalendarvalue();
  unwatchmultipleselectcount();
});

onBeforeMount(() => {
  clickformat.value = parentprops.cformat;
  visiblecalendar.value = parentprops.vcalendar as VisibleCalendarType;
});

onMounted(() => {
  title.value = props.title;
  unwatchmultipleselectcount = watch(
    () => multipleselectcount.value,
    (x) => {
      if(clickformat.value === "MULTIPLE-OR-SINGLE") {
        if(x > 0) {
          emits("send:dd_mm_yyyy_excludecanceldoneforsearchreadiness", {mode:parentprops.cformat, score: x});
        }
        else {
          emits("send:dd_mm_yyyy_excludecanceldoneforsearchreadiness", {mode:parentprops.cformat, score: 0});
        }
      }
    }
  );
  unwatchupdatecalendarvalue = watch(
    () => parentprops.updatevcalendarvalue,
    (x) => {
      if(x) {
        visiblecalendar.value = parentprops.vcalendar as VisibleCalendarType;
        triggerRef(visiblecalendar);
        if(clickformat.value === 'MULTIPLE-OR-SINGLE') {
          if(visiblecalendar.value.selections) {
            multipleselectcount.value = countSelectedDateCells(visiblecalendar as ShallowRef<VisibleCalendarType>);
          }
        }
      }
    }
  );
  unwatchpastedmultiplelinesoftext = watch(
    () => pastedmultiplelinesoftext.value,
    (text) => {
      if (pastemultiplelinescounter.value === 0) {
        pastedmultiplelinesloading.value = true;
        pastemultiplelinescounter.value = 1;
        let pt: NodeJS.Timeout;
        pt = setTimeout(() => {
          pastedmultiplelinesloading.value = false;
          pastemultiplelinesexpand.value = true;
          let result = processPastedTextAndFindRejectedAndAcceptedLines(
            actualpasteddata,
            pastedmultiplelinesoftext.value
          );
          paste.value = result[1][0];
          pasteerror.value = result[1][1];
          pasteoutofrange.value = result[1][2];
          pasteindeterminate.value = result[1][3];
          pastelines.value = result[0];
          clearTimeout(pt);
        }, 200);
      }
    }
  );




  /*


      :vcalendar="(visiblecalendar as VisibleCalendarType)"
      :updatevcalendarvalue="pupdatevcalendarvalue"
      @update:vcalendar-value="$vcalendarvalue => updateVCalendarValueFn($vcalendarvalue, 'PASTED')"
      @change:clickformat="$val => updateFormat($val)"
      :cformat="(clickformat as 'RANGE' | 'MULTIPLE-OR-SINGLE')"




  vcalendar: VisibleCalendarType;
  cformat: "RANGE" | "MULTIPLE-OR-SINGLE";
  updatevcalendarvalue: boolean;
  */


});

</script>

<template>
  <div class="d-block position-relative">
    <template v-if="pastemultiplelines">
      <div
        class="w-100 t-0 l-0 position-absolute"
        style="height: 480px; padding: 10px 0px;"
      >
        <div class="d-block shadow-sm" style="background-color: #fff; border: 1px solid #fff;">
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
          <div class="d-block position-relative" style="height: 428px">
            <div class="d-block h-100" style="z-index: 800">
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
                style="padding: 114px 0px; z-index: 900"
                class="t-0 l-0 w-100 position-absolute m-0 h-100 modal-mask-background-1"
              >
                <img
                  src="/src/assets/icons/loading.gif"
                  style="width: 200px; height: 200px"
                  class="align-middle"
                />
              </div>
            </template>
          </div>
          <div
            class="d-block"
            style="background-color: #fff; height: 25px; padding: 3.1px 0; font-size: 0.8rem"
          >
            Max letters per line = 40, Total Max letters for all lines = 5000
          </div>
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
                              Pasted Lines = {{ pastelines }}
                            </div>
                            <div class="flex-fill text-center">
                              <div
                                class="d-inline-block align-middle"
                                style="background-color: red; width: 15px; height: 15px"
                              ></div>
                              Invalid Dates = {{ pasteerror }}
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
                              Out of Range = {{ pasteoutofrange }}
                            </div>
                            <div class="flex-fill text-center">
                              <div
                                class="d-inline-block align-middle"
                                style="background-color: pink; width: 15px; height: 15px"
                              ></div>
                              Indeterminate =
                              {{ pasteindeterminate }}
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
                        <div
                          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
                        >
                          <div class="flex-w-50" style="padding-right: 2px">
                            <button
                              @click=""
                              class="btn shadow-sm d-inline-block w-100"
                              style="background-color: green; color: #fff"
                            >
                              Choose format for Indeterminate
                            </button>
                          </div>
                          <div class="flex-w-50" style="padding-left: 2px">
                            <button
                              @click="() => { hassomethingtopaste? addPasted() : ''}"
                              class="btn shadow-sm d-inline-block w-100"
                              :style="hassomethingtopaste? 'background-color: green; color: #fff' : 'background-color: grey; color: #fff'"
                            >
                              Done
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="d-block">
                        <ul class="d-block list-style-none m-0 p-0">
                          <li
                            v-for="(item, i) in paste"
                            :key="'expand-include-' + i"
                          >
                            <div class="d-block" style="padding: 5px">
                              <template v-if="pasteedit[i]">
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
                                      @click="saveEditedDate(item[0], i)"
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
                                      : item[1] === 'OUT-OF-DATE-RANGE'
                                      ? 'background-color:yellow;color:black;'
                                      : item[1] === 'INDETERMINATE'
                                      ? 'background-color:pink;color:black;'
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
                                      <template v-if="item[1] === 'OUT-OF-DATE-RANGE'">
                                        <div
                                          class="flex-shrink-0 flex-grow-0"
                                          style="padding-right: 4px"
                                        >
                                          <a
                                            @click="pasteedit[i] = true"
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
    <div class="d-block text-center" style="padding: 34.5px 0 34.5px 0">
      <button
        class="btn shadow-sm w-100 font-family"
        style="border-radius: 50px; padding: 12px; font-size: 1.2rem; background-color: #f0e68c;"
        @click="openPasteArea()"
      >
        Paste multiple lines of
        <span class="text-lowercase">{{ title }}</span>
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