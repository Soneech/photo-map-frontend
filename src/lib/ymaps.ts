import * as Vue from 'vue';

function waitForYmaps3(): Promise<any> {
  return new Promise((resolve) => {
    const check = () => {
      if ((window as any).ymaps3) {
        resolve((window as any).ymaps3);
      } else {
        setTimeout(check, 50);
      }
    };
    check();
  });
}

const ymaps3 = await waitForYmaps3();

const [ymaps3Vue] = await Promise.all([
  ymaps3.import('@yandex/ymaps3-vuefy'),
  ymaps3.ready
]);

export const vuefy = ymaps3Vue.vuefy.bindTo(Vue);
export const {
  YMap,
  YMapDefaultSchemeLayer,
  YMapDefaultFeaturesLayer,
  YMapMarker
} = vuefy.module(ymaps3);
