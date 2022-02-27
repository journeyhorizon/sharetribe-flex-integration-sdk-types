
export interface ITokenStore {
  getToken(): any;
  setToken(data: any): void | Promise<void>;
  removeToken(): void | Promise<void>;
}
export function memoryStore(): ITokenStore;
export function fileStore(): ITokenStore;