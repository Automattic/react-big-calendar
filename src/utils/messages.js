import invariant from 'invariant';

 let messages = {
  date: 'Date',
  time: 'Time',
  event: 'Event',
  allDay: 'all day',
  week: 'Week',
  day: 'Day',
  month: 'Month',
  previous: 'back',
  next: 'next',
  yesterday: 'yesterday',
  tomorrow: 'tomorrow',
  today: 'Today',
  agenda: 'Agenda',

  join: 'Join this calendar',
  joined: 'Joined',
  leave: 'Leave',

  showMore: total => `+${total} more`
}

export function set(key, msg){
  invariant(messages.hasOwnProperty(key),
    `The message key: "${key}" is not a valid message name. ` +
    `valid keys are: ${Object.keys(messages).join(', ')}`
  )

  messages[key] = msg;
}

export function result(msg, ...args){
  return typeof msg === 'function' ? msg(args) : msg
}

export default function messages(msgs){
  return {
    ...messages,
    ...msgs
  }
}
