// src/custom.d.ts

// CSS Module을 위한 타입 선언
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// 이미지 파일을 위한 타입 선언
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';