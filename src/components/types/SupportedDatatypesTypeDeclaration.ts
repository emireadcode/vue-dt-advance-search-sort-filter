export type StringSearchType = {
  single: string;
  value: string[];
  index: number;
  temporary: string[];
  bottom: boolean;
  done: boolean;
  loading: boolean;
  addloading: boolean;
};
  
export type MultipleWordsStringConcatenatedFieldType = {
  [key: string]: {
    aword: boolean;
    name: string;
    attribute?: string | undefined;
    table?: string | undefined;
    join?: string | undefined;
    search?:
      | (StringSearchType & {
          include?: StringSearchType | undefined;
          exclude?: StringSearchType | undefined;
        })
      | undefined;
  };
};

type StartModifierWildCardType = "@" | "+" | "*" | "(" | "#" | "/" | "{" | "(" | "[" | "[";

type StartModifierWildCardTypeUnion = `${StartModifierWildCardType}${StartModifierWildCardType}`;

type EndModifierWildCardType = "*" | ")" | "#" | "/" | "]" | "}";

type EndModifierWildCardTypeUnion = `${EndModifierWildCardType}${EndModifierWildCardType}`;
  
type DelimiterType = " - " | "-" | "/" | "." | " " | "*" | "" | '' | ', ' | ", " | '?' | '<' | '>' | '%' | '{' | '}' | '(' | ')' | '+' | '#' | '$' | '@' | '_' | '|' | '=' | '&';

type DelimiterTypeUnion = `${DelimiterType}${DelimiterType}`;

export type SingleWordStringConcatenatedFieldType = {
  [key: string]: {
    aword: true;
    name: string;
    attribute?: string | undefined;
    table?: string | undefined;
    join?: string | undefined;
    search?: StringSearchType | undefined;
    startmodifierwildcard?: StartModifierWildCardTypeUnion | StartModifierWildCardType | undefined;
    endmodifierwildcard?: EndModifierWildCardTypeUnion | EndModifierWildCardType | undefined;
  };
};
  
export type MultipleWordsStringConcatenatedType = {
  fields: MultipleWordsStringConcatenatedFieldType;
  delimiters: DelimiterType[] | DelimiterType | DelimiterTypeUnion[] | DelimiterTypeUnion | undefined;
};
  
export type SingleWordConcatenatedType = {
  fields: SingleWordStringConcatenatedFieldType;
  delimiters: DelimiterType[] | DelimiterType | DelimiterTypeUnion[] | DelimiterTypeUnion | undefined;
};

export type KeyToNameMappingType = {
  keytonamemapping: {
    [key: string]: string
  };
};
  
export type DateFormat = {
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
  
export type TimeFormat = {
  timeFormat:
    | "24-HOUR-CLOCK-WITHOUT-SECONDS-WITH-LEADING-ZERO"
    | "24-HOUR-CLOCK-WITHOUT-SECONDS-WITHOUT-LEADING-ZERO"
    | "12-HOUR-CLOCK-WITHOUT-SECONDS-WITH-LEADING-ZERO"
    | "12-HOUR-CLOCK-WITHOUT-SECONDS-WITHOUT-LEADING-ZERO"
    | "24-HOUR-CLOCK-WITH-SECONDS"
    | "12-HOUR-CLOCK-WITH-SECONDS";
};
  
export interface IdentityType {
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
  
export interface YearType extends IdentityType {
  search: {
    tab: string;
    multiple_or_single?: number[] | undefined;
    range?: number[] | undefined;
    trueorfalse: boolean;
  };
}
  
export interface MultipleWordsStringType extends IdentityType {
  concatenated?: MultipleWordsStringConcatenatedFieldType | undefined;
  concatenatedname?: string | undefined;
  search: StringSearchType & {
    include?: StringSearchType | undefined;
    exclude?: StringSearchType | undefined;
    trueorfalse: boolean;
  };
  searchFrom?: string | undefined; //DOM or SERVER
}
  
export interface SingleWordStringType extends IdentityType {
  concatenated?: SingleWordStringConcatenatedFieldType | undefined;
  concatenatedname?: string | undefined;
  search: StringSearchType & {
    trueorfalse: boolean;
  };
  searchFrom?: string | undefined; //DOM or SERVER
}
  
export interface NumberStringType extends SingleWordStringType {}
  
export interface KeyToNameType extends IdentityType, KeyToNameMappingType {
  search: {
    trueorfalse: boolean;
  };
}
  
export type DateInnerType = {
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
  
export interface TimeType extends IdentityType {
  search: {
    from_to_time: string[]; //[from, to] always in range
    trueorfalse: boolean;
  };
  searchFrom?: string | undefined; //DOM or SERVER
  timeFormat: TimeFormat["timeFormat"] | {};
}
  
export interface DateType extends IdentityType {
  search: DateInnerType & {
    trueorfalse: boolean;
  };
  dateFormat: DateFormat["dateFormat"];
  searchFrom?: string | undefined; //DOM or SERVER
}
  
export interface DateTimeType extends IdentityType {
  search: DateInnerType & {
    from_to_time: string[]; //[from, to] always in range
    trueorfalse: boolean;
  };
  searchFrom?: string | undefined; //DOM or SERVER
  timeFormat: TimeFormat["timeFormat"] | {};
  dateFormat: DateFormat["dateFormat"];
}
  
export interface NumberType extends IdentityType {
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
  
export type CardInnerType = {
  position?: number | undefined;
  name: string;
  attribute?: string | undefined;
  limit: number;
  table?: string | undefined;
  join?: string | undefined;
};
  
export type CardType<T> = 
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
};

export type DistinctRecordType = { 
  [x: string]: { 
    min?: string | number | null;
    max?: string | number | null;
    data: {
      row: string | number | null;
      checked: boolean;
      selected: boolean;
    }[] | [];
    total: number;
    offset: number;
  }; 
} | null;
  
export type PrimitiveType =
  | YearType
  | NumberType
  | MultipleWordsStringType
  | KeyToNameType
  | DateType
  | DateTimeType
  | TimeType
  | SingleWordStringType
  | NumberStringType;
