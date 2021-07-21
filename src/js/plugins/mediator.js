const eventMediator = (function () {
  const subscribers = {}

  return {
    subscribe(event, callback) {
      subscribers[event] = subscribers[event] || []
      subscribers[event].push(callback)
    },

    unsubscibe(event, callback) {
      if (!event) {
        subscribers = {}
      } else if (event && !callback) {
        subscribers[event] = []
      } else {
        const eventIdx = subscribers[event].indexOf(callback)
        subscribers[event].splice(eventIdx, 1)
      }
    },

    trigger(event, data) {
      if (subscribers[event]) {
        subscribers[event].forEach(callback => callback(data))
      }
    }
  }
})()

export default eventMediator