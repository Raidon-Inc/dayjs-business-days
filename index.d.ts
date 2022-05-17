import { PluginFunc, ConfigType, OpUnitType } from 'dayjs';

declare const plugin: PluginFunc;
export = plugin;

declare module 'dayjs' {
  interface Dayjs {
    isHoliday: () => boolean;
    isBusinessDay: () => boolean;
    nextBusinessDay: () => Dayjs;
    prevBusinessDay: () => Dayjs;
    businessDaysInMonth: () => number;
    businessWeeksInMonth: () => number;
    businessDaysAdd: (days: number) => Dayjs;
    addDay: (days: number) => Dayjs;
    businessDaysSubtract: (days: number) => Dayjs;
    businessDiff: (date: Dayjs) => number;
  }
}
