import type { 
  SingleWordConcatenatedType, 
  MultipleWordsStringConcatenatedType, 
  NumberStringType, 
  TimeType, 
  KeyToNameType, 
  NumberType, 
  YearType, 
  DateTimeType,
  DateType, 
  MultipleWordsStringType, 
  SingleWordStringConcatenatedFieldType, 
  MultipleWordsStringConcatenatedFieldType, 
  SingleWordStringType, 
  PrimitiveType, 
  IdentityType, 
  CardType, 
  CardInnerType, 
  DistinctRecordType, 
  KeyToNameMappingType, 
  DateFormat, 
  TimeFormat, 
  StringSearchType 
} from "../types/SupportedDatatypesTypeDeclaration";

let distinctRecords: DistinctRecordType = undefined;

function searchStringDefaultObject() {
  return {
    single: "",
    pages: [],
    deleting: false,
    bottom: false,
    shake: [],
    show: [],
    loading: false,
    addloading: false,
    tabclicked: false,
    addeditemsref: [],
    endoflistitemref: undefined,
  } as StringSearchType;
}
  
function formConcatenatedSearch(
  concatenated:
    | MultipleWordsStringConcatenatedFieldType
    | SingleWordStringConcatenatedFieldType
) {
  let concatcopy = JSON.parse(JSON.stringify(concatenated));
  for (let i in concatcopy) {
    if(concatcopy[i].disableincludeandexclude !== undefined) {
      if (concatcopy[i].disableincludeandexclude) {
        concatcopy[i] = {
          name: concatcopy[i].name,
          attribute: concatcopy[i].attribute,
          table: concatcopy[i].table,
          join: concatcopy[i].join,
          disableincludeandexclude: concatcopy[i].disableincludeandexclude,
          search: {
            ...searchStringDefaultObject(),
          },
        };
      } else {
        concatcopy[i] = {
          name: concatcopy[i].name,
          attribute: concatcopy[i].attribute,
          table: concatcopy[i].table,
          join: concatcopy[i].join,
          fixedlengthofstring: (concatcopy[i].disableincludeandexclude !== undefined && concatcopy[i].fixedlengthofstring !== undefined && /^\d+$/.test(""+concatcopy[i].fixedlengthofstring))? concatcopy[i].fixedlengthofstring : undefined,
          disableincludeandexclude: concatcopy[i].disableincludeandexclude,
          search: {
            ...searchStringDefaultObject(),
            include: {
              ...searchStringDefaultObject(),
            },
            exclude: {
              ...searchStringDefaultObject(),
            },
            trueorfalse: false,
            includeorexcludeformat: 'STARTS-WITH',
            atnumbersearch: (concatcopy[i].disableincludeandexclude !== undefined && concatcopy[i].disableincludeandexclude === false && concatcopy[i].fixedlengthofstring !== undefined && /^\d+$/.test(""+concatcopy[i].fixedlengthofstring))? {
              last: '',
              first: '',
              thenumberbeforethelast: {
                thenumberbefore: '',
                thelast: '',
              },
              afterthefirstthenext: {
                afterthefirst: '',
                thenext: '',
              },
              search: {
                atnumberformat: 'LAST',
                tab: "GREATER-THAN",
                greaterthan: '',
                lessthan: '',
                equalto: {
                  single: "",
                  pages: [],
                  deleting: false,
                  bottom: false,
                  shake: [],
                  show: [],
                  addeditemsref: [],
                  endoflistitemref: undefined,
                  addloading: false,
                  loading: false,
                  inneraddeditemsref: [],
                },
                notequalto: {
                  single: "",
                  pages: [],
                  deleting: false,
                  bottom: false,
                  shake: [],
                  show: [],
                  addeditemsref: [],
                  endoflistitemref: undefined,
                  addloading: false,
                  loading: false,
                  inneraddeditemsref: [],
                },
                fromto: {
                  from: "",
                  to: "",
                },
                exclude: {
                  fromto: {
                    singlefrom: "",
                    singleto: "",
                    bottom: false,
                    shake: [],
                    pages: [],
                    deleting: false,
                    addloading: false,
                    loading: false,
                    addeditemsref: [],
                    inneraddeditemsref: [],
                    endoflistitemref: undefined,
                    show: [],
                  },
                  equalto: {
                    single: "",
                    pages: [],
                    deleting: false,
                    shake: [],
                    bottom: false,
                    show: [],
                    addeditemsref: [],
                    endoflistitemref: undefined,
                    addloading: false,
                    loading: false,
                    inneraddeditemsref: [],
                  },
                },
              }
            } : undefined
          },
        };
      }
    }
    else {
      concatcopy[i] = {
        name: concatcopy[i].name,
        attribute: concatcopy[i].attribute,
        disableincludeandexclude: undefined,
        table: concatcopy[i].table,
        join: concatcopy[i].join,
        search: {
          ...searchStringDefaultObject(),
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
      format: "RANGE",
      greaterthan: '',
      lessthan: '',
      years: {},
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
      single: '',
      searchtype: 'SINGLE',
      searchedornot: false,
      multiple: {
        tab: "GREATER-THAN",
        greaterthan: "",
        lessthan: "",
        equalto: {
          single: "",
          pages: [],
          deleting: false,
          shake: [],
          bottom: false,
          show: [],
          addeditemsref: [],
          endoflistitemref: undefined,
          addloading: false,
          loading: false,
          inneraddeditemsref: [],
        },
        notequalto: {
          single: "",
          pages: [],
          deleting: false,
          bottom: false,
          shake: [],
          show: [],
          addeditemsref: [],
          endoflistitemref: undefined,
          addloading: false,
          loading: false,
          inneraddeditemsref: [],
        },
        fromto: {
          from: "",
          to: "",
        },
        exclude: {
          fromto: {
            singlefrom: "",
            singleto: "",
            bottom: false,
            shake: [],
            pages: [],
            deleting: false,
            addloading: false,
            loading: false,
            addeditemsref: [],
            inneraddeditemsref: [],
            endoflistitemref: undefined,
            show: [],
          },
          equalto: {
            single: "",
            pages: [],
            deleting: false,
            shake: [],
            bottom: false,
            show: [],
            addeditemsref: [],
            endoflistitemref: undefined,
            addloading: false,
            loading: false,
            inneraddeditemsref: [],
          },
        },
      }
    },
    searchFrom: "SERVER",
  } as NumberType;
}
  
function getMultipleWordStringTypeObject(item: (CardInnerType & { concatenated?: MultipleWordsStringConcatenatedType | undefined; disableincludeandexclude?: boolean | undefined; })) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
    ...getIdentityItem(item, attribute, "MultipleWordsString"),
    img: {
      ascclicked: "sort-a-z.png",
      descclicked: "sort-z-a.png",
      mixclicked: "mix.png",
    },
    disableincludeandexclude: item.disableincludeandexclude !== undefined? item.disableincludeandexclude : undefined,
    search: {
      trueorfalse: false,
      single: '',
      searchtype: 'SINGLE',
      searchedornot: false,
      multiple: {
        ...searchStringDefaultObject(),
        include: {
          ...searchStringDefaultObject(),
        },
        exclude: {
          ...searchStringDefaultObject(),
        },
        includeorexcludeformat: 'STARTS-WITH',
      }
    },
    searchFrom: "SERVER",
    concatenated:
      item.concatenated !== undefined
        ? formConcatenatedSearch(item.concatenated.fields)
        : undefined,
  } as MultipleWordsStringType;
}
  
function getDateTypeObject(item: CardInnerType & DateFormat & { isoweek: boolean}) {
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
        rangeselectionparams: {
          rangefirstselection: {
            date: "",
            day: 0,
            month: 0,
            year: 0
          },
          rangelastselection: {
            date: "",
            day: 0,
            month: 0,
            year: 0
          },
          rangeselectcount: 0,
          inselectionmode: false,
          excludedates: false,
        }
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
    isoweek: item.isoweek,
  } as DateType;
}
  
function getDateTimeObject(item: CardInnerType & DateFormat & TimeFormat & { isoweek: boolean}) {
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
    isoweek: item.isoweek,
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
  
function getNumberStringTypeObject(item: CardInnerType & {
  concatenated?: SingleWordConcatenatedType | undefined;
  fixedlengthofstring?: number | undefined;
  disableincludeandexclude?: boolean | undefined;
}) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
    ...getIdentityItem(item, attribute, "NumberString"),
    img: {
      ascclicked: "sort-1-9.png",
      descclicked: "sort-9-1.png",
      mixclicked: "mix.png",
    },
    fixedlengthofstring: item.disableincludeandexclude !== undefined && item.fixedlengthofstring !== undefined && /^\d+$/.test(""+item.fixedlengthofstring)? item.fixedlengthofstring : undefined,
    disableincludeandexclude: item.disableincludeandexclude !== undefined? item.disableincludeandexclude : undefined,
    search: {
      single: '',
      searchtype: 'SINGLE',
      searchedornot: false,
      trueorfalse: false,
      multiple: {
        ...searchStringDefaultObject(),
        include: {
          ...searchStringDefaultObject(),
        },
        exclude: {
          ...searchStringDefaultObject(),
        },
        includeorexcludeformat: 'STARTS-WITH',
        atnumbersearch: item.disableincludeandexclude !== undefined && item.disableincludeandexclude === false && item.fixedlengthofstring !== undefined && /^\d+$/.test(""+item.fixedlengthofstring)? {
          last: '',
          first: '',
          thenumberbeforethelast: {
            thenumberbefore: '',
            thelast: '',
          },
          afterthefirstthenext: {
            afterthefirst: '',
            thenext: '',
          },
          search: {
            atnumberformat: 'LAST',
            tab: "GREATER-THAN",
            greaterthan: '',
            lessthan: '',
            equalto: {
              single: "",
              pages: [],
              deleting: false,
              bottom: false,
              shake: [],
              show: [],
              addeditemsref: [],
              endoflistitemref: undefined,
              addloading: false,
              loading: false,
              inneraddeditemsref: [],
            },
            notequalto: {
              single: "",
              pages: [],
              deleting: false,
              bottom: false,
              shake: [],
              show: [],
              addeditemsref: [],
              endoflistitemref: undefined,
              addloading: false,
              loading: false,
              inneraddeditemsref: [],
            },
            fromto: {
              from: "",
              to: "",
            },
            exclude: {
              fromto: {
                singlefrom: "",
                singleto: "",
                bottom: false,
                shake: [],
                pages: [],
                deleting: false,
                addloading: false,
                loading: false,
                addeditemsref: [],
                inneraddeditemsref: [],
                endoflistitemref: undefined,
                show: [],
              },
              equalto: {
                single: "",
                pages: [],
                deleting: false,
                shake: [],
                bottom: false,
                show: [],
                addeditemsref: [],
                endoflistitemref: undefined,
                addloading: false,
                loading: false,
                inneraddeditemsref: [],
              },
            },
          }
        } : undefined
      }
    },
    searchFrom: "SERVER",
    concatenated:
      item.concatenated !== undefined
        ? formConcatenatedSearch(item.concatenated.fields)
        : undefined,
  } as NumberStringType;
}
  
function getSingleWordStringTypeObject(item: CardInnerType & {
  concatenated?: SingleWordConcatenatedType | undefined;
  fixedlengthofstring?: number | undefined;
  disableincludeandexclude?: boolean | undefined;
}) {
  const attribute = item.name.replace(/\s/g, "").toLowerCase().trim();
  return {
    ...getIdentityItem(item, attribute, "SingleWordString"),
    img: {
      ascclicked: "sort-a-z.png",
      descclicked: "sort-z-a.png",
      mixclicked: "mix.png",
    },
    fixedlengthofstring: item.disableincludeandexclude !== undefined && item.fixedlengthofstring !== undefined && /^\d+$/.test(""+item.fixedlengthofstring)? item.fixedlengthofstring : undefined,
    disableincludeandexclude: item.disableincludeandexclude !== undefined? item.disableincludeandexclude : undefined,
    search: {
      single: '',
      searchtype: 'SINGLE',
      searchedornot: false,
      trueorfalse: false,
      multiple: {
        ...searchStringDefaultObject(),
        include: {
          ...searchStringDefaultObject(),
        },
        exclude: {
          ...searchStringDefaultObject(),
        },
        includeorexcludeformat: 'STARTS-WITH',
        atnumbersearch: item.disableincludeandexclude !== undefined && item.disableincludeandexclude === false && item.fixedlengthofstring !== undefined && /^\d+$/.test(""+item.fixedlengthofstring)? {
          last: '',
          first: '',
          thenumberbeforethelast: {
            thenumberbefore: '',
            thelast: '',
          },
          afterthefirstthenext: {
            afterthefirst: '',
            thenext: '',
          },
          search: {
            atnumberformat: 'LAST',
            tab: "GREATER-THAN",
            greaterthan: '',
            lessthan: '',
            equalto: {
              single: "",
              pages: [],
              deleting: false,
              bottom: false,
              shake: [],
              show: [],
              addeditemsref: [],
              endoflistitemref: undefined,
              addloading: false,
              loading: false,
              inneraddeditemsref: [],
            },
            notequalto: {
              single: "",
              pages: [],
              deleting: false,
              bottom: false,
              shake: [],
              show: [],
              addeditemsref: [],
              endoflistitemref: undefined,
              addloading: false,
              loading: false,
              inneraddeditemsref: [],
            },
            fromto: {
              from: "",
              to: "",
            },
            exclude: {
              fromto: {
                singlefrom: "",
                singleto: "",
                bottom: false,
                shake: [],
                pages: [],
                deleting: false,
                addloading: false,
                loading: false,
                addeditemsref: [],
                inneraddeditemsref: [],
                endoflistitemref: undefined,
                show: [],
              },
              equalto: {
                single: "",
                pages: [],
                deleting: false,
                shake: [],
                bottom: false,
                show: [],
                addeditemsref: [],
                endoflistitemref: undefined,
                addloading: false,
                loading: false,
                inneraddeditemsref: [],
              },
            },
          }
        } : undefined
      }
    },
    searchFrom: "SERVER",
    concatenated:
      item.concatenated !== undefined
        ? formConcatenatedSearch(item.concatenated.fields)
        : undefined,
  } as SingleWordStringType;
}
  
export function generateSearchSortAndFilterCards(config: CardType<CardInnerType>, json: DistinctRecordType) {
  distinctRecords = json;
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
