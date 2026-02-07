// app/_components/common/Container.tsx
interface ContainerProps {
  children: React.ReactNode;
}

export const Container = ({ children }: ContainerProps) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
};