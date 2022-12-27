<script setup lang="ts">
import { type WatchStopHandle, ref, watch, inject, type Ref, type ShallowRef, computed, onMounted, onBeforeUnmount, } from "vue";
import type {
  NumberType, 
  SingleWordStringType, 
  NumberStringType, 
  NumberSearchType,
  NumberSearchExcludeEqualToType,
  AtNumber,
} from "../types/SupportedDatatypesTypeDeclaration";
import { addNewInputEntry, setTabAndResetOthers } from "../helperfunctions/addnewlypastedandnewinputentry";
import Paste from "./Paste.vue";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";

const
  closeequaltopastemodalsignal = ref(0),
  closenotequaltopastemodalsignal = ref(0),
  equaltocurrent = ref(0),
  notequaltocurrent = ref(0),
  holder = inject("mainnumbersearcherui") as Ref<NumberType['search'] | AtNumber<NumberSearchType>>,
  index = inject("index") as number,
  props = defineProps<{
    from: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL";
  }>(),
  emits = defineEmits<{
    (e: "reset:exclude", action: boolean): void;
  }>(),
  cards = inject("cards") as ShallowRef<NumberType[] | SingleWordStringType[] | NumberStringType[]>
;

console.log((holder.value as AtNumber<NumberSearchType>).search.equalto.single);

let
  unwatchgreaterthan: WatchStopHandle,
  unwatchlessthan: WatchStopHandle,
  unwatchequalto: WatchStopHandle,
  unwatchnotequalto: WatchStopHandle,
  unwatchfromto: WatchStopHandle
;

async function addLocalNewInputEntry(
  newinputentry: string,
  inputtype: 'EQUAL-TO' | 'NOT-EQUAL-TO'
) {
  await addNewInputEntry(
    newinputentry,
    inputtype,
    (inputtype==='EQUAL-TO')? equaltocurrent : notequaltocurrent,
    holder as Ref<NumberType['search'] | AtNumber<NumberSearchType>['search']>
  );
}

async function addPastedItems(pasteditems: string[][], inputtype: 'NOT-EQUAL-TO' | 'EQUAL-TO') {
  let time: NodeJS.Timeout[] = [], timeIndex = 0;
  for(let i=0; i<pasteditems.length; i++) {
    let item = pasteditems[i];
    if (item[1] !== "ERROR") {
      time[timeIndex] = setTimeout(async () => {
        await addNewInputEntry(
          item[0],
          inputtype,
          (inputtype==='EQUAL-TO')? equaltocurrent : notequaltocurrent,
          holder as Ref<NumberType['search']>
        );
        clearTimeout(time[timeIndex]);
      }, 10);
      timeIndex++;
    }
  }
  (inputtype==='NOT-EQUAL-TO')?
    closenotequaltopastemodalsignal.value++
    :closeequaltopastemodalsignal.value++
}

const equaltoAddNew = computed(() => {
  return (
    parseFloat(
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.single as string
    ) <= parseFloat(cards.value[index].result.max) &&
    parseFloat(
      (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.single as string
    ) >= parseFloat(cards.value[index].result.min)
  );
});

const notequaltoAddNew = computed(() => {
  return (
    parseFloat((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.single as string) <= parseFloat(cards.value[index].result.max) &&
    parseFloat((holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.single as string) >= parseFloat(cards.value[index].result.min)
  );
});

onMounted(() => {
  console.log(holder.value);
  unwatchgreaterthan = watch(
    () => (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).greaterthan,
    (x) => {
      if(x.trim().length > 0) {
        setTabAndResetOthers('GREATER-THAN', holder as Ref<NumberType['search'] | AtNumber<NumberSearchType>['search']>);
      }
    }
  );
  unwatchlessthan = watch(
    () => (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).lessthan,
    (x) => {
      if(x.trim().length > 0) {
        setTabAndResetOthers('LESS-THAN', holder as Ref<NumberType['search'] | AtNumber<NumberSearchType>['search']>);
      }
    }
  );
  unwatchequalto = watch(
    () => (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto.single,
    (x) => {
      if(x.trim().length > 0) {
        setTabAndResetOthers('EQUAL-TO', holder as Ref<NumberType['search'] | AtNumber<NumberSearchType>['search']>);
      }
    }
  );
  unwatchnotequalto = watch(
    () => (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto.single,
    (x) => {
      if(x.trim().length > 0) {
        setTabAndResetOthers('NOT-EQUAL-TO', holder as Ref<NumberType['search'] | AtNumber<NumberSearchType>['search']>);
      }
    }
  );
  unwatchfromto = watch(
    [
      () => (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.from,
      () => (holder.value as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto.to
    ],
    ([x, y]) => {
      if(x.trim().length > 0 || y.trim().length > 0) {
        setTabAndResetOthers('FROM-TO', holder as Ref<NumberType['search'] | AtNumber<NumberSearchType>['search']>);
      }
    }
  );
});

onBeforeUnmount(() => {
  unwatchgreaterthan();
  unwatchlessthan();
  unwatchequalto();
  unwatchnotequalto();
  unwatchfromto();
});

</script>

<template>
  <div class="d-block" style="z-index: 8992;padding: 0 2px">
    <div class="d-block" style="padding: 0 0 15px 0">
      <div
        class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
      >
        <div class="flex-w-50" style="padding-right: 5px">
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
                @keydown.space.prevent
                v-model.trim="(holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).greaterthan"
                type="text"
                class="w-100 text-left"
                style="height: 30px"
              />
            </div>
          </div>
        </div>
        <div class="flex-w-50" style="padding-left: 5px">
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
                @keydown.space.prevent
                v-model.trim="(holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).lessthan"
                type="text"
                class="w-100 text-left"
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
        <div class="flex-w-50" style="padding-right: 5px">
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
                  @keydown.space.prevent
                  @keypress.enter="
                    equaltoAddNew?
                      addLocalNewInputEntry(
                        ((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto as NumberSearchExcludeEqualToType).single,
                        'EQUAL-TO'
                      )
                      :
                      ''
                  "
                  v-model.trim="((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto as NumberSearchExcludeEqualToType).single"
                  type="text"
                  class="w-100 text-left"
                  style="height: 30px; z-index: 1110"
                />
              </div>
              <div
                class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
              >
                <button
                  :disabled="equaltoAddNew ? false : true"
                  @keypress.enter="
                    equaltoAddNew?
                      addLocalNewInputEntry(
                        ((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto as NumberSearchExcludeEqualToType).single,
                        'EQUAL-TO'
                      )
                      :
                      ''
                  "
                  @click="
                    equaltoAddNew?
                      addLocalNewInputEntry(
                        ((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto as NumberSearchExcludeEqualToType).single,
                        'EQUAL-TO'
                      )
                      :
                      ''
                  "
                  class="btn w-100 text-center"
                  :class="[
                    equaltoAddNew? 'cursor-pointer' : ''
                  ]"
                  :style="
                    equaltoAddNew
                    ? 'background-color: #F0E68C;'
                    : 'background-color:#eee;'
                  "
                  style="height:30px; padding:0 2px;"
                >
                  <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                </button>
              </div>
            </div>
            <Paste
              :breakdescription="(true as boolean)"
              :from="props.from"
              :receiveclosepastemodalsignal="closeequaltopastemodalsignal"
              title="numbers"
              :datatype="props.from === 'NUMBER-SEARCHER-MODAL'? 'Number' : 'NumberFromNumberString'"
              :max="(cards[index].result.max as string)"
              :min="(cards[index].result.min as string)"
              :text-area-height="'height:180px;'"
              @return:newlypasteditems="$val => { addPastedItems($val, 'EQUAL-TO'); }"
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
            <PastedItemAndNewlyInputedEntryDisplayer
              :current="equaltocurrent"
              @update:current="$val => equaltocurrent = $val"
              :tree="(holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).equalto"
              treetype="NumberSearchExcludeEqualToType"
              :display-area-height="'height: 157.9px;'"
              :scrollareaid="cards[index].scroll.areaid+'-equal-to'"
            ></PastedItemAndNewlyInputedEntryDisplayer>
          </div>
        </div>
        <div class="flex-w-50" style="padding-left: 5px">
          <div class="d-block shadow-sm" style="padding: 5px">
            <div class="d-block" style="padding-bottom: 5px">
              <img
                src="/src/assets/icons/not-equal-to.png"
                class="align-middle"
                style="width:24px;height:24px;"
              />
            </div>
            <div
              class="shadow-sm flex-box flex-direction-row w-100 flex-nowrap justify-content-center align-items-center"
            >
              <div class="flex-fill p-0 m-0 align-self-stretch" style="padding-right:2px;">
                <input
                  @keydown.space.prevent
                  @keypress.enter="
                    notequaltoAddNew?
                      addLocalNewInputEntry(
                        ((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto as NumberSearchExcludeEqualToType).single,
                        'NOT-EQUAL-TO'
                      )
                      :
                      ''
                  "
                  v-model.trim="((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto as NumberSearchExcludeEqualToType).single"
                  type="text"
                  class="w-100 text-left"
                  style="height: 30px; z-index: 1110"
                />
              </div>
              <div
                class="flex-w-1-dot-75-rem p-0 m-0 align-self-stretch"
                style="background-color: #eee; outline: 1px solid rgba(0, 0, 0, 0.2)"
              >
                <button
                  :disabled="notequaltoAddNew ? false : true"
                  @keypress.enter="
                    notequaltoAddNew?
                      addLocalNewInputEntry(
                        ((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto as NumberSearchExcludeEqualToType).single,
                        'NOT-EQUAL-TO'
                      )
                      :
                      ''
                  "
                  @click="
                    notequaltoAddNew?
                      addLocalNewInputEntry(
                        ((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto as NumberSearchExcludeEqualToType).single,
                        'NOT-EQUAL-TO'
                      )
                      :
                      ''
                  "
                  class="btn w-100 text-center"
                  :class="[
                    notequaltoAddNew? 'cursor-pointer' : ''
                  ]"
                  :style="
                    notequaltoAddNew
                    ? 'background-color: #F0E68C;'
                    : 'background-color:#eee;'
                  "
                  style="height:30px; padding:0 2px;"
                >
                  <img src="/src/assets/icons/add.png" class="wh-1-dot-25-rem align-middle" />
                </button>
              </div>
            </div>
            <Paste
              :breakdescription="(true as boolean)"
              :from="props.from"
              :receiveclosepastemodalsignal="closenotequaltopastemodalsignal"
              title="numbers"
              :datatype="props.from === 'NUMBER-SEARCHER-MODAL'? 'Number' : 'NumberFromNumberString'"
              :max="(cards[index].result.max as string)"
              :min="(cards[index].result.min as string)"
              :text-area-height="'height:180px;'"
              @return:newlypasteditems="$val => { addPastedItems($val, 'NOT-EQUAL-TO'); }"
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
            <PastedItemAndNewlyInputedEntryDisplayer
              :current="notequaltocurrent"
              @update:current="$val => notequaltocurrent = $val"
              :tree="(holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).notequalto"
              treetype="NumberSearchExcludeEqualToType"
              :display-area-height="'height: 157.9px;'"
              :scrollareaid="cards[index].scroll.areaid+'-not-equal-to'"
            ></PastedItemAndNewlyInputedEntryDisplayer>
          </div>
        </div>
      </div>
    </div>
    <div 
      style="padding: 5px;"
      class="shadow-sm flex-box flex-direction-row flex-nowrap justify-content-center align-items-center"
    >
      <div class="flex-grow-1 flex-shrink-1">
        <div class="d-block" style="padding-bottom: 5px">
          <label>From</label>
        </div>
        <div class="d-block">
          <input
            @keydown.space.prevent
            v-model.trim="((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto as NumberSearchType['fromto']).from"
            type="text"
            class="w-100 text-left"
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
            v-model.trim="((holder as NumberType['search'] | AtNumber<NumberSearchType>['search']).fromto as NumberSearchType['fromto']).to"
            type="text"
            class="w-100 text-left"
            style="height: 30px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
