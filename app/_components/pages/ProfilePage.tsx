// app/(journalist)/profile/page.tsx
import { getSessionOrThrow } from "@/app/api/_utils/session";
import { JournalistLayout } from "../layouts/JournalistLayout";
import { userService } from "@/app/_services/user.service";
import { notFound } from "next/navigation";
import { ProfilePhotoUpload } from "../organisms/ProfilePhotoUpload";

export const ProfilePage = async () => {
  const session = await getSessionOrThrow();

  if (!session.user.name) {
    notFound();
  }

  const user = await userService.findByName(session.user.name);

  if (!user) {
    notFound();
  }

  return (
    <JournalistLayout>
      <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <div className="flex items-center gap-6">
          {/* Upload fica no client */}
          <ProfilePhotoUpload
            initialPhoto={user.photoProfile || "/avatar-placeholder.png"}
            userName={user.name}
            userId={user.id}
          />

          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>

            <p className="text-sm text-gray-500">
              Cargo: <span className="font-medium">{user.role}</span>
            </p>

            <p className="text-sm mt-1">
              Status:{" "}
              <span
                className={
                  user.actived
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {user.actived ? "Ativo" : "Inativo"}
              </span>
            </p>
          </div>
        </div>

        <hr className="my-6" />

        <div className="text-sm text-gray-600">
          <p>
            <strong>Conta criada em:</strong>{" "}
            {user.createdAt &&
              new Date(user.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </section>
    </JournalistLayout>
  );
};
