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
import type { DaySelectionType, DayRangeFirstSelectionType } from "../types/days_months_years_types.vue";
import { getDayDimensions } from "../utility/days_months_years_utility_fns.vue";

const props1 = defineProps<{
  ddays: DaySelectionType;
  dformat: "RANGE" | "MULTIPLE-OR-SINGLE";
}>();

const emits = defineEmits<{
  (e: "update:days-value", action: DaySelectionType): void;
  (e: "send:daysmonthsyearsexcludecanceldonereadiness", action: {  action: boolean; score: number; }): void;
}>();

let props = inject("dayprops") as {
    format: "RANGE" | "MULTIPLE-OR-SINGLE";
    days: {
      [key: string | number]: {
        selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
        index: number;
        name: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
      }[];
    } | {};
  },
  format = ref(),
  days = shallowRef(),
  rangecount = ref(0),
  multipleselectcount = ref(0),
  rangefirstselection = ref<DayRangeFirstSelectionType>(),
  loadingMovement = ref(false),
  unwatchrangecount: WatchStopHandle,
  unwatchmultipleselectcount: WatchStopHandle,
  unwatchformat: WatchStopHandle;


function addDay(day: number) {
  if(format.value === 'RANGE') {
    if(rangecount.value < 2) {
      if(days.value[day].selected === 'DESELECTED' || days.value[day].selected === 'HIGHLIGHTED') {
        days.value[day].selected = 'SELECTED';
        rangecount.value++;
        if(rangecount.value === 1) {
          rangefirstselection.value = { day };
          trackDayBoxMouseMovement();
        }
        else {
          unTrackDayBoxMouseMovement();
          rangefirstselection.value = { day: -1 };
        }
      }
      else {
        days.value[day].selected = 'DESELECTED';
        rangefirstselection.value = { day: -1 };
        rangecount.value = 0;
        unTrackDayBoxMouseMovement();
      }
    }
    else {
      deselectAll();
      rangecount.value = 1;
      days.value[day].selected = 'SELECTED';
      rangefirstselection.value = { day };
      trackDayBoxMouseMovement();
    }
  }
  else {
    if(days.value[day].selected === 'DESELECTED') {
      days.value[day].selected = 'SELECTED';
      multipleselectcount.value++;
    }
    else {
      days.value[day].selected = 'DESELECTED';
      multipleselectcount.value--;
    }
  }
  triggerRef(days);
  emits("update:days-value", days.value);
}

function deselectAll() {
  for(let day in days.value) {
    days.value[day].selected = 'DESELECTED';
  }
}

function whereisMouse(pointx: number, pointy: number) {
  let result = {day: -1}, found = false;
  for(let day in days.value) {
    if(
      pointx >= parseFloat(days.value[day].x1)
      &&
      pointx <= parseFloat(days.value[day].x2)
    ){
      result = {
        day: parseInt(day),
      };
      found = true;
      break;
    }
  }
  return result;
}

function mouseMovement(event: { pageX: number; pageY: number; }) {
  nextTick(() => {
    if(loadingMovement.value === false) {
      loadingMovement.value = true;
      if (format.value === "RANGE") {
        if ((rangefirstselection.value as DayRangeFirstSelectionType).day > -1) {
          let mousePointed = whereisMouse(event.pageX, event.pageY);
          for(let day in days.value) {
            if(parseInt(day) > (rangefirstselection.value as DayRangeFirstSelectionType).day) {
              if(parseInt(day) <= mousePointed.day) {
                days.value[day].selected = 'HIGHLIGHTED';
              }
              else {
                if(days.value[day].selected === 'HIGHLIGHTED') {
                  days.value[day].selected = 'DESELECTED';
                }
              }
            }
            else {
              if(parseInt(day) < (rangefirstselection.value as DayRangeFirstSelectionType).day) {
                if(parseInt(day) >= mousePointed.day) {
                  days.value[day].selected = 'HIGHLIGHTED';
                }
                else {
                  if(days.value[day].selected === 'HIGHLIGHTED') {
                    days.value[day].selected = 'DESELECTED';
                  }
                }
              }
            }
          }
        }
      }
      loadingMovement.value = false;
    }
    triggerRef(days);
  });
}

function processDimensions() {
  getDayDimensions(days as ShallowRef<DaySelectionType>);
}

function unTrackDayBoxMouseMovement() {
  if (document.getElementById("daybox")) {
    (document
      .getElementById("daybox") as HTMLDivElement)
      .removeEventListener("mousemove", mouseMovement, true);
  }
}

function trackDayBoxMouseMovement() {
  if (document.getElementById("daybox")) {
    (document
      .getElementById("daybox") as HTMLDivElement)
      .addEventListener("mousemove", mouseMovement, true);
  }
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', processDimensions, true);
  window.removeEventListener('scroll', processDimensions, true);
  unTrackDayBoxMouseMovement();
  unwatchformat();
  unwatchrangecount();
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
      format.value = x;
      deselectAll();
      unTrackDayBoxMouseMovement();
      rangefirstselection.value = { day: -1 };
      rangecount.value = 0;
      multipleselectcount.value = 0;
      emits("send:daysmonthsyearsexcludecanceldonereadiness", { action: false, score: 0 });
    }
  );
  window.addEventListener('resize', processDimensions, true);
  window.addEventListener('scroll', processDimensions, true);
});

onBeforeMount(() => {
  format.value = props1.dformat;
  days.value = props1.ddays as DaySelectionType;
  rangefirstselection.value = { day: -1 };
});

</script>

<template>
  <div class="d-block">
    <div
      class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-start align-items-center w-100"
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
    <div class="d-block shadow-sm" style="height: 34px;" id="daybox">
      <div
        class="flex-box flex-direction-row flex-wrap justify-content-start align-items-center"
      >
        <template v-for="(day, dindex) in days">
          <div
            class="flex-w-14-dot-285714 overflow-hidden"
            style="float: left; outline: 1px solid #fff;"
          >
            <label
              :ref="(el) => day.ref = el as HTMLLabelElement"
              @click="() => { format==='RANGE' || format==='MULTIPLE-OR-SINGLE'? addDay(dindex) : ''; }"
              class="w-100"
              style="float: left; line-height: 2em; height: 2em;"
            >
              <input
                @click.stop=""
                type="checkbox"
                :value="day"
                class="position-absolute d-none"
                style="pointer-events: auto;"
              />
              <span
                class="font-family text-center d-block letter-spacing"
                style="font-size: 1rem; line-height: 2em; height: 2em;"
                :class="[format==='RANGE' || format==='MULTIPLE-OR-SINGLE'? 'cursor-pointer' : '']"
                :style="
                  day.selected === 'SELECTED'?
                  'background-color: green; color: #fff;'
                  : day.selected === 'DESELECTED'?
                    'background-color: #E8E8E8; color: black; text-shadow:none'
                    : 'background-color: gray; color: #fff;'
                "
              >
                {{ day.name }}
              </span>
            </label>
          </div>
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
