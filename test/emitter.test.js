'use strict'

const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const sinon = require('sinon')
const Emitter = require('../emitter.js')

describe('the Event Emitter', () => {

  describe('when constructing the emitter', () => {

    let emitter

    beforeEach(() => {
      emitter = new Emitter()
    })

    it('initializes with an empty event object', () => {
      should.exist(emitter.events)
      let emptyObject = {}
      expect(emitter.events.toString()).equal(emptyObject.toString())
    })

    it('has an addListener method', () => {
      should.exist(emitter.addListener)
      expect(emitter.addListener).a('function')
    })

    it('has an on method', () => {
      should.exist(emitter.on)
      expect(emitter.on).a('function')
    })

    it('on as an alias to addListener', () => {
      should.exist(emitter.on)
      emitter.addListener = sinon.spy()
      emitter.on('alias', () => {}) // should call addListener
      expect(emitter.addListener.callCount).equal(1)
    })

    it('has a removeListener method', () => {
      should.exist(emitter.removeListener)
      expect(emitter.removeListener).a('function')
    })

    it('has a removeAllListeners method', () => {
      should.exist(emitter.removeAllListeners)
      expect(emitter.removeAllListeners).a('function')
    })

    it('has an emit method', () => {
      should.exist(emitter.emit)
      expect(emitter.emit).a('function')
    })

    it('has a once method', () => {
      should.exist(emitter.once)
      expect(emitter.once).a('function')
    })

  })

  describe('when adding and removing listeners', () => {

    let emitter

    beforeEach(() => {
      emitter = new Emitter()
    })

    it('should not throw when adding a listener', () => {
      expect(() => {emitter.addListener('greet', () => {})}).not.throws()
    })

    it('should not throw when adding a listener with on alias', () => {
      expect(() => {emitter.addListener('greet', () => {})}).not.throws()
    })

    it('adds a listener', () => {
      emitter.events = {}
      emitter.addListener('greet', () => {})
      expect('greet' in emitter.events).equal(true)
    })

    it('adds a listener when using on alias', () => {
      emitter.events = {}
      emitter.on('greet', () => {})
      expect('greet' in emitter.events).equal(true)
    })

    it('should not throw when adding a listener once', () => {
      expect(() => {emitter.once('greet', () => {})}).not.throws()
    })

    it('adds a listener once', () => {
      emitter.events = {}
      emitter.once('greet', () => {})
      expect('greet' in emitter.events).equal(true)
    })

    it('should not throw when removing a listener that exists', () => {
      let fn = function testing() {}
      emitter.events.greet = [fn]
      expect(() => {emitter.removeListener('greet', fn)}).not.throws()
    })

    it('should not throw when removing a listener that does not exist', () => {
      expect(() => {emitter.removeListener('greet')}).not.throws()
    })

    it('should not throw when removing all listeners', () => {
      emitter.events.greet = [function(){}, function test(){}]
      expect(() => {emitter.removeAllListeners('greet')}).not.throws()
    })

    it('should not throw when removing all listeners when there are none', () => {
      emitter.events = {}
      expect(() => {emitter.removeAllListeners('greet')}).not.throws()
    })

    it('returns array of listeners for an event', () => {
      let listener = () => {}
      emitter.addListener('now', listener)
      let listeners = emitter.listeners('now')
      expect(listeners.length).equal(1)
      expect(listeners).to.have.members([listener])
    })

    it('returns empty array when there are no listeners', () => {
      let listeners = emitter.listeners('now')
      expect(listeners.length).equal(0)
    })

  })

  describe('when emitting events', () => {

    let emitter

    beforeEach(() => {
      emitter = new Emitter()
    })

    it('should not throw when emitting an event', () => {
      expect(() => {emitter.emit('greet')}).not.throws()
    })

    it('should not throw when emitting an event with extra arguments', () => {
      expect(() => {emitter.emit('greet', 'extra argument')}).not.throws()
    })

    it('notify listener when event is emitted that it is listening for', () => {
      let callback = sinon.spy()
      
      emitter.addListener('greet', callback)
      emitter.emit('greet')
      
      expect(callback.called).to.be.true
    })

    it('does not notify listener when event is emitted that it is not listening for',
      () => {
        let callback = sinon.spy()
        
        emitter.addListener('greet', callback)
        emitter.emit('nope')
        
        expect(callback.called).to.be.false
    })

    it('notifies multiple listeners when emitting an event they are listening for',
      () => {
        let callback1 = sinon.spy()
        let callback2 = sinon.spy()
        
        emitter.addListener('greet', callback1)
        emitter.addListener('greet', callback2)
        emitter.emit('greet')
        
        expect(callback1.called).to.be.true
        expect(callback2.called).to.be.true
    })

    it('does not notify after listener is removed', () => {
        let callback = sinon.spy()
        
        emitter.addListener('greet', callback)
        emitter.removeListener('greet', callback)
        emitter.emit('greet')
        
        expect(callback.called).to.be.false
    })

    it('does not notify after all listeners are removed', () => {
        let callback = sinon.spy()
        
        emitter.addListener('greet', callback)
        emitter.removeAllListeners('greet')
        emitter.emit('greet')
        
        expect(callback.called).to.be.false
    })

    it('only calls listener once when added with once', () => {
        let callback = sinon.spy()
        
        emitter.once('greet', callback)
        emitter.emit('greet')
        expect(callback.callCount).equal(1)

        emitter.emit('greet')
        expect(callback.callCount).equal(1)
    })

    it('invokes only the listeners registered at the time the event was ' +
       'emitted, even if more were added', () => {
      let callback1 = sinon.spy()
      let callback2 = sinon.spy()

      emitter.addListener('test', callback1)
      emitter.addListener('test', () => {
        emitter.addListener('test', callback2)
      })
      emitter.emit('test')

      expect(callback1.callCount).equal(1)
      expect(callback2.callCount).equal(0)
    })

    it('passes extra arguments to listener', () => {
      let fn = function log(message) { 
        expect(arguments.length).equal(1)
        expect(arguments[0]).equal('data')
      }
      emitter.addListener('test', fn)
      emitter.emit('test', 'data')
    })

  })

})
