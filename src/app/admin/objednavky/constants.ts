export const STATUS_LABELS: Record<string, string> = {
  new: 'Nová',
  confirmed: 'Potvrzená',
  ready: 'Připravena',
  picked_up: 'Vyzvednuta',
  cancelled: 'Zrušena',
}

export const STATUS_STYLES: Record<string, string> = {
  new: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-700 border border-blue-200',
  ready: 'bg-purple-50 text-purple-700 border border-purple-200',
  picked_up: 'bg-green-50 text-green-700 border border-green-200',
  cancelled: 'bg-red-50 text-red-700 border border-red-200',
}
