// app/_components/common/EmptyState.tsx
interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};