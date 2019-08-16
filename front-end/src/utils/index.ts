import { MIN_IMAGE_WIDTH, MIN_IMAGE_HEIGHT } from "../constants";

export const head = (arr: FileList) => arr[0];

export const validateImageDimensions = (height: number, width: number) => 
    height >= MIN_IMAGE_HEIGHT && width >= MIN_IMAGE_WIDTH;
