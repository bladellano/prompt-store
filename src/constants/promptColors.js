export const PROMPT_COLORS = [
  { value: 'gray', name: 'Cinza', swatch: 'bg-prompt-gray' },
  { value: 'yellow', name: 'Amarelo', swatch: 'bg-prompt-yellow' },
  { value: 'green', name: 'Verde', swatch: 'bg-prompt-green' },
  { value: 'blue', name: 'Azul', swatch: 'bg-prompt-blue' },
  { value: 'purple', name: 'Roxo', swatch: 'bg-prompt-purple' },
  { value: 'pink', name: 'Rosa', swatch: 'bg-prompt-pink' },
  { value: 'orange', name: 'Laranja', swatch: 'bg-prompt-orange' }
]

export const PROMPT_COLOR_VALUES = PROMPT_COLORS.map(c => c.value)

export function promptBlockColorClass(color) {
  const classes = {
    gray: 'bg-prompt-gray border-gray-300',
    yellow: 'bg-prompt-yellow border-yellow-300',
    green: 'bg-prompt-green border-green-300',
    blue: 'bg-prompt-blue border-blue-300',
    purple: 'bg-prompt-purple border-purple-300',
    pink: 'bg-prompt-pink border-pink-300',
    orange: 'bg-prompt-orange border-orange-300'
  }
  return classes[color] || classes.yellow
}

export function promptComposerColorClass(color) {
  const classes = {
    gray: 'bg-prompt-gray border-l-[3px] border-gray-400/90',
    yellow: 'bg-prompt-yellow border-l-[3px] border-yellow-400/90',
    green: 'bg-prompt-green border-l-[3px] border-green-400/90',
    blue: 'bg-prompt-blue border-l-[3px] border-blue-400/90',
    purple: 'bg-prompt-purple border-l-[3px] border-purple-400/90',
    pink: 'bg-prompt-pink border-l-[3px] border-pink-400/90',
    orange: 'bg-prompt-orange border-l-[3px] border-orange-400/90'
  }
  return classes[color] || classes.yellow
}

export function promptCardBorderClass(color) {
  const classes = {
    gray: 'border-l-4 border-l-gray-400',
    yellow: 'border-l-4 border-l-yellow-400',
    green: 'border-l-4 border-l-green-400',
    blue: 'border-l-4 border-l-blue-400',
    purple: 'border-l-4 border-l-purple-400',
    pink: 'border-l-4 border-l-pink-400',
    orange: 'border-l-4 border-l-orange-400'
  }
  return classes[color] || classes.yellow
}

export function promptColorName(color) {
  return PROMPT_COLORS.find(c => c.value === color)?.name ?? color
}
