<script setup lang="ts">
import { 
  inject,
  watch,
  nextTick,
  ref,
  shallowRef,
  onMounted,
  onBeforeMount,
  onBeforeUnmount,
  triggerRef,
  type WatchStopHandle,
  type ShallowRef,
} from "vue";
import type { MonthSelectionType, MonthRangeFirstSelectionType } from "../types/days_months_years_types";
import { getMonthDimensions } from "../utility/days_months_years_utility_fns";

const props1 = defineProps<{
  mmonths: MonthSelectionType;
  mformat: "RANGE" | "MULTIPLE-OR-SINGLE";
}>();

const emits = defineEmits<{
  (e: "update:months-value", action: MonthSelectionType): void;
  (e: "send:daysmonthsyearsexcludecanceldonereadiness", action: { action: boolean; score: number; }): void;
}>();

let props = inject("monthprops") as {
    format: "RANGE" | "MULTIPLE-OR-SINGLE";
    months: {
      [key: string | number]: {
        selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
        index: number;
        name: "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
      }[];
    } | {};
  },
  format = ref(),
  months = shallowRef(),
  rangecount = ref(0),
  multipleselectcount = ref(0),
  rangefirstselection = ref<MonthRangeFirstSelectionType>(),
  loadingMovement = ref(false),
  unwatchrangecount: WatchStopHandle,
  unwatchmultipleselectcount: WatchStopHandle,
  unwatchformat: WatchStopHandle;

function addMonth(month: number) {
  let found = false;
  for(let row in months.value) {
    for(let col in months.value[row]) {
      if(months.value[row][col].monthnumber === month) {
        if(format.value === 'RANGE') {
          if(rangecount.value < 2) {
            if(months.value[row][col].selected === 'DESELECTED' || months.value[row][col].selected === 'HIGHLIGHTED') {
              months.value[row][col].selected = 'SELECTED';
              rangecount.value++;
              if(rangecount.value === 1) {
                rangefirstselection.value = { month };
                trackMonthBoxMouseMovement();
              }
              else {
                unTrackMonthBoxMouseMovement();
                rangefirstselection.value = { month: -1 };
              }
            }
            else {
              months.value[row][col].selected = 'DESELECTED';
              rangefirstselection.value = { month: -1 };
              rangecount.value = 0;
              unTrackMonthBoxMouseMovement();
            }
          }
          else {
            deselectAll();
            rangecount.value = 1;
            months.value[row][col].selected = 'SELECTED';
            rangefirstselection.value = { month };
            trackMonthBoxMouseMovement();
          }
        }
        else {
          if(months.value[row][col].selected === 'DESELECTED') {
            months.value[row][col].selected = 'SELECTED';
            multipleselectcount.value++;
          }
          else {
            months.value[row][col].selected = 'DESELECTED';
            multipleselectcount.value--;
          }
        }
        found = true;
        break;
      }
    }
    if(found) break;
  }
  triggerRef(months);
  
  emits("update:months-value", months.value);
}

function deselectAll() {
  for(let row in months.value) {
    for(let col in months.value[row]) {
      months.value[row][col].selected = 'DESELECTED';
    }
  }
}

function whereisMouse(pointx: number, pointy: number) {
  let result = {month: -1, row: -1, col: -1}, found = false;
  for(let row in months.value) {
    for(let col in months.value[row]) {
      if(
        (
          parseInt(row) === 0
          && (
            pointy <= parseFloat(months.value[row][col].y1)
            &&
            pointx >= parseFloat(months.value[row][col].x1)
            &&
            pointx <= parseFloat(months.value[row][col].x2)
          )
        )
        ||
        (
          (parseInt(row) === Object.keys(months.value).length - 1)
          && (
            pointx >= parseFloat(months.value[row][col].x1)
            &&
            pointx <= parseFloat(months.value[row][col].x2)
          )
        )
        ||
        (
          (parseInt(row) !== Object.keys(months.value).length - 1)
          && (
            pointx >= parseFloat(months.value[row][col].x1)
            &&
            pointx <= parseFloat(months.value[row][col].x2)
            &&
            pointy >= parseFloat(months.value[row][col].y1)
            &&
            pointy <= parseFloat(months.value[row][col].y2)
          )
        )
      ) {
        result = {
          month: parseInt(months.value[row][col].monthnumber),
          row: parseInt(row),
          col: parseInt(col),
        };
        found = true;
        break;
      }
    }
    if(found) break;
  }
  return result;
}

function mouseMovement(event: { pageX: number; pageY: number; }) {
  nextTick(() => {
    if(loadingMovement.value === false) {
      loadingMovement.value = true;
      if (format.value === "RANGE") {
        if ((rangefirstselection.value as MonthRangeFirstSelectionType).month > -1) {
          let mousePointed = whereisMouse(event.pageX, event.pageY);
          for(let row in months.value) {
            for(let col in months.value[row]) {
              if(parseInt(months.value[row][col].monthnumber) > (rangefirstselection.value as MonthRangeFirstSelectionType).month) {
                if(parseInt(months.value[row][col].monthnumber) <= mousePointed.month) {
                  months.value[row][col].selected = 'HIGHLIGHTED';
                }
                else {
                  if(months.value[row][col].selected === 'HIGHLIGHTED') {
                    months.value[row][col].selected = 'DESELECTED';
                  }
                }
              }
              else {
                if(parseInt(months.value[row][col].monthnumber) < (rangefirstselection.value as MonthRangeFirstSelectionType).month) {
                  if(parseInt(months.value[row][col].monthnumber) >= mousePointed.month) {
                    months.value[row][col].selected = 'HIGHLIGHTED';
                  }
                  else {
                    if(months.value[row][col].selected === 'HIGHLIGHTED') {
                      months.value[row][col].selected = 'DESELECTED';
                    }
                  }
                }
              }
            }
          }
        }
      }
      loadingMovement.value = false;
    }
    triggerRef(months);
  });
}

function processDimensions() {
  getMonthDimensions(months as ShallowRef<MonthSelectionType>);
}

function unTrackMonthBoxMouseMovement() {
  if (document.getElementById("monthbox")) {
    (document
      .getElementById("monthbox") as HTMLDivElement)
      .removeEventListener("mousemove", mouseMovement, true);
  }
}

function trackMonthBoxMouseMovement() {
  if (document.getElementById("monthbox")) {
    (document
      .getElementById("monthbox") as HTMLDivElement)
      .addEventListener("mousemove", mouseMovement, true);
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', processDimensions, true);
  window.removeEventListener('scroll', processDimensions, true);
  unTrackMonthBoxMouseMovement();
  unwatchformat();
  unwatchrangecount();
  unwatchmultipleselectcount();
});

onMounted(() => {
  unwatchmultipleselectcount = watch(
    () => multipleselectcount.value,
    (x) => {
      if(format.value === "MULTIPLE-OR-SINGLE") {
        if(x > 0) {
          emits("send:daysmonthsyearsexcludecanceldonereadiness", { action: true, score: x });
        }
        else {
          emits("send:daysmonthsyearsexcludecanceldonereadiness", { action: false, score: x });
        }
      }
    }
  );
  unwatchrangecount = watch(
    () => rangecount.value,
    (x) => {
      if (format.value === "RANGE") {
        if(x === 2) {
          emits("send:daysmonthsyearsexcludecanceldonereadiness", { action: true, score: x });
        }
        else {
          emits("send:daysmonthsyearsexcludecanceldonereadiness", { action: false, score: x });
        }
      }
    }
  );
  unwatchformat = watch(
    () => format.value,
    (x) => {
      deselectAll();
      unTrackMonthBoxMouseMovement();
      rangefirstselection.value = { month: -1 };
      rangecount.value = 0;
      multipleselectcount.value = 0;
      emits("send:daysmonthsyearsexcludecanceldonereadiness", { action: false, score: 0 });
    }
  );
  window.addEventListener('resize', processDimensions, true);
  window.addEventListener('scroll', processDimensions, true);
});

onBeforeMount(() => {
  format.value = props1.mformat;
  months.value = props1.mmonths as MonthSelectionType;
  rangefirstselection.value = { month: -1 };
});

</script>

<template>
  <div class="d-block">
    <div
      class="flex-box shadow-sm flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
      style="border: 1px solid gray"
    >
      <div class="flex-w-50">
        <a
          @click="format = 'RANGE'"
          :style="
            format === 'RANGE' ? 'background-color:green;' : 'background-color:gray;'
          "
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          style="color: #fff; padding: 2px 0"
        >
          Range
        </a>
      </div>
      <div class="flex-w-50">
        <a
          @click="format = 'MULTIPLE-OR-SINGLE'"
          :style="
            format === 'MULTIPLE-OR-SINGLE'
              ? 'background-color:green;'
              : 'background-color:gray;'
          "
          class="font-family letter-spacing cursor-pointer d-block underline-none"
          style="color: #fff; padding: 2px 0"
        >
          Multiple or Single
        </a>
      </div>
    </div>
    <div class="d-block shadow-sm" style="height: 98px;" id="monthbox">
      <div
        class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
      >
        <template v-for="(row, rindex) in months">
          <template v-for="(col, cindex) in row">
            <div
              class="flex-w-25 overflow-hidden"
              style="float: left; outline: 1px solid #fff;"
            >
              <label
                :ref="(el) => months[rindex][cindex].ref = el as HTMLLabelElement"
                @click="() => { format==='RANGE' || format==='MULTIPLE-OR-SINGLE'? addMonth(months[rindex][cindex].monthnumber) : ''; }"
                class="w-100"
                style="float: left; line-height: 2em; height: 2em;"
              >
                <input
                  @click.stop=""
                  type="checkbox"
                  :value="months[rindex][cindex].monthnumber"
                  class="position-absolute d-none"
                  style="pointer-events: auto;"
                />
                <span
                  class="font-family text-center d-block letter-spacing"
                  style="font-size: 1rem; line-height: 2em; height: 2em;"
                  :class="[format==='RANGE' || format==='MULTIPLE-OR-SINGLE'? 'cursor-pointer' : '']"
                  :style="
                    months[rindex][cindex].selected === 'SELECTED'?
                    'background-color: green; color: #fff;'
                    : months[rindex][cindex].selected === 'DESELECTED'?
                      'background-color: #E8E8E8; color: black; text-shadow:none'
                      : 'background-color: gray; color: #fff;'
                  "
                >
                  {{ months[rindex][cindex].monthname }}
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

/* This will declare how a selected input will look giving generic properties */
input:checked + span {
  color: #ffffff;
  text-shadow: 0 0 6px rgba(0, 0, 0, 0.8);
}
</style>
