<script setup lang="ts">
import { computed, type WatchStopHandle, type ShallowRef, type Ref, onMounted, nextTick, ref, shallowRef, inject, onBeforeMount, watch, triggerRef, onBeforeUnmount } from "vue";
import type { YearSelectionType, YearRangeFirstSelectionType } from "../types/days_months_years_types";
import { addYear, getYearDimensions, unTrackYearBoxMouseMovement, trackYearBoxMouseMovement, deselectAll, } from "../utility/days_months_years_utility_fns";
import paste_year from "./PasteYear.vue";

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
  years = shallowRef<YearSelectionType>(),
  format = ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">(),
  page = ref(0),
  updateyyearsvalue = ref<boolean>(false),
  rangecount = ref(0),
  multipleselectcount = ref(0),
  rangefirstselection = ref<YearRangeFirstSelectionType>(),
  loadingMovement = ref(false),
  lessthan = ref(""),
  greaterthan = ref(""),
  lessthanref = ref(),
  greaterthanref = ref(),
  from = ref(""),
  to = ref(""),
  fromref = ref(),
  toref = ref(),
  unwatchrangecount: WatchStopHandle,
  unwatchmultipleselectcount: WatchStopHandle,
  unwatchformat: WatchStopHandle,
  unwatchgreaterthan: WatchStopHandle,
  unwatchlessthan: WatchStopHandle,
  unwatchfromto: WatchStopHandle;

const props1 = defineProps<{
  yyears: YearSelectionType;
  yformat: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO";
  ppage: number;
}>();

const emits = defineEmits<{
  (e: "send:daysmonthsyearsexcludecanceldonereadiness", action: {  action: boolean; score: number; }): void;
  (e: "update:yyears-and-page-value", action: {years: YearSelectionType; page: number;}): void;
  (e: "forward:format", action: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO"): void;
}>();

const compYearsLength = computed(() => {
  return Object.keys(years.value as YearSelectionType).length;
});

function processDimensions() {
  getYearDimensions(years as ShallowRef<YearSelectionType>, page as Ref<number>);
}

function addYearByClick(year: number, clickedorpasted: boolean) {
  addYear(page, rangefirstselection as Ref<YearRangeFirstSelectionType>, loadingMovement, rangecount, multipleselectcount, year, clickedorpasted, years as ShallowRef<YearSelectionType>, format as Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">);
  emits("update:yyears-and-page-value", { years: years.value as YearSelectionType, page: page.value as number });
  updateyyearsvalue.value = false;

  nextTick(() => {
    if(format.value === "MULTIPLE-OR-SINGLE") {
      updateyyearsvalue.value = true;
    }
  });
}

function updateYYearsValueFn(yearandpage: {years: YearSelectionType; page: number;}) {
  (years.value as YearSelectionType) = yearandpage.years;
  page.value = yearandpage.page;
  triggerRef(years);

  nextTick(() => {
    emits("update:yyears-and-page-value", yearandpage);
  });
}

onBeforeMount(() => {
  format.value = props1.yformat;
  years.value = props1.yyears;
  page.value = props1.ppage;
  rangefirstselection.value = { page: -1, year: -1 };
  rangecount.value = 0;
  multipleselectcount.value = 0;
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', processDimensions, true);
  window.removeEventListener('scroll', processDimensions, true);
  unTrackYearBoxMouseMovement(page, years as ShallowRef<YearSelectionType>, rangefirstselection as Ref<YearRangeFirstSelectionType>, loadingMovement, format as Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">);
  unwatchformat();
  unwatchgreaterthan();
  unwatchlessthan();
  unwatchfromto();
  unwatchmultipleselectcount();
  unwatchrangecount();
});

onMounted(() => {
  unwatchmultipleselectcount = watch(
    () => multipleselectcount.value,
    (x) => {
      if(format.value !== "RANGE") {
        if(x > 0) {
          emits("send:daysmonthsyearsexcludecanceldonereadiness", {  action: true, score: x });
        }
        else {
          emits("send:daysmonthsyearsexcludecanceldonereadiness", {  action: false, score: x });
        }
      }
    }
  );
  unwatchrangecount = watch(
    () => rangecount.value,
    (x) => {
      if (format.value === "RANGE") {
        if(x === 2) {
          emits("send:daysmonthsyearsexcludecanceldonereadiness", {  action: true, score: x });
        }
        else {
          emits("send:daysmonthsyearsexcludecanceldonereadiness", {  action: false, score: x });
        }
      }
    }
  );
  unwatchformat = watch(
    () => format.value,
    (x) => {
      deselectAll(years as ShallowRef<YearSelectionType>);
      unTrackYearBoxMouseMovement(page, years as ShallowRef<YearSelectionType>, rangefirstselection as Ref<YearRangeFirstSelectionType>, loadingMovement, format as Ref<"RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO">);
      rangefirstselection.value = { page: -1, year: -1 };
      rangecount.value = 0;
      multipleselectcount.value = 0;
      emits("send:daysmonthsyearsexcludecanceldonereadiness", {  action: false, score: 0 });
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
  unwatchfromto = watch(
    [
      () => from.value,
      () => to.value
    ],
    ([x, y]) => {
      greaterthanref.value.style.backgroundColor = '#fff';
      greaterthanref.value.style.color = 'black';
      lessthanref.value.style.backgroundColor = '#fff';
      lessthanref.value.style.color = 'black';
      deselectAll(years as ShallowRef<YearSelectionType>);
      rangefirstselection.value = { page: -1, year: -1 };
      rangecount.value = 0;
      multipleselectcount.value = 0;

      let fromfound = false, tofound = false, fromisnumber = false, toisnumber = false, fromfoundindex = -1, tofoundindex = -1;
      if(x || y) {
        nextTick(() => {
          if(y) {
            try {
              if(/^\d+$/g.test(y)) {
                toisnumber = true;
                toref.value.style.backgroundColor = '#fff';
                toref.value.style.color = 'black';
                for(let p in years.value) {
                  for(let row in years.value[parseInt(p)]) {
                    for(let col in years.value[parseInt(p)][row]) {
                      if(parseInt(y) === (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year
                        &&
                        (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE'
                      ) {
                        tofound = true;
                        tofoundindex = parseInt(p);
                        break;
                      }
                    }
                    if(tofound) break;
                  }
                  if(tofound) break;
                }
              }
              else {
                toref.value.style.backgroundColor = 'red';
                toref.value.style.color = '#fff';
                toisnumber = false;
              }
            }
            catch(ex) {
              toref.value.style.backgroundColor = 'red';
              toref.value.style.color = '#fff';
              toisnumber = false;
            }
            if(tofound == false && toisnumber) {
              deselectAll(years as ShallowRef<YearSelectionType>);
              toref.value.style.backgroundColor = '#E8E8E8';
              toref.value.style.color = 'black';
            }
          }
          else {
            toref.value.style.backgroundColor = '#fff';
            toref.value.style.color = 'black';
          }
          if(x) {
            try {
              if(/^\d+$/g.test(x)) {
                fromisnumber = true;
                fromref.value.style.backgroundColor = '#fff';
                fromref.value.style.color = 'black';
                for(let p in years.value) {
                  for(let row in years.value[parseInt(p)]) {
                    for(let col in years.value[parseInt(p)][row]) {
                      if(parseInt(x) === (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year
                        &&
                        (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE'
                      ) {
                        fromfound = true;
                        fromfoundindex = parseInt(p);
                        break;
                      }
                    }
                    if(fromfound) break;
                  }
                  if(fromfound) break;
                }
              }
              else {
                fromref.value.style.backgroundColor = 'red';
                fromref.value.style.color = '#fff';
                fromisnumber = false;
              }
            }
            catch(ex) {
              fromref.value.style.backgroundColor = 'red';
              fromref.value.style.color = '#fff';
              fromisnumber = false;
            }
            if(fromfound == false && fromisnumber) {
              deselectAll(years as ShallowRef<YearSelectionType>);
              fromref.value.style.backgroundColor = '#E8E8E8';
              fromref.value.style.color = 'black';
            }
          }
          else {
            fromref.value.style.backgroundColor = '#fff';
            fromref.value.style.color = 'black';
          }
          if((fromisnumber && fromfound) && (toisnumber && tofound)) {
            if(parseInt(from.value) < parseInt(to.value)) {
              for(let p in years.value) {
                for(let row in years.value[parseInt(p)]) {
                  for(let col in years.value[parseInt(p)][row]) {
                    if((years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year <= parseInt(to.value) && (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).year >= parseInt(from.value)) {
                      (years.value[parseInt(p)][row][col] as unknown as YearSelectionType[number][number][number][number][number][number]).selected = 'SELECTED';
                      multipleselectcount.value++;
                    }
                  }
                }
              }
              triggerRef(years);
              page.value = fromfoundindex;
            }
            else {
              fromref.value.style.backgroundColor = 'red';
              fromref.value.style.color = '#fff';
            }
          }
        });
      }
      else {
        fromref.value.style.backgroundColor = '#fff';
        fromref.value.style.color = 'black';

        toref.value.style.backgroundColor = '#fff';
        toref.value.style.color = 'black';
      }
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
        <a
          @click="
            () => {
              updateyyearsvalue = false;
              format = 'RANGE';
              from = '';
              to = '';
              greaterthan = '';
              lessthan = '';
              emits('forward:format', format);
            }
          "
          :style="
            format === 'RANGE' ? 'background-color:green;' : 'background-color:gray;'
          "
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          style="color: #fff; padding: 2px 0; border-right: 1px solid #fff"
        >
          Range
        </a>
      </div>
      <div class="flex-w-50 align-self-stretch">
        <a
          @click="
            () => {
              updateyyearsvalue = false;
              format = 'MULTIPLE-OR-SINGLE';
              from = '';
              to = '';
              greaterthan = '';
              lessthan = '';
              emits('forward:format', format);
            }
          "
          :style="
            format === 'MULTIPLE-OR-SINGLE'
              ? 'background-color:green;'
              : 'background-color:gray;'
          "
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          style="color: #fff; padding: 2px 0; border-left: 1px solid #fff"
        >
          Multiple or Single
        </a>
      </div>
    </div>
    <paste_year
      :yyears="(years as YearSelectionType)"
      :yformat="(format as 'RANGE' | 'MULTIPLE-OR-SINGLE' | 'GREATER-THAN' | 'LESS-THAN' | 'FROM-TO')"
      :updateyyearsvalue="updateyyearsvalue"
      @change:format="
        ($val) => {
          format = $val;
          updateyyearsvalue = false;
          emits('forward:format', format);
        }
      "
      @update:yyears-and-page-value="($val) => updateYYearsValueFn($val)"
    ></paste_year>
    <div
      style="padding: 0 0 7px 0"
      class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
    >
      <div class="flex-w-50 align-self-stretch" style="padding-right: 3px">
        <div
          class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
        >
          <div class="flex-w-50 align-self-stretch">
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
                    updateyyearsvalue = false;
                    greaterthan = '';
                    from = '';
                    to = '';
                    format = 'LESS-THAN';
                    emits('forward:format', format);
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
                    updateyyearsvalue = false;
                    lessthan = '';
                    from = '';
                    to = '';
                    format = 'GREATER-THAN';
                    emits('forward:format', format);
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
      </div>
      <div class="flex-w-50 align-self-stretch" style="padding-left: 3px">
        <div
          class="flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
        >
          <div class="flex-w-50 align-self-stretch">
            <div class="d-block" style="padding-bottom: 1.5px">
              <label>From</label>
            </div>
            <div class="d-block">
              <input
                :ref="
                  (el) => {
                    fromref = el;
                  }
                "
                @keydown.space.prevent
                v-model.trim="from"
                @focus="
                  () => {
                    updateyyearsvalue = false;
                    lessthan = '';
                    greaterthan = '';
                    format = 'FROM-TO';
                    emits('forward:format', format);
                  }
                "
                type="text"
                class="w-100 text-center"
                style="height: 30px"
              />
            </div>
          </div>
          <div class="flex-w-50 align-self-stretch">
            <div class="d-block" style="padding-bottom: 1.5px">
              <label>To</label>
            </div>
            <div class="d-block">
              <input
                :ref="
                  (el) => {
                    toref = el;
                  }
                "
                @keydown.space.prevent
                v-model.trim="to"
                @focus="
                  () => {
                    updateyyearsvalue = false;
                    lessthan = '';
                    greaterthan = '';
                    format = 'FROM-TO';
                    emits('forward:format', format);
                  }
                "
                type="text"
                class="w-100 text-center"
                style="height: 30px"
              />
            </div>
          </div>
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
            @click="
              () => {
                page = page - 1 < 0 ? 0 : page - 1;
                processDimensions();
              }
            "
          >
            <svg
              class="shadow"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              style="
                border-radius: 50%;
                height: 20px;
                width: 20px;
                color: #fff;
                stroke: currentcolor;
                fill: currentcolor;
              "
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
              style="
                border-radius: 50%;
                height: 20px;
                width: 20px;
                color: #fff;
                stroke: currentcolor;
                fill: currentcolor;
              "
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
                @click="() => { ((format==='RANGE' || format==='MULTIPLE-OR-SINGLE') && (col as unknown as YearSelectionType[number][number][number][number][number][number]).status === 'ENABLE')? addYearByClick(((years as YearSelectionType)[page][rindex][cindex] as unknown as YearSelectionType[number][number][number][number][number][number]).year, true) : ''; }"
                class="w-100"
                style="float: left; line-height: 2em; height: 2em"
              >
                <input
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
