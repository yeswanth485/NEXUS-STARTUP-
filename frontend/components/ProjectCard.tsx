'use client';

import Link from 'next/link';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { Clock, MapPin, Eye, FileText } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  variant?: 'default' | 'compact';
}

export default function ProjectCard({ project, variant = 'default' }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.id}`} className={cn(
      'card-hover block p-6',
      variant === 'compact' && 'p-4'
    )}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="badge-primary">{project.category}</span>
            <span className={cn(
              'badge',
              project.status === 'open' ? 'bg-emerald-100 text-emerald-700' :
              'bg-surface-100 text-surface-600'
            )}>
              {project.status}
            </span>
          </div>
          <h3 className={cn(
            'font-semibold text-surface-900 truncate',
            variant === 'compact' ? 'text-base' : 'text-lg'
          )}>
            {project.title}
          </h3>
          <p className="text-sm text-surface-500 mt-1 line-clamp-2">{project.description}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-lg font-bold text-nexus-600">
            {formatCurrency(project.budget_min)} - {formatCurrency(project.budget_max)}
          </p>
          <p className="text-xs text-surface-400 mt-1">{project.project_type}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-surface-400">
        {project.client && (
          <span className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-surface-200 flex items-center justify-center text-[10px] font-medium text-surface-600">
              {project.client.full_name?.[0] || 'C'}
            </div>
            {project.client.full_name}
          </span>
        )}
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{project.timeline}</span>
        <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{project.views_count || 0} views</span>
        <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" />{project.proposals_count || 0} proposals</span>
        <span className="ml-auto">{formatDate(project.created_at)}</span>
      </div>

      {project.skills_required?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.skills_required.slice(0, 4).map((skill: string) => (
            <span key={skill} className="px-2.5 py-0.5 rounded-full bg-surface-100 text-surface-600 text-[11px] font-medium">
              {skill}
            </span>
          ))}
          {project.skills_required.length > 4 && (
            <span className="px-2.5 py-0.5 rounded-full bg-surface-100 text-surface-400 text-[11px] font-medium">
              +{project.skills_required.length - 4}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
