<script setup lang="ts">
import { ref, shallowRef, onBeforeMount, type ShallowRef } from "vue";
import type { NumberStringType, TimeType, KeyToNameType, NumberType, YearType, DateTimeType, DateType, MultipleWordsStringType, SingleWordStringConcatenatedFieldType, MultipleWordsStringConcatenatedFieldType, SingleWordStringType, PrimitiveType, IdentityType, CardType, CardInnerType, DistinctRecordType } from "./types/SupportedDatatypesTypeDeclaration";
import AdvanceSearchSortAndFilterModal from "./AdvanceSearchSortAndFilterModal.vue";

let distinctRecords: DistinctRecordType = null;
let distinctRecordsError = null;

const
  open = ref(false),
  props = defineProps<{
    config: CardType<CardInnerType>;
  }>()
;

let cards = shallowRef();

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
      distinctRecords = json;
      cards.value = shallowRef(generateSearchSortAndFilterCards(props.config)) as ShallowRef<PrimitiveType[] | undefined>;
    })
    .catch((err) => (distinctRecordsError = err));
});

function searchStringDefaultObject() {
  return {
    single: "",
    value: [],
    index: 0,
    temporary: [],
    bottom: false,
    done: false,
    loading: false,
    addloading: false,
  };
}

function formConcatenatedSearch(
  concatenated:
    | MultipleWordsStringConcatenatedFieldType
    | SingleWordStringConcatenatedFieldType
) {
  let concatcopy = JSON.parse(JSON.stringify(concatenated));
  for (let i in concatcopy) {
    if (concatcopy[i].aword) {
      concatcopy[i] = {
        name: concatcopy[i].name,
        attribute: concatcopy[i].attribute,
        aword: concatcopy[i].aword,
        search: {
          ...searchStringDefaultObject(),
        },
      };
    } else {
      concatcopy[i] = {
        name: concatcopy[i].name,
        attribute: concatcopy[i].attribute,
        aword: concatcopy[i].aword,
        search: {
          ...searchStringDefaultObject(),
          include: {
            ...searchStringDefaultObject(),
          },
          exclude: {
            ...searchStringDefaultObject(),
          },
        },
      };
    }
  }
  return concatcopy;
}

function scanConfig(
  card: CardInnerType,
  index: number,
  size: number,
  sSAndFCards1: PrimitiveType[],
  sSAndFCards2: PrimitiveType[],
  isfound: boolean,
  pnotfound: boolean
) {
  let found = isfound,
    positionNotFound = pnotfound,
    searchSortAndFilterCards = sSAndFCards1;
  if (!found) {
    if (typeof card.position !== undefined) {
      if (card.position === index) {
        for (let j = 0; j < size; j++) {
          if (card.name === sSAndFCards2[j].info.name) {
            searchSortAndFilterCards.push(sSAndFCards2[j]);
            found = true;
            break;
          }
        }
      }
    } else {
      positionNotFound = true;
    }
  }
  return {
    searchSortAndFilterCards,
    found,
    positionNotFound,
  };
}

function arrangeCards(
  sSAndFCards: PrimitiveType[],
  config: CardType<CardInnerType>
) {
  let searchSortAndFilterCards: PrimitiveType[] = [],
    size = sSAndFCards.length,
    positionNotFound = false,
    supportedtypes = [
      "multiplewordsstringtypes",
      "yeartypes",
      "numbertypes",
      "numberstringtypes",
      "keytonamemappingtypes",
      "datetypes",
      "datetimetypes",
      "timetypes",
      "singlewordstringtypes",
    ];

  for (let index = 0; index < size; index++) {
    let found = false;

    for (let k = 0; k < supportedtypes.length; k++) {
      if (
        typeof config[
          supportedtypes[k] as "multiplewordsstringtypes" |
          "yeartypes" |
          "numbertypes" |
          "numberstringtypes" |
          "keytonamemappingtypes" |
          "datetypes" |
          "datetimetypes" |
          "timetypes" |
          "singlewordstringtypes"
        ] !== undefined &&
        !found &&
        !positionNotFound
      ) {
        config[
          supportedtypes[k] as 
          "multiplewordsstringtypes" |
          "yeartypes" |
          "numbertypes" |
          "numberstringtypes" |
          "keytonamemappingtypes" |
          "datetypes" |
          "datetimetypes" |
          "timetypes" |
          "singlewordstringtypes"
        ]?.forEach((card: { position?: number | undefined; name: string; attribute?: string | undefined; limit: number; table?: string | undefined; join?: string | undefined; }) => {
          const configReturn = scanConfig(
            card,
            index,
            size,
            searchSortAndFilterCards,
            sSAndFCards,
            found,
            positionNotFound
          );
          searchSortAndFilterCards = configReturn.searchSortAndFilterCards;
          found = configReturn.found;
          positionNotFound = configReturn.positionNotFound;
        });
      }
    }

    if (!found) {
      positionNotFound = true;
      break;
    }
  }

  return positionNotFound ? sSAndFCards : searchSortAndFilterCards;
}

function getIdentityItem(item: CardInnerType, attribute: string, datatype: string) {
  return {
    info: {
      attribute: attribute,
      name: item.name,
      datatype: datatype,
    },
    checked: false,
    sorttype: "",
    scroll: {
      areaid: attribute + "-advsort-area",
      pos: 0,
    },
    result: {
      all: false,
      data: distinctRecords? distinctRecords[attribute].data : [],
      total: distinctRecords? distinctRecords[attribute].total : 0,
      offset: distinctRecords? distinctRecords[attribute].offset: 0,
      max:
      distinctRecords && distinctRecords[attribute].max !== undefined
          ? distinctRecords[attribute].max
          : "",
      min:
      distinctRecords && distinctRecords[attribute].min !== undefined
          ? distinctRecords[attribute].min
          : "",
      totalselection: 0,
    },
    loading: false,
    bottom: false,
  } as IdentityType;
}

function shouldShowFullConcatOrNot(
  concatenated:
    | MultipleWordsStringConcatenatedFieldType
    | SingleWordStringConcatenatedFieldType
) {
  let show = true;
  for (let i in concatenated) {
    if (concatenated[i].aword === false) {
      show = false;
      break;
    }
  }
  return show;
}

function generateSearchSortAndFilterCards(config: CardType<CardInnerType>) {
  let searchSortAndFilterCards: PrimitiveType[] = [];
  if (typeof config.multiplewordsstringtypes !== undefined) {
    config.multiplewordsstringtypes?.forEach((item) => {
      const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
      const multiplewordsstringtypetemplate = {
        ...getIdentityItem(item, attribute, "MultipleWordsString"),
        img: {
          ascclicked: "sort-a-z.png",
          descclicked: "sort-z-a.png",
          mixclicked: "mix.png",
        },
        search: {
          ...searchStringDefaultObject(),
          include: {
            ...searchStringDefaultObject(),
          },
          exclude: {
            ...searchStringDefaultObject(),
          },
          trueorfalse: false,
        },
        searchFrom: "SERVER",
        concatenatedname:
          item.concatenated !== undefined &&
          shouldShowFullConcatOrNot(item.concatenated.fields)
            ? item.name
            : undefined,
        concatenated:
          item.concatenated !== undefined
            ? formConcatenatedSearch(item.concatenated.fields)
            : undefined,
      } as MultipleWordsStringType;

      searchSortAndFilterCards.push(multiplewordsstringtypetemplate);
    });
  }
  if (typeof config.yeartypes !== undefined) {
    config.yeartypes?.forEach((item) => {
      const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
      const yeartypetemplate = {
        ...getIdentityItem(item, attribute, "Year"),
        img: {
          ascclicked: "sort-a-z.png",
          descclicked: "sort-z-a.png",
          mixclicked: "mix.png",
        },
        search: {
          tab: "RANGE",
          multiple_or_single: [],
          range: [],
          trueorfalse: false,
        },
        searchFrom: "SERVER",
      } as YearType;

      searchSortAndFilterCards.push(yeartypetemplate);
    });
  }
  if (typeof config.keytonamemappingtypes !== undefined) {
    config.keytonamemappingtypes?.forEach((item) => {
      const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
      const keytonametypetemplate = {
        ...getIdentityItem(item, attribute, "KeyToName"),
        img: {
          ascclicked: "sort-asc.png",
          descclicked: "sort-desc.png",
          mixclicked: "mix.png",
        },
        search: {
          keyword: "",
          trueorfalse: false,
        },
        keytonamemapping:
          item.keytonamemapping !== undefined ? item.keytonamemapping : {},
      } as KeyToNameType;

      searchSortAndFilterCards.push(keytonametypetemplate);
    });
  }
  if (typeof config.numbertypes !== undefined) {
    config.numbertypes?.forEach((item) => {
      const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
      const numbertypetemplate = {
        ...getIdentityItem(item, attribute, "Number"),
        img: {
          ascclicked: "sort-1-9.png",
          descclicked: "sort-9-1.png",
          mixclicked: "mix.png",
        },
        search: {
          trueorfalse: false,
          tab: "GREATER-THAN",
          greaterthan: "",
          lessthan: "",
          equalto: {
            single: "",
            value: [],
            index: 0,
            disabled: [],
            show: [],
          },
          notequalto: {
            single: "",
            value: [],
            index: 0,
            disabled: [],
            show: [],
          },
          fromto: {
            from: "",
            to: "",
          },
          exclude: {
            fromto: {
              singlefrom: "",
              from: [],
              singleto: "",
              to: [],
              index: 0,
              disabled: [],
              show: [],
            },
            equalto: {
              single: "",
              value: [],
              index: 0,
              disabled: [],
              show: [],
            },
          },
        },
        searchFrom: "SERVER",
      } as NumberType;

      searchSortAndFilterCards.push(numbertypetemplate);
    });
  }
  if (typeof config.datetypes !== undefined) {
    config.datetypes?.forEach((item) => {
      const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
      const datetypetemplate = {
        ...getIdentityItem(item, attribute, "Date"),
        img: {
          ascclicked: "sort-asc.png",
          descclicked: "sort-desc.png",
          mixclicked: "mix.png",
        },
        search: {
          trueorfalse: false,
          format: "DD/MM/YYYY",
          dd_mm_yyyy: {
            format: "RANGE",
            dates: {},
          },
          days_months_years: {
            days: {
              format: "RANGE",
              days: {},
            },
            months: {
              format: "RANGE",
              months: {},
            },
            years: {
              format: "RANGE",
              years: {},
            },
          },
        },
        searchFrom: "SERVER",
        dateFormat: item.dateFormat,
      } as DateType;

      searchSortAndFilterCards.push(datetypetemplate);
    });
  }
  if (typeof config.datetimetypes !== undefined) {
    config.datetimetypes?.forEach((item) => {
      const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
      const datetimetypetemplate = {
        ...getIdentityItem(item, attribute, "DateTime"),
        img: {
          ascclicked: "sort-asc.png",
          descclicked: "sort-desc.png",
          mixclicked: "mix.png",
        },
        search: {
          from_to_time: [],
          trueorfalse: false,
          format: "DD/MM/YYYY",
          dd_mm_yyyy: {
            format: "RANGE",
            dates: {},
          },
          days_months_years: {
            days: {
              format: "RANGE",
              days: {},
            },
            months: {
              format: "RANGE",
              months: {},
            },
            years: {
              format: "RANGE",
              years: {},
            },
          },
        },
        searchFrom: "SERVER",
        dateFormat: item.dateFormat,
        timeFormat: item.timeFormat,
      } as DateTimeType;

      searchSortAndFilterCards.push(datetimetypetemplate);
    });
  }
  if (typeof config.timetypes !== undefined) {
    config.timetypes?.forEach((item) => {
      const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
      const timetypetemplate = {
        ...getIdentityItem(item, attribute, "Time"),
        img: {
          ascclicked: "sort-1-9.png",
          descclicked: "sort-9-1.png",
          mixclicked: "mix.png",
        },
        search: {
          trueorfalse: false,
          from_to_time: [],
        },
        searchFrom: "SERVER",
        timeFormat: item.timeFormat,
      } as TimeType;

      searchSortAndFilterCards.push(timetypetemplate);
    });
  }
  if (typeof config.numberstringtypes !== undefined) {
    config.numberstringtypes?.forEach((item) => {
      const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
      const numberstringtypetemplate = {
        ...getIdentityItem(item, attribute, "NumberString"),
        img: {
          ascclicked: "sort-1-9.png",
          descclicked: "sort-9-1.png",
          mixclicked: "mix.png",
        },
        search: {
          trueorfalse: false,
          ...searchStringDefaultObject(),
        },
        concatenated:
          item.concatenated !== undefined
            ? formConcatenatedSearch(item.concatenated.fields)
            : undefined,
        concatenatedname:
          item.concatenated !== undefined &&
          shouldShowFullConcatOrNot(item.concatenated.fields)
            ? item.name
            : undefined,
        searchFrom: "SERVER",
      } as NumberStringType;

      searchSortAndFilterCards.push(numberstringtypetemplate);
    });
  }
  if (typeof config.singlewordstringtypes !== undefined) {
    config.singlewordstringtypes?.forEach((item) => {
      const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
      const singlewordstringtypetemplate = {
        ...getIdentityItem(item, attribute, "SingleWordString"),
        img: {
          ascclicked: "sort-a-z.png",
          descclicked: "sort-z-a.png",
          mixclicked: "mix.png",
        },
        search: {
          trueorfalse: false,
          ...searchStringDefaultObject(),
        },
        concatenated:
          item.concatenated !== undefined
            ? formConcatenatedSearch(item.concatenated.fields)
            : undefined,
        concatenatedname:
          item.concatenated !== undefined &&
          shouldShowFullConcatOrNot(item.concatenated.fields)
            ? item.name
            : undefined,
        searchFrom: "SERVER",
      } as SingleWordStringType;

      searchSortAndFilterCards.push(singlewordstringtypetemplate);
    });
  }

  searchSortAndFilterCards = arrangeCards(searchSortAndFilterCards, config);

  return searchSortAndFilterCards;
}

</script>

<template>
  <div class="d-block">
    <button v-if="!open && cards" @click="open = true" aria-haspopup="dialog">Open Modal</button>
    <template v-if="open">
      <Teleport to="body">
        <AdvanceSearchSortAndFilterModal
          @modal:close="($val) => (open = $val)"
          :cards="cards"
        ></AdvanceSearchSortAndFilterModal>
      </Teleport>
    </template>
  </div>
</template>
