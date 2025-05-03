import * as Vue from 'vue'
import { waitForEventListener } from './EventListener'


function waitForYmaps3(): Promise<any> {
  return new Promise((resolve) => {
    const check = () => {
      if ((window as any).ymaps3) {
        resolve((window as any).ymaps3)
      } else {
        setTimeout(check, 50)
      }
    }
    check()
  })
}

export const ymaps3 = await waitForYmaps3()
const clusterer = await ymaps3.import('@yandex/ymaps3-clusterer@0.0.1');

export const [ymaps3Vue] = await Promise.all([
  ymaps3.import('@yandex/ymaps3-vuefy'),
  ymaps3.ready,
  clusterer
])


const vuefy = ymaps3Vue.vuefy.bindTo(Vue)

const EventListener = await waitForEventListener()
export const { EventListener: EventListenerV } = vuefy.module(
  { EventListener },
  { EventListener: { title: String, events: Object } }
)

export const {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker,
  YMapClusterer,
  clusterByGrid,
  YMapListener,
  YMapControls,
  YMapControl,
} = vuefy.module({
  ...ymaps3,
  ...clusterer
})

