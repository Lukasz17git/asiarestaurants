// 'uramaki-tiger' -> /dishes/photos-compressed/uramaki-tiger.webp; null without a photo
export const getDishPhotoUrl = (photo) => (photo ? `${process.env.PUBLIC_URL}/dishes/photos-compressed/${photo}.webp` : null)
