<script lang="ts">

export type CalendarType<T> = {
  [key: number]: {
    [key: number]: (T & {
      status?: 'ENABLE' | 'DISABLE' | undefined;
      selected?: "SELECTED" | "DESELECTED" | "HIGHLIGHTED" | undefined;
      date: string;
      day: number;
    })[];
  }[];
};

export type DateSelectionsType = {
  //key is years
  [key: number]: {
    //key is months
    [key: number]: {
      //key is week number
      [key: number]: {
        [key: number]: {
          status?: 'ENABLE' | 'DISABLE' | undefined;
          selected?: "SELECTED" | "DESELECTED" | "HIGHLIGHTED" | undefined;
          date: string;
          day: number;
          readonlystatus?: 'ENABLE' | 'DISABLE' | undefined;
        }[];
      }[];
    }[];
  }[];
};

export type VisibleCalendarPropType = {
  maxdate: string;
  mindate: string;
  isoweek: string;
  format: "RANGE" | "MULTIPLE-OR-SINGLE";
  title: string;
  selections: DateSelectionsType;
};

export type RangeFirstSelectionType = {
  date: string;
  year: number;
  month: number;
  day: number;
};

export type YearMonthClickable<T> = {
  month: number;
  year: number;
  clickable: boolean;
  calendar: CalendarType<T>;
};

export type PositionTrackerType = {
  ref: HTMLLabelElement;
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
  selections: DateSelectionsType;
};

</script>