import ImageSize from 'image-size';
import { RECOMMENDED_IMAGE_HEIGHT, RECOMMENDED_IMAGE_WIDTH } from '../config';

const ValidateImageDimensions = (path: string) => {
    const { height, width } = ImageSize(path);
    return height >= RECOMMENDED_IMAGE_HEIGHT && width >= RECOMMENDED_IMAGE_WIDTH;
};

export default ValidateImageDimensions;