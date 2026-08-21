// src/components/index.ts

// Opção A: Se o Template e Image forem exportados como named exports (export const Template = ...)
export * from './Template';
export * from './ImageCard';


// Opção B: Se eles forem exportados como default (export default Template), re-exporte assim:
// export { default as Template } from './Template';
// export { default as ImageCard } from './Image';