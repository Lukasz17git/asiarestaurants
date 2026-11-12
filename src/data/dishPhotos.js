// 'uramaki-tiger' -> /dishes/photos-for-web/uramaki-tiger.webp; null without a photo
export const getDishPhotoUrl = (photo) => (photo ? `${process.env.PUBLIC_URL}/dishes/photos-for-web/${photo}.webp` : null)
