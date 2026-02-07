// app/_components/categorias/CategoryActions.tsx
'use client'

import { DeleteButton } from "../_components/atoms/DeleteButton";
import { EditButton } from "../_components/atoms/EditButton";
import { ViewButton } from "../_components/atoms/ViewButton";

interface CategoryActionsProps {
  categoryId: number;
  categoryName: string;
}

export const CategoryActions = ({ categoryId, categoryName }: CategoryActionsProps) => {
  return (
    <div className="flex gap-2">
      <ViewButton categoryId={categoryId} />
      <EditButton categoryId={categoryId} />
      <DeleteButton categoryId={categoryId} categoryName={categoryName} />
    </div>
  );
};