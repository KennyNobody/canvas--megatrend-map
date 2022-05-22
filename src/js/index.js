import "normalize.css";
import "../css/main.scss";

import Hammer from 'hammerjs';
import Konva from 'konva';
import * as lines from './data-routes.js';

document.addEventListener('DOMContentLoaded', () => {
    const el = document.querySelector('[data-canvas]');
    if (el) new Map(el);
});

class Map {
    constructor(el) {
        this.el = el;

        this.field = this.el.querySelector('.canvas__field');

        this.width = this.field.clientWidth;
        this.height = this.field.clientHeight;

        this.loading = false;;

        this.layerSize = {
            width: 1734,
            height: 1191
        }

        this.stage = new Konva.Stage({
            container: this.field,
            width: this.width,
            height: this.height,
            draggable: true,
        });

        this.layerPlan = new Konva.Layer({
            x: this.stage.width() / 2,
            y: this.stage.height() / 2,
            offsetX: this.layerSize.width / 2,
            offsetY: this.layerSize.height / 2,
        });

        this.originalAttrs = {
            draggable: true,
            rotation: 0,
        };

        this.oldRotation = 0;
        this.startScale = 0;

        this.setListeners();
    }

    setListeners() {

        Konva.hitOnDragEnabled = true;
        Konva.captureTouchEventsEnabled = true;

        let hammertime = new Hammer(this.layerPlan, { domEvents: true });

        hammertime.get('pinch').set({ enable: true });

        this.setLines(lines.data);

        this.initResizeScroll();
        // this.initResizeButtons();

        // this.layerPlan.on('swipe', (e) => {
        //     e.preventDefault();
        // });

        // this.layerPlan.on('dragend', () => {
        //     this.layerPlan.to(Object.assign({}, this.originalAttrs));
        // });

        // this.layerPlan.on('pinchstart', function (ev) {
        //     this.stopDrag();
        //     console.log('Начало расперды');
        // });

        // this.layerPlan.on('click', (ev) => {
        //     console.log('click');
        //     this.setActiveItem(ev);
        // });

        // this.layerPlan.on('press', (ev) => {
        //     console.log('press');
        //     this.setActiveItem(ev);
        // });

        // this.layerPlan.on('tap', (ev) => {
        //     console.log('tap');
        //     this.setActiveItem(ev);
        // });

        // this.layerPlan.on('pinchend pinchcancel', function (ev) {
        //     // Возвращаем как было
        //     // this.to(Object.assign({}, this.originalAttrs));
        //     scale = scale * ev.evt.gesture.scale;
        //     this.draggable(true);
        //     console.log('Конец расперды');
        // });

    }

    setLines = (data, params) => {

        for (let i in data) {
            let path = new Konva.Path(data[i]);
            this.layerPlan.add(path);
        }

        this.stage.add(this.layerPlan);

        this.centered();
    }

    initResizeScroll = () => {
        let scaleBy = 1.01;

        this.el.addEventListener('wheel', (e) => {
            e.preventDefault();

            let oldScale = this.stage.scaleX();
            let pointer = this.stage.getPointerPosition();

            let mousePointTo = {
                x: (pointer.x - this.stage.x()) / oldScale,
                y: (pointer.y - this.stage.y()) / oldScale,
            };

            let direction = e.deltaY > 0 ? 1 : -1;

            let newScale = direction > 0 ? oldScale - 0.1 : oldScale + 0.1;

            if (newScale < 0.5) {
                newScale = 0.5;
            }

            this.stage.scale({ x: newScale, y: newScale });

            let newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            this.stage.position(newPos);
        });
    }

    centered = () => {
        let scaleWidth = this.width / this.layerSize.width;
        let scaleHeight = this.height / this.layerSize.height;
        let scale = (scaleWidth < scaleHeight) ? scaleWidth : scaleHeight;

        this.stage.scale({ x: scale, y: scale });
        this.layerPlan.x(this.stage.width() / 2 / scale);
        this.layerPlan.y(this.stage.height() / 2 / scale);
    }
}