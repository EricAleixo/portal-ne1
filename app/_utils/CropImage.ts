// app/_utils/cropImage.ts
export const getCroppedImage = async (
  imageSrc: string,
  crop: { x: number; y: number },
  zoom: number,
  aspect = 1
): Promise<File> => {
  const image = new Image();
  image.src = imageSrc;

  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const size = Math.min(image.width, image.height);
  canvas.width = size;
  canvas.height = size;

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    size / zoom,
    size / zoom,
    0,
    0,
    size,
    size
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], "profile.jpg", { type: "image/jpeg" }));
    }, "image/jpeg");
  });
};
