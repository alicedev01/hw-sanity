import {Observable} from 'rxjs'

// Takes an observable returning function and returns a debounced function that, when called
// collects its passed arguments until wait time has passed without receiving new calls.
// When wait period is over, calls the original function with the collected arguments
export function debounceCollect<Fn extends (...args: any[]) => Observable<any[]>>(
  fn: Fn,
  wait: number
): Fn extends (collectedArgs: [...infer TArgs][]) => Observable<(infer TReturnValue)[]>
  ? (...args: TArgs) => Observable<TReturnValue>
  : never
export function debounceCollect(fn, wait: number) {
  let timer
  let queue = {}
  let idx = 0
  return function debounced(...args) {
    return new Observable((obs) => {
      clearTimeout(timer)
      timer = setTimeout(flush, wait)
      const queueItem = {
        args: args,
        observer: obs,
        completed: false,
      }
      const id = idx++
      queue[id] = queueItem
      return () => {
        // console.log('completed', queueItem.args)
        queueItem.completed = true
      }
    })
  }

  function flush() {
    const currentlyFlushingQueue = queue
    queue = {}

    const queueItemIds = Object.keys(currentlyFlushingQueue) // Todo: use debug
      // .map(id => {
      //   if (currentlyFlushingQueue[id].completed) {
      //     console.log('Dropped', currentlyFlushingQueue[id].args)
      //   }
      //   return id
      // })
      .filter((id) => !currentlyFlushingQueue[id].completed)

    if (queueItemIds.length === 0) {
      // nothing to do
      return
    }
    const collectedArgs = queueItemIds.map((id) => currentlyFlushingQueue[id].args)
    fn(collectedArgs).subscribe({
      next(results) {
        results.forEach((result, i) => {
          const queueItem = currentlyFlushingQueue[queueItemIds[i]]
          if (!queueItem.completed) {
            queueItem.observer.next(results[i])
          }
        })
      },
      complete() {
        queueItemIds.forEach((id) => {
          const entry = currentlyFlushingQueue[id]
          if (!entry.completed) {
            entry.observer.complete()
          }
        })
      },
      error(err) {
        queueItemIds.forEach((id) => {
          const entry = currentlyFlushingQueue[id]
          if (!entry.completed) {
            entry.observer.error(err)
          }
        })
      },
    })
  }
}
