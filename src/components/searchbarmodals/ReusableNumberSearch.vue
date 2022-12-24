<script setup lang="ts">
import { ref, watch, inject, type Ref, type ShallowRef, computed, triggerRef, } from "vue";
import type {
  NumberType, 
  SingleWordStringType, 
  NumberStringType, 
  NumberSearchType,
  NumberSearchExcludeEqualToType,
} from "../types/SupportedDatatypesTypeDeclaration";
import { addNewInputEntry } from "../helperfunctions/addnewlypastedandnewinputentry";
import Paste from "./Paste.vue";
import PastedItemAndNewlyInputedEntryDisplayer from "./PastedItemAndNewlyInputedEntryDisplayer.vue";

const
  closeequaltopastemodalsignal = ref(0),
  equaltonewlypasteditems = ref(),
  closenotequaltopastemodalsignal = ref(0),
  notequaltonewlypasteditems = ref(),
  holder = inject("mainnumbersearcherui") as Ref<NumberType['search']>,
  index = inject("index") as number,
  props = defineProps<{
    from: "NUMBER-SEARCHER-MODAL" | "NUMBER-STRING-OR-SINGLE-WORD-STRING-SEARCHER-MODAL";
  }>(),
  emits = defineEmits<{
    (e: "reset:exclude", action: boolean): void;
  }>(),
  cards = inject("cards") as ShallowRef<NumberType[] | SingleWordStringType[] | NumberStringType[]>
;

function localResetOthers(
  operator: "EQUAL-TO" | "NOT-EQUAL-TO" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO"
) {
  /*resetOthers(
    operator,
    holder
  );

  if(props.from === "NUMBER-SEARCHER-MODAL") {
    emits("reset:exclude", true);
  }*/
}

function addLocalNewInputEntry(
  nonerangeorrange: 'NONE-RANGE',
  newinputentry: string,
  inputtype: 'EQUAL-TO' | 'NOT-EQUAL-TO'
) {
  addNewInputEntry(
    nonerangeorrange,
    newinputentry,
    inputtype,
    holder as Ref<NumberType['search']>
  );
}

function localDeleteSaved(
  index: number, 
  operator: "EQUAL-TO" | "NOT-EQUAL-TO"
) {
  /*deleteSaved(
    index,
    operator,
    holder
  );*/
}

const equaltoAddNew = computed(() => {
  return (
    parseFloat(holder.value?.equalto?.single as string) <= parseFloat(cards.value[index].result.max) &&
    parseFloat(holder.value?.equalto?.single as string) >= parseFloat(cards.value[index].result.min)
  );
});

const notequaltoAddNew = computed(() => {
  return (
    parseFloat(holder.value?.notequalto?.single as string) <= parseFloat(cards.value[index].result.max) &&
    parseFloat(holder.value?.notequalto?.single as string) >= parseFloat(cards.value[index].result.min)
  );
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
                @keyup="localResetOthers('GREATER-THAN')"
                @keydown.space.prevent
                v-model.trim="holder.greaterthan"
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
                @keyup="localResetOthers('LESS-THAN')"
                @keydown.space.prevent
                v-model.trim="holder.lessthan"
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
                  @keyup="localResetOthers('EQUAL-TO')"
                  @keydown.space.prevent
                  v-model.trim="(holder?.equalto as NumberSearchExcludeEqualToType).single"
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
                  @click="
                    addLocalNewInputEntry(
                      'NONE-RANGE',
                      (holder?.equalto as NumberSearchExcludeEqualToType).single,
                      'EQUAL-TO'
                    )
                  "
                  class="btn w-100"
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
              :from="props.from"
              :receiveclosepastemodalsignal="closeequaltopastemodalsignal"
              title="numbers"
              :datatype="cards[index].info.datatype as 'Number' | 'NumberString'"
              :max="(cards[index].result.max as string)"
              :min="(cards[index].result.min as string)"
              :text-area-height="'height:450px;'"
              @return:newlypasteditems="$val => { equaltonewlypasteditems = $val; }"
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
              :tree="holder.equalto"
              treetype="NumberSearchExcludeEqualToType"
              :display-area-height="'height: 167.9px;'"
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
                  @keyup="localResetOthers('NOT-EQUAL-TO')"
                  @keydown.space.prevent
                  v-model.trim="(holder?.notequalto as NumberSearchExcludeEqualToType).single"
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
                  @click="
                    addLocalNewInputEntry(
                      'NONE-RANGE',
                      (holder?.notequalto as NumberSearchExcludeEqualToType).single,
                      'NOT-EQUAL-TO'
                    )
                  "
                  class="btn w-100 cursor-pointer"
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
              :from="props.from"
              :receiveclosepastemodalsignal="closenotequaltopastemodalsignal"
              title="numbers"
              :datatype="cards[index].info.datatype as 'Number' | 'NumberString'"
              :max="(cards[index].result.max as string)"
              :min="(cards[index].result.min as string)"
              :text-area-height="'height:450px;'"
              @return:newlypasteditems="$val => { notequaltonewlypasteditems = $val; }"
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
              :tree="holder.notequalto"
              treetype="NumberSearchExcludeEqualToType"
              :display-area-height="'height: 167.9px;'"
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
            v-model.trim="(holder.fromto as NumberSearchType['fromto']).from"
            @keyup="localResetOthers('FROM-TO')"
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
            v-model.trim="(holder.fromto as NumberSearchType['fromto']).to"
            @keyup="localResetOthers('FROM-TO')"
            type="text"
            class="w-100 text-left"
            style="height: 30px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
