declare type Recordable<T = any> = Record<string, T>;
/** 将联合类型转为交叉类型 */
declare type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never;

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare type Indexable<T = any> = {
  [key: string]: T;
};

declare type BasicResponseModel<T = any> = {
  code: Key;
  msg: string;
  data: T;
  total?: number;
  [key: string]: T;
};
