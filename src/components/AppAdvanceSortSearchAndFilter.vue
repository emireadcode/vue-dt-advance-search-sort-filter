<script setup lang="ts">
import { ref, shallowRef, onBeforeMount } from "vue";
import AdvanceSortSearchAndFilter from "./AdvanceSortSearchAndFilter.vue";

let distinctRecords: { [x: string]: { min: string | number; }; } | null = null;
let distinctRecordsError = null;

const props = defineProps<{
  config: CardType<CardInnerType>[0] | {};
}>();

const cards = shallowRef();

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
      cards.value = shallowRef(generateSortSearchFilterCards([props.config]));
    })
    .catch((err) => (distinctRecordsError = err));
});

type StringSearchType = {
  single: string;
  value: string[];
  index: number;
  temporary: string[];
  bottom: boolean;
  done: boolean;
  loading: boolean;
  addloading: boolean;
};

type KeyToNameMappingType = {
  [key: string]: string;
};

type MultipleWordsStringConcatenatedFieldType = {
  [key: string]: {
    aword: boolean;
    name: string;
    attribute: string;
    search?:
      | (StringSearchType & {
          include?: StringSearchType | undefined;
          exclude?: StringSearchType | undefined;
        })
      | undefined;
  };
};

type SingleWordStringConcatenatedFieldType = {
  [key: string]: {
    aword: true;
    name: string;
    attribute: string;
    search?: StringSearchType | undefined;
    startmodifierwildcard?:
      | ("@" | "+" | "*" | "(" | "#" | "/" | "{" | "(" | "[" | "[")[]
      | undefined;
    endmodifierwildcard?: ("*" | ")" | "#" | "/" | "]" | "}")[] | undefined;
  };
};

type MultipleWordsStringConcatenatedType = {
  fields: MultipleWordsStringConcatenatedFieldType;
  delimiters: string[];
};

type SingleWordConcatenatedType = {
  fields: SingleWordStringConcatenatedFieldType;
  delimiters?: string[] | "-" | "/" | "." | " " | "*" | undefined;
};

type DateFormat = {
  dateFormat:
    | "yyyy/mm/dd"
    | "yyyy/mm/d"
    | "yyyy/m/dd"
    | "yyyy/m/d"
    | "yyyy mmmm dd"
    | "yyyy mmmm d"
    | "yyyy mmm dd"
    | "yyyy mmm d"
    | "ddd, yyyy mmmm dd"
    | "ddd, yyyy mmmm d"
    | "ddd, yyyy mmm dd"
    | "ddd, yyyy mmm d"
    | "dddd, yyyy mmmm dd"
    | "dddd, yyyy mmmm d"
    | "dddd, yyyy mmm dd"
    | "dddd, yyyy mmm d"
    | "dddd yyyy mmmm dd"
    | "dddd yyyy mmmm d"
    | "dddd yyyy mmm dd"
    | "dddd yyyy mmm d"
    | "yyyy.mm.dd"
    | "yyyy.mm.d"
    | "yyyy.m.dd"
    | "yyyy.m.d"
    | "yyyy. mm. dd"
    | "yyyy. mm. d"
    | "yyyy. m. dd"
    | "yyyy. m. d"
    | "yyyy-mm-dd"
    | "yyyy-mm-d"
    | "yyyy-m-dd"
    | "yyyy-m-d"
    //little-endian (day, month, year)
    | "dd/mm/yyyy"
    | "dd/m/yyyy"
    | "d/mm/yyyy"
    | "d/m/yyyy"
    | "d/m yyyy"
    | "dd mmm yyyy"
    | "d mmm yyyy"
    | "dd mmmm yyyy"
    | "d mmmm yyyy"
    | "dd mmm, yyyy"
    | "d mmm, yyyy"
    | "dd mmmm, yyyy"
    | "d mmmm, yyyy"
    | "dddd, dd mmmm yyyy"
    | "dddd, d mmmm yyyy"
    | "dddd, dd mmm yyyy"
    | "dddd, d mmm yyyy"
    | "ddd, dd mmmm yyyy"
    | "ddd, d mmmm yyyy"
    | "ddd, dd mmm yyyy"
    | "ddd, d mmm yyyy"
    | "dddd, dd mmmm, yyyy"
    | "dddd, d mmmm, yyyy"
    | "dddd, dd mmm, yyyy"
    | "dddd, d mmm, yyyy"
    | "ddd, dd mmmm, yyyy"
    | "ddd, d mmmm, yyyy"
    | "ddd, dd mmm, yyyy"
    | "ddd, d mmm, yyyy"
    | "dddd dd mmmm yyyy"
    | "dddd d mmmm yyyy"
    | "dddd dd mmm yyyy"
    | "dddd d mmm yyyy"
    | "ddd dd mmmm yyyy"
    | "ddd d mmmm yyyy"
    | "ddd dd mmm yyyy"
    | "ddd d mmm yyyy"
    | "dddd dd mmmm, yyyy"
    | "dddd d mmmm, yyyy"
    | "dddd dd mmm, yyyy"
    | "dddd d mmm, yyyy"
    | "ddd dd mmmm, yyyy"
    | "ddd d mmmm, yyyy"
    | "ddd dd mmm, yyyy"
    | "ddd d mmm, yyyy"
    | "dd.mm.yyyy"
    | "d.mm.yyyy"
    | "dd.m.yyyy"
    | "d.m.yyyy"
    | "dd. mm. yyyy"
    | "d. mm. yyyy"
    | "dd. m. yyyy"
    | "d. m. yyyy"
    | "d. mmmm yyyy"
    | "d. mmm yyyy"
    | "dd. mmmm yyyy"
    | "dd. mmm yyyy"
    | "dd-mm-yyyy"
    | "dd-m-yyyy"
    | "d-mm-yyyy"
    | "d-m-yyyy"
    //middle-endian (month, day, year)
    | "mm/dd/yyyy"
    | "mm/d/yyyy"
    | "m/dd/yyyy"
    | "m/d/yyyy"
    | "mmmm/dd/yyyy"
    | "mmmm/d/yyyy"
    | "mmm/dd/yyyy"
    | "mmm/d/yyyy"
    | "mm.dd.yyyy"
    | "mm.d.yyyy"
    | "m.dd.yyyy"
    | "m.d.yyyy"
    | "mm. dd. yyyy"
    | "mm. d. yyyy"
    | "m. dd. yyyy"
    | "m. d. yyyy"
    | "dddd mmmm dd yyyy"
    | "dddd mmmm d yyyy"
    | "dddd mmm dd yyyy"
    | "dddd mmm d yyyy"
    | "ddd mmmm dd yyyy"
    | "ddd mmmm d yyyy"
    | "ddd mmm dd yyyy"
    | "ddd mmm d yyyy"
    | "dddd, mmmm dd yyyy"
    | "dddd, mmmm d yyyy"
    | "dddd, mmm dd yyyy"
    | "dddd, mmm d yyyy"
    | "ddd, mmmm dd yyyy"
    | "ddd, mmmm d yyyy"
    | "ddd, mmm dd yyyy"
    | "ddd, mmm d yyyy"
    | "dddd, mmmm dd, yyyy"
    | "dddd, mmmm d, yyyy"
    | "dddd, mmm dd, yyyy"
    | "dddd, mmm d, yyyy"
    | "ddd, mmmm dd, yyyy"
    | "ddd, mmmm d, yyyy"
    | "ddd, mmm dd, yyyy"
    | "ddd, mmm d, yyyy"
    | "mmmm dd, yyyy"
    | "mmmm d, yyyy"
    | "mmm dd, yyyy"
    | "mmm d, yyyy"
    | "mm-dd-yyyy"
    | "mm-d-yyyy"
    | "m-dd-yyyy"
    | "m-d-yyyy"
    | "mmmm-dd-yyyy"
    | "mmmm-d-yyyy"
    | "mmm-dd-yyyy"
    | "mmm-d-yyyy";
};

type TimeFormat = {
  timeFormat:
    | "24-HOUR-CLOCK-WITHOUT-SECONDS-WITH-LEADING-ZERO"
    | "24-HOUR-CLOCK-WITHOUT-SECONDS-WITHOUT-LEADING-ZERO"
    | "12-HOUR-CLOCK-WITHOUT-SECONDS-WITH-LEADING-ZERO"
    | "12-HOUR-CLOCK-WITHOUT-SECONDS-WITHOUT-LEADING-ZERO"
    | "24-HOUR-CLOCK-WITH-SECONDS"
    | "12-HOUR-CLOCK-WITH-SECONDS";
};

interface IdentityType {
  info: {
    attribute: string;
    name: string;
    datatype: string;
  };
  checked: boolean;
  img: {
    ascclicked: string;
    descclicked: string;
    mixclicked: string;
  };
  sorttype: string;
  scroll: {
    areaid: string;
    pos: number;
  };
  result: {
    all: boolean;
    data: { row: string; checked: boolean; selected: boolean }[] | [];
    total: number;
    offset: number;
    max: number | string;
    min: number | string;
    totalselection: number;
  };
  loading: boolean;
  bottom: boolean;
}

interface YearType extends IdentityType {
  search: {
    tab: string;
    multiple_or_single?: number[] | undefined;
    range?: number[] | undefined;
    trueorfalse: boolean;
  };
}

interface MultipleWordsStringType extends IdentityType {
  concatenated?: MultipleWordsStringConcatenatedFieldType | undefined;
  concatenatedname?: string | undefined;
  search: StringSearchType & {
    include?: StringSearchType | undefined;
    exclude?: StringSearchType | undefined;
    trueorfalse: boolean;
  };
  searchFrom?: string | undefined; //DOM or SERVER
}

interface SingleWordStringType extends IdentityType {
  concatenated?: SingleWordStringConcatenatedFieldType | undefined;
  concatenatedname?: string | undefined;
  search: StringSearchType & {
    trueorfalse: boolean;
  };
  searchFrom?: string | undefined; //DOM or SERVER
}

interface NumberStringType extends SingleWordStringType {}

interface KeyToNameType extends IdentityType {
  keytonamemapping: KeyToNameMappingType | {};
  search: {
    trueorfalse: boolean;
  };
}

type DateInnerType = {
  format: "DD/MM/YYYY" | "Day(s), Month(s), Year(s)";
  dd_mm_yyyy?:
    | {
        format: "RANGE" | "MULTIPLE-OR-SINGLE";
        dates:
          | {
              //key is years
              [key: string | number]: {
                //key is months
                [key: string | number]: {
                  //key is week number
                  [key: string | number]: {
                    //key is day number in a week 0 - 6
                    [key: string | number]: {
                      status: boolean;
                      selected: boolean;
                      date: string;
                      day: number;
                    }[];
                  }[];
                }[];
              }[];
            }
          | {};
      }
    | undefined;
  days_months_years?:
    | {
        days: {
          format: "RANGE" | "MULTIPLE-OR-SINGLE";
          days: {
            [key: string | number]: {
              selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
              index: number;
              name: "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
            }[];
          } | {};
        };
        months: {
          format: "RANGE" | "MULTIPLE-OR-SINGLE";
          months: {
            [key: string | number]: {
              selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
              index: number;
              name: "Jan" | "Feb" | "Mar" | "Apr" | "May" | "Jun" | "Jul" | "Aug" | "Sep" | "Oct" | "Nov" | "Dec";
            }[];
          } | {};
        };
        years: {
          format: "RANGE" | "MULTIPLE-OR-SINGLE" | "GREATER-THAN" | "LESS-THAN" | "FROM-TO";
          years: {
            [key: string | number]: {
              selected: "SELECTED" | "DESELECTED" | "HIGHLIGHTED";
            }[];
          } | {};
        };
      }
    | undefined;
};

interface TimeType extends IdentityType {
  search: {
    from_to_time: string[]; //[from, to] always in range
    trueorfalse: boolean;
  };
  searchFrom?: string | undefined; //DOM or SERVER
  timeFormat: TimeFormat | {};
}

interface DateType extends IdentityType {
  search: DateInnerType & {
    trueorfalse: boolean;
  };
  dateFormat: DateFormat;
  searchFrom?: string | undefined; //DOM or SERVER
}

interface DateTimeType extends IdentityType {
  search: DateInnerType & {
    from_to_time: string[]; //[from, to] always in range
    trueorfalse: boolean;
  };
  searchFrom?: string | undefined; //DOM or SERVER
  timeFormat: TimeFormat | {};
  dateFormat: DateFormat;
}

interface NumberType extends IdentityType {
  search: {
    trueorfalse: boolean;
    tab: "GREATER-THAN" | "LESS-THAN" | "EQUAL-TO" | "NOT-EQUAL-TO" | "FROM-TO";
    greaterthan?: string | number | undefined;
    lessthan?: string | number | undefined;
    equalto?:
      | {
          single: string | number;
          value: (number | string)[];
          index: number;
          disabled: boolean[];
          show: boolean[];
        }
      | undefined;
    notequalto?:
      | {
          single: string | number;
          value: (number | string)[];
          index: number;
          disabled: boolean[];
          show: boolean[];
        }
      | undefined;
    fromto?:
      | {
          from: string | number;
          to: string | number;
        }
      | undefined;
    exclude?:
      | {
          fromto?:
            | {
                singlefrom: string | number;
                from: (number | string)[];
                singleto: string | number;
                to: (number | string)[];
                index: number;
                disabled: boolean[];
                show: boolean[];
              }
            | undefined;
          equalto?:
            | {
                single: string | number;
                value: (number | string)[];
                index: number;
                disabled: boolean[];
                show: boolean[];
              }
            | undefined;
        }
      | undefined;
  };
  searchFrom?: string | undefined;
}

type CardInnerType = {
  position?: number | undefined;
  name: string;
  attribute?: string | undefined;
  limit: number;
  table?: string | undefined;
  join?: string | undefined;
};

type CardType<T> = [
  {
    multiplewordsstringtypes?:
      | (T & { concatenated?: MultipleWordsStringConcatenatedType | undefined })[]
      | undefined;
    datetypes?: (T & DateFormat)[] | undefined;
    numbertypes?: T[] | undefined;
    keytonamemappingtypes?: (T & KeyToNameMappingType)[] | undefined;
    datetimetypes?: (T & DateFormat & TimeFormat)[] | undefined;
    timetypes?: (T & TimeFormat)[] | undefined;
    singlewordstringtypes?:
      | (T & {
          concatenated?: SingleWordConcatenatedType | undefined;
        })[]
      | undefined;
    numberstringtypes?:
      | (T & {
          concatenated?: SingleWordConcatenatedType | undefined;
        })[]
      | undefined;
    yeartypes?: T[] | undefined;
  }
];

type PrimitiveType =
  | YearType
  | NumberType
  | MultipleWordsStringType
  | KeyToNameType
  | DateType
  | DateTimeType
  | TimeType
  | SingleWordStringType
  | NumberStringType;

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
  let _concatenated = JSON.parse(JSON.stringify(concatenated));
  for (let i in _concatenated) {
    if (_concatenated[i].aword) {
      _concatenated[i] = {
        name: _concatenated[i].name,
        attribute: _concatenated[i].attribute,
        aword: _concatenated[i].aword,
        search: {
          ...searchStringDefaultObject(),
        },
      };
    } else {
      _concatenated[i] = {
        name: _concatenated[i].name,
        attribute: _concatenated[i].attribute,
        aword: _concatenated[i].aword,
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
  return _concatenated;
}

function scanConfig(
  card: CardInnerType,
  index: number,
  size: number,
  _sortSearchFilterCards: PrimitiveType[],
  config: PrimitiveType[],
  _found: boolean,
  _positionNotFound: boolean
) {
  let found = _found,
    positionNotFound = _positionNotFound,
    sortSearchFilterCards = _sortSearchFilterCards;
  if (!found) {
    if (typeof card.position !== undefined) {
      if (card.position === index) {
        for (let j = 0; j < size; j++) {
          if (card.name === config[j].info.name) {
            sortSearchFilterCards.push(config[j]);
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
    sortSearchFilterCards,
    found,
    positionNotFound,
  };
}

function arrangeCards(
  _sortSearchFilterCards: PrimitiveType[],
  config: CardType<CardInnerType>
) {
  let sortSearchFilterCards: PrimitiveType[] = [],
    size = _sortSearchFilterCards.length,
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
        typeof config[0][supportedtypes[k] as "multiplewordsstringtypes" |
      "yeartypes" |
      "numbertypes" |
      "numberstringtypes" |
      "keytonamemappingtypes" |
      "datetypes" |
      "datetimetypes" |
      "timetypes" |
      "singlewordstringtypes"] !== undefined &&
        !found &&
        !positionNotFound
      ) {
        config[0][supportedtypes[k] as 
        "multiplewordsstringtypes" |
        "yeartypes" |
        "numbertypes" |
        "numberstringtypes" |
        "keytonamemappingtypes" |
        "datetypes" |
        "datetimetypes" |
        "timetypes" |
        "singlewordstringtypes"]?.forEach((card: { position?: number | undefined; name: string; attribute?: string | undefined; limit: number; table?: string | undefined; join?: string | undefined; }) => {
          const configReturn = scanConfig(
            card,
            index,
            size,
            sortSearchFilterCards,
            _sortSearchFilterCards,
            found,
            positionNotFound
          );
          sortSearchFilterCards = configReturn.sortSearchFilterCards;
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

  return positionNotFound ? _sortSearchFilterCards : sortSearchFilterCards;
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
      data: distinctRecords[attribute].data,
      total: distinctRecords[attribute].total,
      offset: distinctRecords[attribute].offset,
      max:
        distinctRecords[attribute].max !== undefined
          ? distinctRecords[attribute].max
          : "",
      min:
        distinctRecords[attribute].min !== undefined
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

function generateSortSearchFilterCards(config: CardType<CardInnerType>) {
  let sortSearchFilterCards: PrimitiveType[] = [];
  if (typeof config[0].multiplewordsstringtypes !== undefined) {
    config[0].multiplewordsstringtypes?.forEach((item) => {
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

      sortSearchFilterCards.push(multiplewordsstringtypetemplate);
    });
  }
  if (typeof config[0].yeartypes !== undefined) {
    config[0].yeartypes?.forEach((item) => {
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

      sortSearchFilterCards.push(yeartypetemplate);
    });
  }
  if (typeof config[0].keytonamemappingtypes !== undefined) {
    config[0].keytonamemappingtypes?.forEach((item) => {
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

      sortSearchFilterCards.push(keytonametypetemplate);
    });
  }
  if (typeof config[0].numbertypes !== undefined) {
    config[0].numbertypes?.forEach((item) => {
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

      sortSearchFilterCards.push(numbertypetemplate);
    });
  }
  if (typeof config[0].datetypes !== undefined) {
    config[0].datetypes?.forEach((item) => {
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

      sortSearchFilterCards.push(datetypetemplate);
    });
  }
  if (typeof config[0].datetimetypes !== undefined) {
    config[0].datetimetypes?.forEach((item) => {
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

      sortSearchFilterCards.push(datetimetypetemplate);
    });
  }
  if (typeof config[0].timetypes !== undefined) {
    config[0].timetypes?.forEach((item) => {
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

      sortSearchFilterCards.push(timetypetemplate);
    });
  }
  if (typeof config[0].numberstringtypes !== undefined) {
    config[0].numberstringtypes?.forEach((item) => {
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

      sortSearchFilterCards.push(numberstringtypetemplate);
    });
  }
  if (typeof config[0].singlewordstringtypes !== undefined) {
    config[0].singlewordstringtypes?.forEach((item) => {
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

      sortSearchFilterCards.push(singlewordstringtypetemplate);
    });
  }

  sortSearchFilterCards = arrangeCards(sortSearchFilterCards, config);

  return sortSearchFilterCards;
}

const open = ref(false);
</script>

<template>
  <div class="d-block">
    <button v-if="!open && cards" @click="open = true">Open Modal</button>
    <template v-if="open">
      <Teleport to="body">
        <AdvanceSortSearchAndFilter
          @modal:close="($val) => (open = $val)"
          :cards="cards"
        ></AdvanceSortSearchAndFilter>
      </Teleport>
    </template>
  </div>
</template>
