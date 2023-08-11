declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MODE: 'development' | 'production';
      PORT: string;
      DB_HOST: string;
      SOCKET_HOST: string;
      SERVER_HOST: string;
      STREAM_HOST: string;
    }
  }
}

export {};
