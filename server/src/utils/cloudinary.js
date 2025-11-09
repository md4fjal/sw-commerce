import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (fileBuffer, folder = "products") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
        });
      })
      .end(fileBuffer);
  });
};

export const uploadMultipleToCloudinary = async (
  files,
  folder = "products"
) => {
  const uploadPromises = files.map((file) =>
    uploadToCloudinary(file.buffer, folder)
  );
  return Promise.all(uploadPromises);
};

export const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;
  return cloudinary.uploader.destroy(public_id);
};
