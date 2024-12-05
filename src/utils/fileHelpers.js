export const isImageFile = (filename) => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    return imageExtensions.test(filename);
  };
  
  export const formatFileName = (filename) => {
    // Remove extension and replace dashes/underscores with spaces
    return filename
      .split('.')[0]
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  };