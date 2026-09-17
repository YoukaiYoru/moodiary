import { Navigate } from "react-router-dom";
import Loader from "@/components/Loader";
import { useAuth } from "@/hooks/useAuth";
type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div>
        <Loader isLoaded={false} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
}
