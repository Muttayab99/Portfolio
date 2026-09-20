import { Link, useLocation } from "react-router-dom";
import { useDocumentMeta } from "@/hooks/use-document-meta";

const NotFound = () => {
  const location = useLocation();
  useDocumentMeta("Page not found");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-6">
        <p className="font-mono text-xs tracking-widest uppercase text-brand/70 mb-3">404</p>
        <h1 className="mb-3 font-heading text-4xl font-bold">Nothing at {location.pathname}</h1>
        <p className="mb-6 text-muted-foreground">That page doesn't exist, or it moved.</p>
        <Link to="/" className="text-brand underline underline-offset-4 hover:opacity-80">
          Back to the portfolio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
