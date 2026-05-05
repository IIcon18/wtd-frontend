/**
 * WorkoutMessage — форматирование ответа AI-тренера.
 * Стиль: чистый текст с визуальной иерархией, без карточек.
 */

const SECTION_HEADERS: Record<string, string> = {
  'разминка': '🔥 Разминка',
  'основное': '💪 Основное',
  'основная': '💪 Основная часть',
  'заминка':  '🧘 Заминка',
}

function isSectionHeader(line: string): string | null {
  const normalized = line.trim().toLowerCase().replace(/[:\-–—]/g, '').trim()
  return SECTION_HEADERS[normalized] ?? null
}

function isWorkoutResponse(text: string): boolean {
  const lower = text.toLowerCase()
  return (
    (lower.includes('разминка') || lower.includes('основное') || lower.includes('основная')) &&
    lower.includes('заминка')
  )
}

function renderLine(line: string, i: number) {
  // Нумерованная строка: "1. ..."
  const numbered = line.match(/^(\d+)\.\s+(.+)/)
  if (numbered) {
    return (
      <div key={i} className="flex gap-2 text-sm text-text-secondary leading-relaxed pl-2">
        <span className="text-text-muted w-4 flex-shrink-0">{numbered[1]}.</span>
        <span>{numbered[2]}</span>
      </div>
    )
  }

  // Строка с "(отдых ...)"
  const rest = line.match(/^(.*?)(\(отдых[^)]+\))\s*$/)
  if (rest) {
    return (
      <p key={i} className="text-sm text-text leading-relaxed pl-2">
        {rest[1].trim()} <span className="text-text-muted text-xs">{rest[2]}</span>
      </p>
    )
  }

  return (
    <p key={i} className="text-sm text-text leading-relaxed pl-2">
      {line}
    </p>
  )
}

function WorkoutContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const result: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd()

    if (!line.trim()) continue

    // Итог
    if (/^итог\s*:/i.test(line.trim())) {
      const value = line.trim().replace(/^итог\s*:\s*/i, '')
      result.push(
        <div key={key++} className="flex items-center gap-2 pt-1">
          <div className="flex-1 h-px bg-surface-light" />
          <span className="text-text-secondary text-xs uppercase tracking-widest">Итого</span>
          <span className="text-primary font-bold text-base">{value}</span>
        </div>
      )
      continue
    }

    // Совет тренера
    if (/^💬/.test(line.trim()) || /^совет тренера\s*:/i.test(line.trim())) {
      const tip = line.trim().replace(/^💬\s*/, '').replace(/^совет тренера\s*:\s*/i, '')
      result.push(
        <p key={key++} className="text-sm text-text-secondary italic leading-relaxed pt-1">
          💬 {tip}
        </p>
      )
      continue
    }

    // Заголовок секции
    const sectionLabel = isSectionHeader(line)
    if (sectionLabel) {
      if (result.length > 0) {
        result.push(<div key={key++} className="h-3" />)
      }
      result.push(
        <p key={key++} className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          {sectionLabel}
        </p>
      )
      continue
    }

    result.push(renderLine(line, key++))
  }

  return <div className="space-y-1">{result}</div>
}

interface Props {
  content: string
  isAi: boolean
}

export default function WorkoutMessage({ content, isAi }: Props) {
  if (!isAi) {
    return <p className="text-text text-sm sm:text-base">{content}</p>
  }

  if (!isWorkoutResponse(content)) {
    return (
      <p className="text-text text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
    )
  }

  return <WorkoutContent content={content} />
}
