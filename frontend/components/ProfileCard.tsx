'use client';

import Link from 'next/link';
import { cn, getInitials } from '@/lib/utils';
import { Star, MapPin, Briefcase, MessageCircle } from 'lucide-react';

interface ProfileCardProps {
  profile: any;
  variant?: 'default' | 'minimal';
}

export default function ProfileCard({ profile, variant = 'default' }: ProfileCardProps) {
  return (
    <div className={cn(
      'card-hover p-6',
      variant === 'minimal' && 'p-4'
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          'rounded-full bg-gradient-to-br from-nexus-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0',
          variant === 'minimal' ? 'w-10 h-10 text-sm' : 'w-14 h-14 text-lg'
        )}>
          {getInitials(profile.full_name || 'User')}
        </div>
        <div className="flex-1 min-w-0">
          <Link href={`/profile?id=${profile.id}`} className="hover:underline">
            <h3 className="font-semibold text-surface-900 truncate">{profile.full_name || 'Anonymous'}</h3>
          </Link>
          <p className="text-sm text-surface-500 truncate">{profile.title || profile.role}</p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-surface-400">
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              {profile.rating ? `${Number(profile.rating).toFixed(1)} (${profile.rating_count})` : 'No ratings'}
            </span>
            {profile.hourly_rate > 0 && (
              <span>₹{profile.hourly_rate}/hr</span>
            )}
            <span className="capitalize">{profile.role}</span>
          </div>
        </div>
        {variant !== 'minimal' && (
          <Link
            href={`/chat?user=${profile.id}`}
            className="p-2 rounded-xl hover:bg-nexus-50 text-nexus-600 transition-all"
            title="Send message"
          >
            <MessageCircle className="w-5 h-5" />
          </Link>
        )}
      </div>

      {profile.bio && variant !== 'minimal' && (
        <p className="text-sm text-surface-500 mt-3 line-clamp-2">{profile.bio}</p>
      )}

      {profile.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.skills.slice(0, variant === 'minimal' ? 2 : 4).map((skill: string) => (
            <span key={skill} className="px-2.5 py-0.5 rounded-full bg-surface-100 text-surface-600 text-[11px] font-medium">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-surface-100 text-xs text-surface-400">
        {profile.jobs_completed > 0 && (
          <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{profile.jobs_completed} jobs</span>
        )}
        {profile.job_success_rate && (
          <span>{profile.job_success_rate}% success</span>
        )}
        {profile.is_available && (
          <span className="flex items-center gap-1 ml-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Available
          </span>
        )}
      </div>
    </div>
  );
}
