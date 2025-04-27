
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      <Button asChild>
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFound;
