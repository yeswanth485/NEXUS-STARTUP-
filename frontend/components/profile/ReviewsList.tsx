'use client'
import { Star } from 'lucide-react'

export function ReviewsList({ reviews, rating, ratingCount }: { reviews: any[]; rating?: number; ratingCount?: number }) {
  if (!reviews?.length) return <p className="text-sm" style={{ color: 'var(--text3)' }}>No reviews yet.</p>
  return (
    <div>
      {rating && (
        <div className="flex items-center gap-3 mb-6 p-4 rounded-xl" style={{ background: 'var(--bg3)' }}>
          <span className="text-3xl font-bold text-white">{rating.toFixed(1)}</span>
          <div>
            <div className="flex gap-0.5">{Array.from({length:5}).map((_,i) => <Star key={i} className="w-4 h-4" fill={i < Math.round(rating) ? 'var(--gold)' : 'none'} style={{ color: 'var(--gold)' }} />)}</div>
            <span className="text-xs" style={{ color: 'var(--text3)' }}>{ratingCount || 0} reviews</span>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="p-4 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {r.reviewer?.full_name?.[0] || '?'}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{r.reviewer?.full_name || 'Anonymous'}</p>
                <div className="flex gap-0.5">{Array.from({length:5}).map((_,i) => <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : ''}`} style={{ color: 'var(--gold)' }} />)}</div>
              </div>
            </div>
            {r.comment && <p className="text-sm" style={{ color: 'var(--text2)' }}>{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
