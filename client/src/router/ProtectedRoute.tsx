import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Loader from "@/components/Loader";
type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div>
        <Loader isLoaded={isLoaded} />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" />;
  }

  return children;
}
