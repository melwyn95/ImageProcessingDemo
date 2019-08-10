import fs from 'fs';

export const deleteFile = (filePath: string) => fs.unlink(filePath, () => {});