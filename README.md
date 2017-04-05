Event Emitters are objects that serve as the core building block in event-driven architectures.
They simplify the process of handling asynchronous events and enable clean and decoupled code.

Create an Event Emitter module in JavaScript (as modern of a version as you prefer) with documentation and tests.
Your implementation should allow for:

Emitting named events with any number of arguments.
Registering handler functions for named events that are passed the appropriate arguments on emission.
Registering a "one-time" handler that will be called at most one time.
Removing specific previously-registered event handlers and/or all previously-registered event handlers.
This module should be suitable for publishing to npm, though it is not necessary for you to do so.

Do not subclass or otherwise require an existing Event Emitter module.