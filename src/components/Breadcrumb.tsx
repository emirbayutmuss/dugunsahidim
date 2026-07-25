import { Fragment } from 'react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

const HOME_CRUMB: BreadcrumbItem = { label: 'Ana Sayfa', to: '/' }

export function Breadcrumb({ items }: BreadcrumbProps) {
  const crumbs = [HOME_CRUMB, ...items]

  return (
    <nav aria-label="breadcrumb" className="mb-4 text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && (
                <li aria-hidden="true" className="text-accent-foreground/50">
                  &gt;
                </li>
              )}
              <li>
                {crumb.to && !isLast ? (
                  <Link to={crumb.to} className="hover:text-foreground hover:underline">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-foreground/70' : ''}>
                    {crumb.label}
                  </span>
                )}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
