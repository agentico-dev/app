
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem key="breadcrumb-home">
          <BreadcrumbLink asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {items.map((item, index) => {
          const isLastItem = index === items.length - 1;
          
          return isLastItem ? (
            <BreadcrumbItem key={`item-${index}`}>
              <BreadcrumbPage>
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <React.Fragment key={`fragment-${index}`}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to={item.path || '#'}>
                    {item.icon && <span className="mr-1">{item.icon}</span>}
                    {item.label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default BreadcrumbNav;
