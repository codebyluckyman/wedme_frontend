export const handleSaveImage = (imageUrl: string, index: number) => {
  const downloadUrl = `/api/image_url?url=${encodeURIComponent(imageUrl)}`;
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `generated_invitation_${index + 1}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
