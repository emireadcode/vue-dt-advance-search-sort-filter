<script setup lang="ts">
import { computed, type WatchStopHandle, type ShallowRef, type Ref, onMounted, nextTick, ref, shallowRef, inject, onBeforeMount, watch, triggerRef, onBeforeUnmount } from "vue";
import type {  YearSelectionType, YearRangeFirstSelectionType, YearSelectionFormat } from "../types/days_months_years_types";
import { 
  addYear, 
  getYearDimensions, 
  unTrackYearBoxMouseMovement, 
  trackYearBoxMouseMovement, 
  deselectAll,
  fillYearArray,
} from "../utility/days_months_years_utility_fns";
import type {YearType} from "../types/SupportedDatatypesTypeDeclaration";
import Paste from "./Paste.vue";

let 
  unwatchrangecount: WatchStopHandle,
  unwatchmultipleselectcount: WatchStopHandle,
  unwatchformat: WatchStopHandle,
  unwatchgreaterthan: WatchStopHandle,
  unwatchlessthan: WatchStopHandle
;

const 
  props = defineProps<{
    maxyear: number;
    minyear: number;
    yearselectionandformat: YearSelectionFormat;
  }>(),
  cards = inject("cards") as ShallowRef<YearType[]>,
  index = inject("index") as number,
  years = shallowRef<YearSelectionType>(),
  format = ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN">(),
  page = ref(0),
  rangecount = ref(0),
  multipleselectcount = ref(0),
  rangefirstselection = ref<YearRangeFirstSelectionType>(),
  loadingMovement = ref(false),
  lessthan = ref(""),
  greaterthan = ref(""),
  lessthanref = ref(),
  greaterthanref = ref()
;

const compYearsLength = computed(() => {
  return Object.keys(years.value as YearSelectionType).length;
});

function processDimensions() {
  getYearDimensions(years as ShallowRef<YearSelectionType>, page as Ref<number>);
}

function addYearByClick(year: number, clickedorpasted: boolean) {
  addYear(page, rangefirstselection as Ref<YearRangeFirstSelectionType>, loadingMovement, rangecount, multipleselectcount, year, clickedorpasted, years as ShallowRef<YearSelectionType>, format as Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN">);
}

onBeforeMount(() => {
  format.value = "RANGE";
  rangefirstselection.value = { page: -1, year: -1 };
  rangecount.value = 0;
  multipleselectcount.value = 0;
  (years.value as YearSelectionType)= (fillYearArray(
    props.maxyear,
    props.minyear,
    props.yearselectionandformat.format,
    page
  ) as ShallowRef<YearSelectionType>).value;
  triggerRef(years);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', processDimensions, true);
  window.removeEventListener('scroll', processDimensions, true);
  unTrackYearBoxMouseMovement(page, years as ShallowRef<YearSelectionType>, rangefirstselection as Ref<YearRangeFirstSelectionType>, loadingMovement, format as Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN">);
  unwatchformat();
  unwatchgreaterthan();
  unwatchlessthan();
  unwatchmultipleselectcount();
  unwatchrangecount();
});

onMounted(() => {
  unwatchmultipleselectcount = watch(
    () => multipleselectcount.value,
    (x) => {
      if(format.value !== "RANGE") {
        if(x > 0) {
        }
        else {
        }
      }
    }
  );
  unwatchrangecount = watch(
    () => rangecount.value,
    (x) => {
      if (format.value === "RANGE") {
        if(x === 2) {
        }
        else {
        }
      }
    }
  );
  unwatchformat = watch(
    () => format.value,
    (x) => {
      deselectAll(years as ShallowRef<YearSelectionType>);
      unTrackYearBoxMouseMovement(page, years as ShallowRef<YearSelectionType>, rangefirstselection as Ref<YearRangeFirstSelectionType>, loadingMovement, format as Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN">);
      rangefirstselection.value = { page: -1, year: -1 };
      rangecount.value = 0;
      multipleselectcount.value = 0;
    }
  );
  unwatchgreaterthan = watch(
    () => greaterthan.value,
    (x) => {
      lessthanref.value.style.backgroundColor = '#fff';
      lessthanref.value.style.color = 'black';
      deselectAll(years as ShallowRef<YearSelectionType>);
      rangefirstselection.value = { page: -1, year: -1 };
      rangecount.value = 0;
      multipleselectcount.value = 0;
      let found = false, isnumber = false;
      nextTick(() => {
        if(x) {
          try {
            if(/^\d+$/g.test(x)) {
              isnumber = true;
              greaterthanref.value.style.backgroundColor = '#fff';
              greaterthanref.value.style.color = 'black';
              for(let p in years.value) {
                for(let row in years.value[parseInt(p)]) {
                  for(let col in years.value[parseInt(p)][row]) {
                    if((years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year === parseInt(x) && (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE') {
                      found = true;
                      break;
                    }
                  }
                  if(found) break;
                }
                if(found) break;
              }
              if(found) {
                for(let p in years.value) {
                  for(let row in years.value[parseInt(p)]) {
                    for(let col in years.value[parseInt(p)][row]) {
                      if((years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year > parseInt(x) && (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE') {
                        found = true;
                        (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
                        page.value = parseInt(p);
                        multipleselectcount.value++;
                      }
                    }
                  }
                }
                triggerRef(years);
              }
            }
            else {
              isnumber = false;
              greaterthanref.value.style.backgroundColor = 'red';
              greaterthanref.value.style.color = '#fff';
            }
          }
          catch(ex) {
            isnumber = false;
            greaterthanref.value.style.backgroundColor = 'red';
            greaterthanref.value.style.color = '#fff';
          }
          if(found === false && isnumber) {
            deselectAll(years as ShallowRef<YearSelectionType>);
            greaterthanref.value.style.backgroundColor = '#E8E8E8';
            greaterthanref.value.style.color = 'black';
          }
        }
        else {
          greaterthanref.value.style.backgroundColor = '#fff';
          greaterthanref.value.style.color = 'black';
        }
      });
    }
  );
  unwatchlessthan = watch(
    () => lessthan.value,
    (x) => {
      greaterthanref.value.style.backgroundColor = '#fff';
      greaterthanref.value.style.color = 'black';
      deselectAll(years as ShallowRef<YearSelectionType>);
      rangefirstselection.value = { page: -1, year: -1 };
      rangecount.value = 0;
      let found = false, isnumber = false;
      multipleselectcount.value = 0;

      nextTick(() => {
        if(x) {
          try {
            if(/^\d+$/g.test(x)) {
              isnumber = true;
              lessthanref.value.style.backgroundColor = '#fff';
              lessthanref.value.style.color = 'black';
              for(let p in years.value) {
                for(let row in years.value[parseInt(p)]) {
                  for(let col in years.value[parseInt(p)][row]) {
                    if((years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year === parseInt(x) && (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE') {
                      found = true;
                      break;
                    }
                  }
                  if(found) break;
                }
                if(found) break;
              }
              if(found) {
                for(let p in years.value) {
                  for(let row in years.value[parseInt(p)]) {
                    for(let col in years.value[parseInt(p)][row]) {
                      if((years.value[parseInt(p)][row][parseInt(col)] as unknown as YearSelectionType[number][number][number][number][number][number]).year < parseInt(x) && (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE') {
                        found = true;
                        (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
                        page.value = parseInt(p);

                        multipleselectcount.value++;
                      }
                    }
                  }
                }
                triggerRef(years);
              }
            }
            else {
              lessthanref.value.style.backgroundColor = 'red';
              lessthanref.value.style.color = '#fff';
              isnumber = false;
            }
          }
          catch(ex) {
            lessthanref.value.style.backgroundColor = 'red';
            lessthanref.value.style.color = '#fff';
            isnumber = false;
          }
          if(found == false && isnumber) {
            deselectAll(years as ShallowRef<YearSelectionType>);
            lessthanref.value.style.backgroundColor = '#E8E8E8';
            lessthanref.value.style.color = 'black';
          }
        }
        else {
          lessthanref.value.style.backgroundColor = '#fff';
          lessthanref.value.style.color = 'black';
        }
      });
    }
  );
  window.addEventListener('resize', processDimensions, true);
  window.addEventListener('scroll', processDimensions, true);
});

</script>

<template>
  <div class="d-block position-relative">
    <div
      class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
    >
      <div class="flex-w-50 align-self-stretch">
        <button
          @keypress.enter="() => {format = 'RANGE'; greaterthan = ''; lessthan = '';}"
          @click="() => {format = 'RANGE'; greaterthan = ''; lessthan = '';}"
          :style="
            format === 'RANGE' ? 'background-color:green;' : 'background-color:gray;'
          "
          class="font-family letter-spacing cursor-pointer btn w-100"
          style="color: #fff; padding: 2px 0; border-right: 1px solid #fff"
        >
          Range
        </button>
      </div>
      <div class="flex-w-50 align-self-stretch">
        <button
          @keypress.enter="
            () => {
              format = 'MULTIPLE-OR-SINGLE';
              greaterthan = '';
              lessthan = '';
            }
          "
          @click="
            () => {
              format = 'MULTIPLE-OR-SINGLE';
              greaterthan = '';
              lessthan = '';
            }
          "
          :style="
            format === 'MULTIPLE-OR-SINGLE'
              ? 'background-color:green;'
              : 'background-color:gray;'
          "
          class="font-family letter-spacing cursor-pointer btn w-100"
          style="color: #fff; padding: 2px 0; border-left: 1px solid #fff"
        >
          Multiple or Single
        </button>
      </div>
    </div>
    <Paste
      :title="cards[index].info.name"
      :datatype="'Year'"
      :max="''+props.maxyear"
      :min="''+props.minyear"
      :text-area-height="'height:184px;'"
    >
      <template v-slot:outcomeidentifier>
        <div
          class="flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
        >
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color: #fff; width: 15px; height: 15px"
            ></div>
            Accepted Lines
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="background-color:red;width:15px;height:15px"
            ></div>
            Invalid Year
          </div>
          <div class="flex-fill text-center">
            <div
              class="d-inline-block align-middle"
              style="
                background-color: yellow;
                width: 15px;
                height: 15px;
              "
            ></div>Out of Range
          </div>
        </div>
      </template>
    </Paste>
    <div
      class="p-0 m-0 flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
    >
      <div class="flex-w-50 align-self-stretch" style="padding-right: 3px">
        <div class="d-block text-center" style="padding-bottom: 1.5px">
          <img
            src="/src/assets/icons/less-than.png"
            style="width: 20px; height: 20px"
            class="align-middle"
          />
        </div>
        <div class="d-block">
          <input
            @keydown.space.prevent
            :ref="
              (el) => {
                lessthanref = el;
              }
            "
            @focus="
              () => {
                greaterthan = '';
                format = 'LESS-THAN';
              }
            "
            type="text"
            v-model.trim="lessthan"
            class="text-center w-100 align-middle"
            style="height: 30px"
          />
        </div>
      </div>
      <div class="flex-w-50 align-self-stretch">
        <div class="d-block text-center" style="padding-bottom: 1.5px">
          <img
            src="/src/assets/icons/greater-than.png"
            style="width: 20px; height: 20px"
            class="align-middle"
          />
        </div>
        <div class="d-block">
          <input
            @keydown.space.prevent
            :ref="
              (el) => {
                greaterthanref = el;
              }
            "
            @focus="
              () => {
                lessthan = '';
                format = 'GREATER-THAN';
              }
            "
            type="text"
            v-model.trim="greaterthan"
            class="text-center w-100 align-middle"
            style="height: 30px"
          />
        </div>
      </div>
    </div>
    <div
      class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center w-100"
      style="background-color: lightgray; padding: 0 10px"
    >
      <div class="flex-w-50 align-self-stretch text-left">
        <div
          class="d-inline-block"
          style="border-radius: 50%; padding: 5px 0; background-color: transparent"
        >
          <a
            :class="[compYearsLength > 1 && page > 0 ? 'cursor-pointer' : '']"
            style="border-radius: 50%"
            :style="
              compYearsLength > 1 && page > 0
                ? 'background-color: green;'
                : 'background-color:gray;'
            "
            class="flex-box align-items-center justify-content-center text-center"
            @keypress.enter="
              () => {
                page = page - 1 < 0 ? 0 : page - 1;
                processDimensions();
              }
            "
            @click="
              () => {
                page = page - 1 < 0 ? 0 : page - 1;
                processDimensions();
              }
            "
          >
            <svg class="shadow"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style="border-radius: 50%;height: 20px;width: 20px;color: #fff;stroke: currentcolor;fill: currentcolor;"
            >
              <path
                d="M20.943 23.057l-7.057-7.057c0 0 7.057-7.057 7.057-7.057 0.52-0.52 0.52-1.365 0-1.885s-1.365-0.52-1.885 0l-8 8c-0.521 0.521-0.521 1.365 0 1.885l8 8c0.52 0.52 1.365 0.52 1.885 0s0.52-1.365 0-1.885z"
              ></path>
            </svg>
          </a>
        </div>
      </div>
      <div class="flex-w-50 align-self-stretch text-right">
        <div
          class="d-inline-block"
          style="border-radius: 50%; padding: 5px 0; background-color: transparent"
        >
          <a
            :class="[
              compYearsLength > 1 && page !== compYearsLength - 1 ? 'cursor-pointer' : '',
            ]"
            style="border-radius: 50%"
            :style="
              compYearsLength > 1 && page !== compYearsLength - 1
                ? 'background-color: green;'
                : 'background-color:gray;'
            "
            class="flex-box align-items-center justify-content-center text-center"
            @keypress.enter="
              () => {
                page = page + 1 > compYearsLength - 1 ? compYearsLength - 1 : page + 1;
                processDimensions();
              }
            "
            @click="
              () => {
                page = page + 1 > compYearsLength - 1 ? compYearsLength - 1 : page + 1;
                processDimensions();
              }
            "
          >
            <svg
              class="shadow"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style="border-radius: 50%;height: 20px;width: 20px;color: #fff;stroke: currentcolor;fill: currentcolor;"
            >
              <path
                d="M12.943 24.943l8-8c0.521-0.521 0.521-1.365 0-1.885l-8-8c-0.52-0.52-1.365-0.52-1.885 0s-0.52 1.365 0 1.885l7.057 7.057c0 0-7.057 7.057-7.057 7.057-0.52 0.52-0.52 1.365 0 1.885s1.365 0.52 1.885 0z"
              ></path>
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="d-block shadow-sm" style="height: 98px" id="yearbox">
      <div
        class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
      >
        <template v-for="(row, rindex) in (years as YearSelectionType)[page]">
          <template v-for="(col, cindex) in row">
            <div
              class="flex-w-20 overflow-hidden"
              style="float: left; outline: 1px solid #fff"
            >
              <label
                :ref="(el) => ((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).ref = el as HTMLLabelElement"
                @keypress.enter="() => { ((format==='RANGE' || format==='MULTIPLE-OR-SINGLE') && (col as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE')? addYearByClick(((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).year, true) : ''; }"
                @click="() => { ((format==='RANGE' || format==='MULTIPLE-OR-SINGLE') && (col as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE')? addYearByClick(((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).year, true) : ''; }"
                class="w-100"
                style="float: left; line-height: 2em; height: 2em"
              >
                <input
                  @keypress.enter.stop=""
                  @click.stop=""
                  type="checkbox"
                  :value="((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).year"
                  class="position-absolute d-none"
                  style="pointer-events: auto"
                />
                <span
                  class="font-family text-center d-block letter-spacing"
                  style="font-size: 1rem; line-height: 2em; height: 2em"
                  :class="[((format==='RANGE' || format==='MULTIPLE-OR-SINGLE') && ((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE')? 'cursor-pointer' : '']"
                  :style="
                    ((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE' ? (
                      ((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'SELECTED'?
                      'background-color: green; color: #fff;'
                      : ((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).selected === 'DESELECTED'?
                        'background-color: #E8E8E8; color: black; text-shadow:none;'
                        : 'background-color: gray; color: #fff;'
                    ) : 'background-color: #fff; color: #fff; text-shadow:none;'
                  "
                >
                  {{ ((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE'? ((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).year : '' }}
                </span>
              </label>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
label input + span {
  color: #fff;
}
input:checked + span {
  color: #ffffff;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}
</style>
