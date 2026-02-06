import Image from "next/image";
import { Badge } from "../atoms/Badge";

export const JournalismHeader = ({ user }: {user: {name: string, avatarUrl: string}}) => {
  return (
    <header className="w-full h-19 px-6 flex items-center justify-between border-b border-[#C4161C] bg-white mb-11">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Image src={"/images/ne11-21.png"} alt={"Logo"} width={180} height={180}></Image>
      </div>

      {/* Usuário */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center flex-col">
            <span className="font-semibold text-[#3d4ba8]">
              {user?.name}
            </span>
            <Badge className="bg-red-100 text-red-700 border border-red-200 font-semibold">
              Jornalista
            </Badge>
        </div>

        <Image
          src={user?.avatarUrl}
          alt="Avatar do usuário"
          className="h-12 w-12 rounded-full object-cover border border-[#6ec263]"
          width={60}
          height={60}
        />
      </div>

    </header>
  );
};
