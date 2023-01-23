import type { DateType } from "./SupportedDatatypesTypeDeclaration";

export type YearMonthClickable<T> = {
  month: number;
  year: number;
  clickable: boolean;
  calendar: {
    [key: number]: {
      days: {
        [key: number]: (T & {
          status?: 'ENABLE' | 'DISABLE' | undefined;
          readonlystatus?: 'ENABLE' | 'DISABLE' | undefined;
          selected?: "SELECTED" | "DESELECTED" | "HIGHLIGHTED" | "LOCKED" | undefined;
          date: string;
          day: number;
        });
      };
      checked: false | true;
    };
  };
};

export type RangeFirstAndLastSelectionType = {
  date: string;
  year: number;
  month: number;
  day: number;
  week: number;
};

export type PositionTrackerType = {
  ref: HTMLLabelElement | undefined;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type VisibleCalendarType = {
  previous: YearMonthClickable<PositionTrackerType>;
  current: YearMonthClickable<PositionTrackerType>;
  last: YearMonthClickable<{}>;
  first: YearMonthClickable<{}>;
  selections: {
    //key is years
    [key: number]: {
      //key is months
      [key: number]: YearMonthClickable<{}>['calendar'];
    }[];
  };
};

export type RangeSelectionParamsType = {
  rangefirstselection: RangeFirstAndLastSelectionType;
  rangelastselection: RangeFirstAndLastSelectionType;
  rangeselectcount: number;
  inselectionmode: boolean;
  excludedates: boolean;
};