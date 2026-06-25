export const projectCategories = [
  { value: 'Web Dev', label: 'Web Development', emoji: '🌐' },
  { value: 'Mobile', label: 'Mobile Development', emoji: '📱' },
  { value: 'AI/ML', label: 'AI & Machine Learning', emoji: '🤖' },
  { value: 'Design', label: 'Design & UX', emoji: '🎨' },
  { value: 'Marketing', label: 'Marketing & SEO', emoji: '📈' },
  { value: 'SaaS', label: 'SaaS Development', emoji: '☁️' },
  { value: 'E-Commerce', label: 'E-Commerce', emoji: '🛒' },
];

export const experienceLevels = [
  { value: 'entry', label: 'Entry Level' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'expert', label: 'Expert' },
];

export const planFeatures = {
  free: { label: 'Free', projects: 3, proposals: 10, price: 0 },
  professional: { label: 'Professional', projects: 20, proposals: 100, price: 499, popular: true },
  business: { label: 'Business', projects: 100, proposals: 500, price: 1499 },
  enterprise: { label: 'Enterprise', projects: -1, proposals: -1, price: 4999 },
};

export const roleLabels: Record<string, string> = {
  client: 'Client',
  freelancer: 'Freelancer',
  startup: 'Startup',
};

export const statusColors: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-700',
  in_progress: 'bg-blue-100 text-blue-700',
  review: 'bg-amber-100 text-amber-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-gray-100 text-gray-700',
  accepted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  active: 'bg-blue-100 text-blue-700',
};
