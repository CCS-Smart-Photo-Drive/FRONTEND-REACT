export function isHDImage(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const isHD = img.width >= 1280 && img.height >= 720;
      resolve(isHD);
    };
    img.src = URL.createObjectURL(file);
  });
}
