export declare interface User {
  nickname: string;
  avatar: string;
}

export declare interface CosSecret {
  credentials: {
    TmpSecretId: string;
    TmpSecretKey: string;
    Token: string;
  };
  startTime: number;
  expiredTime: number;
}

export declare interface CosConfig {
  directory: string;
  bucket: string;
  region: string;
}
