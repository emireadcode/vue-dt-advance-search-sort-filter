<script setup lang="ts">
import { triggerRef, shallowRef, type WatchStopHandle, ref, watch, inject, type Ref, type ShallowRef, computed, onMounted, onBeforeUnmount, } from "vue";
import type {
  NumberType,
  SingleWordStringType,
  NumberStringType,
  NumberSearchType,
  NumberSearchExcludeEqualToType,
  AtNumber,
  CurrentAndSignalType,
  CurrentAndSignalInnerType
} from "../types/SupportedDatatypesTypeDeclaration";
import { addNewInputEntry, setTabAndResetOthers } from "../helperfunctions/addnewlypastedandnewinputentry";
import Paste from "./Paste.vue";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";

const
  currentandsignal = shallowRef<CurrentAndSignalType>({
    equalto: {
      signal: 0,
      current: 0,
      closepaste: 0,
    },
    notequalto: {
      signal: 0,
      current: 0,
      closepaste: 0,
    },
  }),
  holder = inject("mainnumbersearcherui") as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>,
  index = inject("index") as number,
  props = defineProps<{
    from: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL";
  }>(),
  emits = defineEmits<{
    (e: "reset:exclude", action: boolean): void;
  }>(),
  cards = inject("cards") as ShallowRef<NumberType[] | SingleWordStringType[] | NumberStringType[]>
;

let
  unwatchgreaterthan: WatchStopHandle,
  unwatchlessthan: WatchStopHandle,
  unwatchequalto: WatchStopHandle,
  unwatchnotequalto: WatchStopHandle,
  unwatchfromto: WatchStopHandle,
  unwatchequaltolength: WatchStopHandle,
  unwatchnotequaltolength: WatchStopHandle
;

function triggerHolder() {
  triggerRef(holder);
}

function triggerCurrentAndSignal() {
  triggerRef(currentandsignal);
}

async function addLocalNewInputEntry(
  newinputentry: string,
  inputtype: 'EQUAL-TO' | 'NOT-EQUAL-TO'
) {
  await addNewInputEntry(
    newinputentry,
    inputtype,
    currentandsignal as ShallowRef<CurrentAndSignalType>,
    holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>,
    props.from
  );
}

async function addPastedItems(pasteditems: string[][], inputtype: 'NOT-EQUAL-TO' | 'EQUAL-TO') {
  let time: NodeJS.Timeout[] = [], timeIndex = 0, ccurrent = ref(-1);
  for(let i=0; i<pasteditems.length; i++) {
    let item = pasteditems[i];
    if (item[1] !== "ERROR") {
      time[timeIndex] = setTimeout(async () => {
        await addNewInputEntry(
          item[0],
          inputtype,
          currentandsignal as ShallowRef<CurrentAndSignalType>,
          holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>,
          props.from
        );
        clearTimeout(time[timeIndex]);
      }, 10);
      timeIndex++;
    }
  }
  (inputtype==='EQUAL-TO')? 
    ((currentandsignal.value as CurrentAndSignalType).equalto as CurrentAndSignalInnerType).closepaste++
    : 
    ((currentandsignal.value as CurrentAndSignalType).notequalto as CurrentAndSignalInnerType).closepaste++
  ;
  triggerRef(currentandsignal);
}

const equaltoAddNew = computed(() => {
  return props.from === "NUMBER-SEARCHER-MODAL"?
    (
      parseFloat(
        (holder.value as NumberType['search']).equalto.single as string
      ) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(
        (holder.value as NumberType['search']).equalto.single as string
      ) >= parseFloat(cards.value[index].result.min)
    )
    :
    (/^\s*\d+\s*$/g.test((holder.value as AtNumber<NumberSearchType>).search.equalto.single))
    ;
});

const notequaltoAddNew = computed(() => {
  return props.from === "NUMBER-SEARCHER-MODAL"?
    (
      parseFloat(
        (holder.value as NumberType['search']).notequalto.single as string
      ) <= parseFloat(cards.value[index].result.max) &&
      parseFloat(
        (holder.value as NumberType['search']).notequalto.single as string
      ) >= parseFloat(cards.value[index].result.min)
    )
    :
    (/^\s*\d+\s*$/g.test((holder.value as AtNumber<NumberSearchType>).search.notequalto.single))
    ;
});

onMounted(() => {
  unwatchgreaterthan = watch(
    () => ((props.from === "NUMBER-SEARCHER-MODAL")? (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).greaterthan,
    (x) => {
      if(x.trim().length > 0 && /^\s*\d+\s*$/g.test(x)) {
        setTabAndResetOthers('GREATER-THAN', holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>, props.from);
        if(props.from === "NUMBER-SEARCHER-MODAL") {
          emits("reset:exclude", true);
        }
      }
    }
  );
  unwatchlessthan = watch(
    () => ((props.from === "NUMBER-SEARCHER-MODAL")? (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).lessthan,
    (x) => {
      if(x.trim().length > 0 && /^\s*\d+\s*$/g.test(x)) {
        setTabAndResetOthers('LESS-THAN', holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>, props.from);
        if(props.from === "NUMBER-SEARCHER-MODAL") {
          emits("reset:exclude", true);
        }
      }
    }
  );
  unwatchequalto = watch(
    () => ((props.from === "NUMBER-SEARCHER-MODAL")? (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.single,
    (x) => {
      if(x.trim().length > 0 && /^\s*\d+\s*$/g.test(x)) {
        setTabAndResetOthers('EQUAL-TO', holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>, props.from);
        if(props.from === "NUMBER-SEARCHER-MODAL") {
          emits("reset:exclude", true);
        }
      }
    }
  );
  unwatchnotequalto = watch(
    () => ((props.from === "NUMBER-SEARCHER-MODAL")? (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.single,
    (x) => {
      if(x.trim().length > 0 && /^\s*\d+\s*$/g.test(x)) {
        setTabAndResetOthers('NOT-EQUAL-TO', holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>, props.from);
        if(props.from === "NUMBER-SEARCHER-MODAL") {
          emits("reset:exclude", true);
        }
      }
    }
  );
  unwatchfromto = watch(
    [
      () => ((props.from === "NUMBER-SEARCHER-MODAL")? (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.from,
      () => ((props.from === "NUMBER-SEARCHER-MODAL")? (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).fromto.to
    ],
    ([x, y]) => {
      if((x.trim().length > 0 && y.trim().length > 0) && (/^\s*\d+\s*$/g.test(x) && /^\s*\d+\s*$/g.test(y))) {
        setTabAndResetOthers('FROM-TO', holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>, props.from);
        if(props.from === "NUMBER-SEARCHER-MODAL") {
          emits("reset:exclude", true);
        }
      }
    }
  );
  unwatchequaltolength = watch(
    () => ((props.from === "NUMBER-SEARCHER-MODAL")? (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).equalto.pages.length,
    (x) => {
      setTabAndResetOthers('EQUAL-TO', holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>, props.from);
      if(props.from === "NUMBER-SEARCHER-MODAL") {
        emits("reset:exclude", true);
      }
    }
  );
  unwatchnotequaltolength = watch(
    () => ((props.from === "NUMBER-SEARCHER-MODAL")? (holder.value as NumberType['search']) : (holder.value as AtNumber<NumberSearchType>).search).notequalto.pages.length,
    (x) => {
      setTabAndResetOthers('NOT-EQUAL-TO', holder as ShallowRef<NumberType['search'] | AtNumber<NumberSearchType>>, props.from);
      if(props.from === "NUMBER-SEARCHER-MODAL") {
        emits("reset:exclude", true);
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
  unwatchequaltolength();
  unwatchnotequaltolength();
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
                @input="triggerHolder()"
                v-model="((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).greaterthan"
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
                @input="triggerHolder()"
                v-model="((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).lessthan"
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
                        (((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).equalto as NumberSearchExcludeEqualToType).single,
                        'EQUAL-TO'
                      )
                      :
                      ''
                  "
                  @input="triggerHolder()"
                  v-model="(((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).equalto as NumberSearchExcludeEqualToType).single"
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
                        (((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).equalto as NumberSearchExcludeEqualToType).single,
                        'EQUAL-TO'
                      )
                      :
                      ''
                  "
                  @click="
                    equaltoAddNew?
                      addLocalNewInputEntry(
                        (((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).equalto as NumberSearchExcludeEqualToType).single,
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
              :receiveclosepastemodalsignal="((currentandsignal as CurrentAndSignalType).equalto as CurrentAndSignalInnerType).closepaste"
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
                      class="d-inline-block align-middle shadow-sm"
                      style="background-color: #fff; width: 15px; height: 15px"
                    ></div>
                    Valid
                  </div>
                  <div class="flex-fill text-center">
                    <div
                      class="d-inline-block align-middle shadow-sm"
                      style="background-color: red; width: 15px; height: 15px"
                    ></div>
                    Invalid
                  </div>
                </div>
              </template>
            </Paste>
            <PastedItemAndNewlyInputedEntryDisplayer
              :current="[((currentandsignal as CurrentAndSignalType).equalto as CurrentAndSignalInnerType).signal, ((currentandsignal as CurrentAndSignalType).equalto as CurrentAndSignalInnerType).current]"
              :tree="((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).equalto"
              treetype="NumberSearchExcludeEqualToType"
              :display-area-height="'height: 157.9px;'"
              :scrollareaid="cards[index].scroll.areaid+'-equal-to'"
              @update:current="($val) => {((currentandsignal as CurrentAndSignalType).equalto as CurrentAndSignalInnerType).current = $val; ((currentandsignal as CurrentAndSignalType).equalto as CurrentAndSignalInnerType).signal++; triggerCurrentAndSignal(); }"
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
                        (((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).notequalto as NumberSearchExcludeEqualToType).single,
                        'NOT-EQUAL-TO'
                      )
                      :
                      ''
                  "
                  @input="triggerHolder()"
                  v-model="(((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).notequalto as NumberSearchExcludeEqualToType).single"
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
                        (((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).notequalto as NumberSearchExcludeEqualToType).single,
                        'NOT-EQUAL-TO'
                      )
                      :
                      ''
                  "
                  @click="
                    notequaltoAddNew?
                      addLocalNewInputEntry(
                        (((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).notequalto as NumberSearchExcludeEqualToType).single,
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
              :receiveclosepastemodalsignal="((currentandsignal as CurrentAndSignalType).notequalto as CurrentAndSignalInnerType).closepaste"
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
                    <div class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center">
                      <div
                        class="flex-grow-0 flex-shrink-0 shadow-sm"
                        style="background-color: #fff; width: 18px; height: 18px"
                      ></div>
                      <div class="font-family flex-grow-0 flex-shrink-0" style="padding-left:3px;">Valid</div>
                    </div>
                  </div>
                  <div class="flex-fill text-center">
                    <div class="flex-box flex-direction-row flex-nowrap justify-content-center align-items-center">
                      <div
                        class="flex-grow-0 flex-shrink-0 shadow-sm"
                        style="background-color: red; width: 18px; height: 18px"
                      ></div>
                      <div class="font-family flex-grow-0 flex-shrink-0" style="padding-left:3px;">Invalid</div>
                    </div>
                  </div>
                </div>
              </template>
            </Paste>
            <PastedItemAndNewlyInputedEntryDisplayer
              :current="[((currentandsignal as CurrentAndSignalType).notequalto as CurrentAndSignalInnerType).signal, ((currentandsignal as CurrentAndSignalType).notequalto as CurrentAndSignalInnerType).current]"
              :tree="((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).notequalto"
              treetype="NumberSearchExcludeEqualToType"
              :display-area-height="'height: 157.9px;'"
              :scrollareaid="cards[index].scroll.areaid+'-not-equal-to'"
              @update:current="($val) => {((currentandsignal as CurrentAndSignalType).notequalto as CurrentAndSignalInnerType).current = $val; ((currentandsignal as CurrentAndSignalType).notequalto as CurrentAndSignalInnerType).signal++; triggerCurrentAndSignal(); }"
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
            @input="triggerHolder()"
            v-model="(((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).fromto as NumberSearchType['fromto']).from"
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
            @input="triggerHolder()"
            v-model.trim="(((props.from === 'NUMBER-SEARCHER-MODAL')? (holder as NumberType['search']) : (holder as AtNumber<NumberSearchType>).search).fromto as NumberSearchType['fromto']).to"
            type="text"
            class="w-100 text-left"
            style="height: 30px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
