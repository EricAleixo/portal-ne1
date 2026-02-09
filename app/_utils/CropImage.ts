// app/_utils/CropImage.ts
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export async function getCroppedImage(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<File> {
  console.log('getCroppedImage chamada com:', { imageSrc: imageSrc.substring(0, 50), pixelCrop });
  
  const image = await createImage(imageSrc);
  console.log('Imagem carregada:', { width: image.width, height: image.height });
  
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  // Define o tamanho do canvas igual à área cortada
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  
  console.log('Canvas criado:', { width: canvas.width, height: canvas.height });

  // CORREÇÃO: Desenha a parte cortada da imagem corretamente
  ctx.drawImage(
    image,
    pixelCrop.x,      // sourceX - onde começar a cortar na imagem original
    pixelCrop.y,      // sourceY - onde começar a cortar na imagem original
    pixelCrop.width,  // sourceWidth - largura da área a cortar
    pixelCrop.height, // sourceHeight - altura da área a cortar
    0,                // destX - posição X no canvas de destino
    0,                // destY - posição Y no canvas de destino
    pixelCrop.width,  // destWidth - largura no canvas de destino
    pixelCrop.height  // destHeight - altura no canvas de destino
  );
  
  console.log('Imagem desenhada no canvas');

  // Converte canvas para Blob e depois para File
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Canvas is empty"));
        return;
      }
      
      const file = new File([blob], "profile-photo.jpg", {
        type: "image/jpeg",
      });
      
      console.log('Arquivo criado:', { name: file.name, size: file.size, type: file.type });
      resolve(file);
    }, "image/jpeg", 0.95);
  });
}