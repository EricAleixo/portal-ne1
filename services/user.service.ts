// app/_services/user.service.client.ts
import { api } from "./api";

export const userServiceClient = {
  updateProfileImage: async (userId: number, file: File) => {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await api.put(
      `/users/${userId}/image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data;
  },
};
