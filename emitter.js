'use strict'

/*
 * @description
 * An EventEmitter is responsible for managing a set of listeners and publishing
 * events to them when it is told that such events happened. The following is a
 * very basic EventEmitter class
 */


module.exports = EventEmitter

/**
* @constructor
*/
function EventEmitter() {
  this.events = {}
}


/**
 * Adds a listener to be invoked when events of the specified type are
 * emitted.
 *
 * @param {string}   event    Name of the event to listen to
 * @param {function} listener Function to invoke when the specified event
 *                            is emitted
 */
EventEmitter.prototype.addListener = addListener

// Alias to addListener
EventEmitter.prototype.on = addListener

function addListener(event, listener) {
  const events = this.events
  if (typeof listener === 'function') {
    if (events.hasOwnProperty(event) && Array.isArray(events[event])) {
      this.listeners(event).push(listener)
    } else {
      events[event] = [listener] 
    }
  }
}


/**
 * Removes a registered listener from the emitter.
 *
 * @param {string}   event    Name of the event listening to
 * @param {function} listener Function to remove
 */
EventEmitter.prototype.removeListener = function(event, listener) {
  const events = this.events
  let listeners
  if (typeof listener === 'function' &&
      events.hasOwnProperty(event) &&
      Array.isArray(events[event])) {
    
    listeners = this.listeners(event)
    for (let i = 0; i < listeners.length; i++) {
      if (listeners[i].toString() === listener.toString()) {
        listeners.splice(i, 1)
      }
    }
  }
}


/**
 * Removes all of the registered listeners, including those registered as
 * listener maps.
 *
 * @param {string} event Name of the event to remove listeners from
 */
EventEmitter.prototype.removeAllListeners = function(event) {
  const events = this.events
  if (events.hasOwnProperty(event)) {
    events[event] = []
  }
}


/**
 * Emits an event of the given type with the given data. All handlers of that
 * particular type will be notified.
 *
 * @param {string} event Name of the event to emit
 * @param {*}            Arbitrary arguments to be passed to each
 *                       registered listener
 *
 * @example
 *   emitter.addListener('someEvent', (message) => {
 *     console.log(message)
 *   })
 *
 *   emitter.emit('someEvent', 'hello') // logs 'hello'
 */
EventEmitter.prototype.emit = function(event) {
  const events = this.events
  const args = Array.prototype.slice.call(arguments, 1)
  let listeners

  if (events.hasOwnProperty(event) && Array.isArray(events[event])) {
    // create a shallow copy
    listeners = this.listeners(event).slice()

    for (let i = 0; i < listeners.length; i++) {
      // The subscription may have been removed during this event loop.
      if (listeners[i]) {
        listeners[i].apply(this, args)
      }
    }
  }
}


/**
 * Much like addListener, except the listener is removed after being invoked.
 *
 * @param {string}   event    Name of the event to listen to
 * @param {function} listener Function to invoke only once when the given
 *                            event is emitted
 */
EventEmitter.prototype.once = function(event, listener) {
  const emitter = this
  emitter.on(event, function listenerWrapper() {
    emitter.removeListener(event, listenerWrapper)
    listener.apply(emitter, arguments)
  })
}


/**
 * Returns an array of listeners that are currently registered for the given
 * event.
 *
 * @param  {string} event Name of the event to query
 * @return {array}
 */
EventEmitter.prototype.listeners = function listeners(event) {
  return this.events.hasOwnProperty(event) ? this.events[event] : []
}
