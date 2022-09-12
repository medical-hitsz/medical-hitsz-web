export type ApiResponsePromise<T = any> = Promise<ApiResponse<T>>;

export declare interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}
