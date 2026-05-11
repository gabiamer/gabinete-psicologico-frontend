declare module "docxtemplater-image-module-free" {
  interface ImageModuleOptions {
    centered?: boolean;
    fileType?: "docx" | "pptx";
    getImage: (tagValue: string, tagName: string) => ArrayBuffer | Buffer | Promise<ArrayBuffer | Buffer>;
    getSize: (img: ArrayBuffer | Buffer, tagValue: string, tagName: string) => [number, number] | Promise<[number, number]>;
  }

  class ImageModule {
    constructor(opts: ImageModuleOptions);
  }

  export = ImageModule;
}
