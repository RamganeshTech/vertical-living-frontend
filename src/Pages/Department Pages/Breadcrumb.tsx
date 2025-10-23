// components/Breadcrumb.tsx
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

const breadcrumbConfig: Record<string, BreadcrumbItem[]> = {
  '/accounting': [
    { label: 'Accounting', path: '/accounting' }
  ],
  '/customermain': [
    { label: 'Accounting', path: '/accounting' },
    { label: 'Customers', path: '/customermain' }
  ],
  '/invoicemain': [
    { label: 'Accounting', path: '/accounting' },
    { label: 'Invoices', path: '/invoicemain' }
  ],
};

export const Breadcrumb = () => {
  const location = useLocation();
  
  // Get base path (without dynamic params)
  const basePath = '/' + location.pathname.split('/')[1];
  
  // Get breadcrumb items from config
  const items = breadcrumbConfig[basePath] || [];
  
  // Handle dynamic routes (single pages)
  let displayItems = [...items];
  if (location.pathname.includes('/single/')) {
    displayItems.push({ label: 'Details' });
  } else if (location.pathname.includes('/create')) {
    displayItems.push({ label: 'Create New' });
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4 px-4 py-3 bg-gray-50 rounded-lg">
      <Link to="/" className="hover:text-blue-600 transition-colors">
        <i className='fas fa-home' />
      </Link>
      
      {displayItems.map((item, index) => (
        <div key={index} className="flex items-center">
          <i className=" fas fa-chevron-arrow-right mx-2 text-gray-400" />
          {item.path && index !== displayItems.length - 1 ? (
            <Link 
              to={item.path} 
              className="hover:text-blue-600 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-semibold">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};