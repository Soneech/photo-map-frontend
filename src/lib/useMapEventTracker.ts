import { ref } from 'vue'
import type { Ref } from 'vue'
import _ from 'lodash'

export function useMapEventTracker() {
    const domEvents = ref<Record<string, boolean>>({
        click: false,
        dblClick: false,
        mouseMove: false,
        mouseEnter: false,
        mouseLeave: false,
        mouseDown: false
    });

    const behaviorEvents = ref<Record<string, boolean>>({
        scrollZoom: false,
        drag: false,
    });

    const clickEventHandler = (event: object, openForm: boolean) => {
        console.log(event);
        saveMarkCoords(event);

        if (openForm) {
            openFormWindow();
        }
        createDomEventHandler('click', event);
    }

    const dblClickEventHandler = (event: object) => {
        zoom();
        createDomEventHandler('dblClick', event);
    }

    const createDomEventHandler = (eventType: string, event: object) => {
        const disable = _.debounce(() => {
            domEvents.value[eventType] = false
            domEvents.value = { ...domEvents.value }
        }, 250)

        return () => {
            domEvents.value[eventType] = true
            domEvents.value = { ...domEvents.value }
            disable()
        }
    }

    const createBehaviorHandler = (obj: object, isStart: boolean) => {  // zoom
        return () => {
        if (obj.type === 'dblClick') return
            behaviorEvents.value[object.type] = isStart
            behaviorEvents.value = { ...behaviorEvents.value }
        }
    }

    return {
        domEvents,
        behaviorEvents,
        clickEventHandler,
        dblClickEventHandler,
        createBehaviorHandler,
        createDomEventHandler
    }
}

// mapRef
let mapRef: Ref<any> | null = null

export function setMapRef(ref: Ref<any>) {
  mapRef = ref
}

export const markCoords = ref<[number, number]>();

function saveMarkCoords(event: object) {
    let coords = event?.coordinates;
    if (coords) {
        markCoords.value = coords;
        console.log('Сохранены координаты: ', markCoords.value);
    } 
}

// zoom handler
function zoom() {
    if (!mapRef?.value?.entity) return

    const map = mapRef.value.entity
    const currentZoom = map.zoom
    const newZoom = Math.min(currentZoom + 1, 20)

    map.setZoom(newZoom, { duration: 300 })
    console.log('Зум увеличен до:', newZoom)
}

// create form window
export const isFromVisible = ref(false);

export function closeFormWindow() {
    isFromVisible.value = false;
}

function openFormWindow() {
    isFromVisible.value = true;
}
