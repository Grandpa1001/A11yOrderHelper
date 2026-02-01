/// <reference types="vite/client" />

declare module "*.css?inline" {
  const src: string;
  export default src;
}
