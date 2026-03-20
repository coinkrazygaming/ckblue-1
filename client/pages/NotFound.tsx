import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { PlaceholderPage } from "@/components/PlaceholderPage";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <PlaceholderPage
      title="Page Not Found"
      description={`The page you're looking for doesn't exist. This is embarrassing, but the page at "${location.pathname}" could not be found.`}
      icon={<AlertCircle />}
      ctaLink="/"
      ctaText="Back to Home"
    />
  );
};

export default NotFound;
