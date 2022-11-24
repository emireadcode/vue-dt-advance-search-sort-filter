<script setup lang="ts">
import { ref, shallowRef, onBeforeMount, type ShallowRef } from "vue";
import type { SingleWordConcatenatedType, MultipleWordsStringConcatenatedType, NumberStringType, TimeType, KeyToNameType, NumberType, YearType, DateTimeType, DateType, MultipleWordsStringType, SingleWordStringConcatenatedFieldType, MultipleWordsStringConcatenatedFieldType, SingleWordStringType, PrimitiveType, IdentityType, CardType, CardInnerType, DistinctRecordType, KeyToNameMappingType, DateFormat, TimeFormat } from "./types/SupportedDatatypesTypeDeclaration";
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
  _arrangedCards: PrimitiveType[],
  _unarrangedCards: PrimitiveType[],
  isfound: boolean,
  pnotfound: boolean
) {
  let found = isfound,
    positionNotFound = pnotfound,
    arrangedCards = _arrangedCards;
  if (!found) {
    if (typeof card.position !== undefined) {
      if (card.position === index) {
        for (let j = 0; j < size; j++) {
          if (card.name === _unarrangedCards[j].info.name) {
            arrangedCards.push(_unarrangedCards[j]);
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
    arrangedCards,
    found,
    positionNotFound,
  };
}

function arrangeCards(
  unarrangedCards: PrimitiveType[],
  config: CardType<CardInnerType>
) {
  let arrangedCards: PrimitiveType[] = [],
    size = unarrangedCards.length,
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
            arrangedCards,
            unarrangedCards,
            found,
            positionNotFound
          );
          
          arrangedCards = configReturn.arrangedCards;
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

  return positionNotFound ? unarrangedCards : arrangedCards;
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

function getKeyToNameTypeObject(item: CardInnerType & KeyToNameMappingType) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
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
}

function getYearTypeObject(item: CardInnerType) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
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
}

function getNumberTypeObject(item: CardInnerType) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
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
}

function getMultipleWordStringTypeObject(item: (CardInnerType & {concatenated?: MultipleWordsStringConcatenatedType | undefined;})) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
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
}

function getDateTypeObject(item: CardInnerType & DateFormat) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
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
}

function getDateTimeObject(item: CardInnerType & DateFormat & TimeFormat) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
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
}

function getTimeTypeObject(item: CardInnerType & TimeFormat) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
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
}

function getNumberStringTypeObject(item: CardInnerType & {concatenated?: SingleWordConcatenatedType | undefined;}) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
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
}

function getSingleWordStringTypeObject(item: CardInnerType & {concatenated?: SingleWordConcatenatedType | undefined;}) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
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
}

function generateSearchSortAndFilterCards(config: CardType<CardInnerType>) {
  let searchSortAndFilterCards: PrimitiveType[] = [];
  if (typeof config.multiplewordsstringtypes !== undefined) {
    config.multiplewordsstringtypes?.forEach((item) => {
      searchSortAndFilterCards.push(getMultipleWordStringTypeObject(item));
    });
  }
  if (typeof config.yeartypes !== undefined) {
    config.yeartypes?.forEach((item) => {
      searchSortAndFilterCards.push(getYearTypeObject(item));
    });
  }
  if (typeof config.keytonamemappingtypes !== undefined) {
    config.keytonamemappingtypes?.forEach((item) => {
      searchSortAndFilterCards.push(getKeyToNameTypeObject(item));
    });
  }
  if (typeof config.numbertypes !== undefined) {
    config.numbertypes?.forEach((item) => {
      searchSortAndFilterCards.push(getNumberTypeObject(item));
    });
  }
  if (typeof config.datetypes !== undefined) {
    config.datetypes?.forEach((item) => {
      searchSortAndFilterCards.push(getDateTypeObject(item));
    });
  }
  if (typeof config.datetimetypes !== undefined) {
    config.datetimetypes?.forEach((item) => {
      searchSortAndFilterCards.push(getDateTimeObject(item));
    });
  }
  if (typeof config.timetypes !== undefined) {
    config.timetypes?.forEach((item) => {
      searchSortAndFilterCards.push(getTimeTypeObject(item));
    });
  }
  if (typeof config.numberstringtypes !== undefined) {
    config.numberstringtypes?.forEach((item) => {
      searchSortAndFilterCards.push(getNumberStringTypeObject(item));
    });
  }
  if (typeof config.singlewordstringtypes !== undefined) {
    config.singlewordstringtypes?.forEach((item) => {
      searchSortAndFilterCards.push(getSingleWordStringTypeObject(item));
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
