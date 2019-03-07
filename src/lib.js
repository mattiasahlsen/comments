import parseUrl from 'url-parse'
import validUrl from 'valid-url'

export function dateString(date) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]
  const days = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ]
  const now = new Date()

  if (date.getFullYear() === now.getFullYear()) {
    if (date.getMonth() === now.getMonth()) {
      if (date.getDate() === now.getDate()) {
        const parts = date.toTimeString().split(':')
        return parts[0] + ':' + parts[1]
      }
      if (now.getDate() - date.getDate() < 7) {
        return days[date.getDay()]
      }
      return days[date.getDay()] + ' ' + date.getDate()
    } else return months[date.getMonth()] + ' ' + date.getDate()
  } else {
    return months[date.getMonth()] + ' ' + date.getDate() + ' ' + date.getFullYear()
  }
}

export function normalizeUrl(url) {
  const parsed = parseUrl(url)
  if (parsed.hostname === window.location.hostname) {
    return parsed.pathname.slice(1)
  }
  return parsed.hostname.replace('www.', '') + parsed.pathname
}
export function normHostname(url) {
  const parsed = parseUrl(url)
  if (parsed.hostname === window.location.hostname) {
    return parseUrl('http://' + parsed.pathname.slice(1)).hostname
  } else return parsed.hostname
}

export function isValid(url) {
  const parsed = parseUrl(url)
  url = parsed.hostname === window.location.hostname
    ? 'http://' + parsed.pathname.slice(1) : parsed.href
  return validUrl.isWebUri(url) && parseUrl(url).hostname.search(/\./) !== -1
}
