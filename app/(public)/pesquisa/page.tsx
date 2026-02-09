export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SearchResultsContainer } from "@/app/_components/organisms/SearchResultsContainer";
import { Header } from "@/app/_components/organisms/Header";

export default function SearchPage() {
  return (
    <>
    <Header></Header>
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-[#C4161C] animate-spin" />
            </div>
          }
        >
          <SearchResultsContainer />
        </Suspense>
      </div>
    </div>
    </>
  );
}