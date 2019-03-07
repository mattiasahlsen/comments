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

export function shortString(str, max) {
  return str.length > max ? str.substring(0, max) + '...' : str
}

export function absPath(url) {
  if (!validUrl.isWebUri(url)) return 'http://' + url
  else return url
}
export function normalizeUrl(url) {
  const parsed = parseUrl(absPath(url).replace(/\/$/, ''))
  return parsed.hostname.replace('www.', '') + parsed.pathname
}
export function normHostname(url) {
  const parsed = parseUrl(absPath(url))
  return parsed.hostname
}

export function isValid(url) {
  url = absPath(url)
  return validUrl.isWebUri(url) && parseUrl(url).hostname.indexOf('.') !== -1
}
