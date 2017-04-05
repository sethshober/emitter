# About

An EventEmitter is responsible for managing a set of listeners and publishing
events to them when it is told that such events happened. This module provides a
basic `EventEmitter` class with zero dependencies.


Functionality includes:

- Emitting named events with any number of arguments.
- Registering handler functions for named events that are passed the appropriate arguments on emission.
- Registering a "one-time" handler that will be called at most one time.
- Removing specific previously-registered event handlers and/or all previously-registered event handlers.
- This module should be suitable for publishing to npm, though it is not necessary for you to do so.

# Usage:

Run tests: `npm test`

Initialize emitter: `new EventEmitter()`

# Documentation

See our full documentation here:

[http://sethshober.com/emitter-documentation/EventEmitter.html](http://sethshober.com/emitter-documentation/EventEmitter.html)