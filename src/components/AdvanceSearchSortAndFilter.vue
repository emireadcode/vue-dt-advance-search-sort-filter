<script setup lang="ts">
import { ref, shallowRef, onBeforeMount, type ShallowRef, Teleport } from "vue";
import type { 
  CardType,
  CardInnerType,
  DistinctRecordType,
  PrimitiveType
} from "./types/SupportedDatatypesTypeDeclaration";
import AdvanceSearchSortAndFilterModal from "./AdvanceSearchSortAndFilterModal.vue";
import { generateSearchSortAndFilterCards } from "./helperfunctions/createcards";

let distinctRecordsError = null;

const
  open = ref(false),
  props = defineProps<{
    config: CardType<CardInnerType>;
  }>()
;

let cards = shallowRef();

//write a test script to mock the fetching of distinct record
//make the fetch function an asynchronous function and after a time
//delay check the value of the cards in order for us to check
//the durability of the generateSearchSortAndFilterCards.

//check if AdvanceSearchSortFilterModal is mounted

onBeforeMount(() => {
  fetch("http://localhost:8080/distinct-record", {
    method: "POST",
    //credentials: "include", // send cookies
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    body: "config=" + encodeURIComponent(JSON.stringify(props.config)),
  })
    .then((res) => res.json())
    .then((json) => {
      cards.value = shallowRef(generateSearchSortAndFilterCards(props.config, json as DistinctRecordType)) as ShallowRef<PrimitiveType[]>;
    })
    .catch((err) => (distinctRecordsError = err));
});

</script>

<template>
  <div class="d-block">
    <button 
      v-if="!open && cards" 
      @click="open = true" 
      aria-haspopup="dialog"
    >
      Open Modal
    </button>
    <template v-if="open">
      <Teleport to="body">
        <AdvanceSearchSortAndFilterModal
          @modal:close="($val: boolean) => (open = $val)"
          :cards="cards"
        ></AdvanceSearchSortAndFilterModal>
      </Teleport>
    </template>
  </div>
</template>
