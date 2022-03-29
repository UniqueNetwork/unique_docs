import process from 'process'
import {Buffer} from 'buffer'
import EventEmitter from 'events'

if (typeof window !== 'undefined') {
  window.Buffer = Buffer
  window.process = process
  ;(window as any).EventEmitter = EventEmitter
  ;(window as any).global = window
}