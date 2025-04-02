export type MapEventsProps = {
  title: string
  events: Record<string, boolean>
}

export let EventListener: any = null;

const ymaps3 = (window as any).ymaps3;

ymaps3.ready.then(() => {
  class EventListenerClass extends ymaps3.YMapComplexEntity<MapEventsProps> {
    private _element!: HTMLDivElement
    private _detachDom!: () => void

    _createElement() {
      const { title, events } = this._props
      const root = document.createElement('div')
      root.className = 'events'

      const titleEl = document.createElement('div')
      titleEl.className = 'events__title'
      titleEl.textContent = title
      root.appendChild(titleEl)

      const list = document.createElement('ul')
      list.className = 'events__list'
      for (const key in events) {
        const item = document.createElement('li')
        item.id = key
        item.className = 'events__item ' + key
        item.textContent = key
        list.appendChild(item)
      }
      root.appendChild(list)

      return root
    }

    _onUpdate() {
      const { events } = this._props
      for (const key in events) {
        const el = document.getElementById(key)
        if (!el) continue
        if (events[key]) {
          el.classList.add('events__item_active')
        } else {
          el.classList.remove('events__item_active')
        }
      }
    }

    _onAttach() {
      this._element = this._createElement()
      this._detachDom = ymaps3.useDomContext(this, this._element, this._element)
    }

    _onDetach() {
      this._detachDom?.()
      this._element.remove()
    }
  }

  EventListener = EventListenerClass
});

export async function waitForEventListener() {
    await ymaps3.ready;
    while (!EventListener) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return EventListener;
}
