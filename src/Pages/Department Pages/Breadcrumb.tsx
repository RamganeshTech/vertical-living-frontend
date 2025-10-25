// components/Breadcrumb.tsx
import { Link } from "react-router-dom";

export interface BreadcrumbItem {
  label: string;
  path?: string; // Optional — last item may not have a path
}

interface BreadcrumbProps {
  paths: BreadcrumbItem[];
}

export const Breadcrumb = ({ paths }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 px-4 py-1">
      {/* <Link to="/" className="hover:text-blue-600 transition-colors">
        <i className="fas fa-home" />
      </Link> */}

      {paths.map((item, index) => (
        <div key={index} className="flex items-center">
          {item.path && index !== paths.length - 1 ? (
            <Link
              to={item.path}
              className="hover:text-blue-600 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold">{item.label}</span>
          )}
          {index !== paths.length-1 && <i className="fas fa-chevron-right ml-1 text-gray-400" />}
        </div>
      ))}
    </nav>
  );
};
