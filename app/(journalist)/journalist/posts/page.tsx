import { JournalistPostagens } from "@/app/_components/pages/JournalistPostagens";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function JournalistPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  
  return <JournalistPostagens currentPage={currentPage} />;
}