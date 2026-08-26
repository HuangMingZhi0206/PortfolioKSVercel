// Date helpers for experience/project timelines

const monthsBetween = (start, end) =>
  (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())

export const formatDuration = (totalMonths) => {
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  if (years > 0 && months > 0) return `${years} yr ${months} mos`
  if (years > 0) return `${years} yr${years > 1 ? 's' : ''}`
  return `${months} mos`
}

/** "Jan 2024 - Present · 1 yr 3 mos" */
export const formatPeriod = (startDate, endDate, isCurrent) => {
  const start = new Date(startDate)
  const end = !isCurrent && endDate ? new Date(endDate) : new Date()
  const endLabel = !isCurrent && endDate
    ? end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Present'
  const startLabel = start.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `${startLabel} - ${endLabel} · ${formatDuration(monthsBetween(start, end))}`
}

/** Total span covered by a list of positions at one company. */
export const totalDuration = (positions) => {
  const allDates = positions.flatMap((p) => [
    new Date(p.start_date),
    p.end_date ? new Date(p.end_date) : new Date(),
  ])
  const min = new Date(Math.min(...allDates))
  const max = new Date(Math.max(...allDates))
  return formatDuration(monthsBetween(min, max))
}

/** "Mar 2024" from "2024-03" or "2024-03-15". */
export const formatMonthYear = (dateStr) => {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${names[parseInt(month, 10) - 1]} ${year}`
}
