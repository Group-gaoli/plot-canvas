/**
 *  canvas handler events 
 *  author: Gaoli
 *  time: 2020-9-18 
 */

const style = new Map([
    ['mousemove', 'plot-hover'],
   //  ['mousemove', 'plot-hove'],
   //  ['mousemove', 'plot-hove']
])
import {drawAll} from "./draw"
import { cloneObj } from "./common"
import config from '../config'


const currentDataFormate = (e,obj,cav) => {
   obj.options.x = e.clientX - cav.offsetLeft - obj.options.w / 2;
   obj.options.y = e.clientY - cav.offsetTop- obj.options.h / 2;
   obj.options.setLineDash = config.setLineDash;
   obj.options.text = '';
   return obj;
}

 export const dbClick = function (fun,params) {
    const e = event || window.event;
    const result = fun(e, params);
    console.log(result, this);
 }

 export const mouseDown = function (fun,params) {
   const e = event || window.event;
   const result = fun(e, params);
   const self = this;
   const {cav, ctx} = params;
   let { data,index } = result;
   let currentData;
   if (cav, result.status) {
      currentData = cloneObj(data);
      params.cav.onmousemove = function(){
         const e = event || window.event;
         currentData = currentDataFormate(e,currentData, cav);
         const arr = [...self.sourceData, currentData];
         drawAll(arr, ctx, cav)
      }
   }
   params.cav.onmouseup = function(){
      params.cav.onmousemove = null;
      if(currentData) {
         data.options.x = currentData.options.x;
         data.options.y = currentData.options.y;
         self.sourceData[index] = data;
         drawAll(self.sourceData, ctx, cav);
         currentData = null;
      }
   }
 }

 export const mouseUp = function() {}

 export const mousemove = function(fun,params) {
   let timer = new Date().getTime();
   // 函数节流
   return () => {
      const e = event || window.event;
      const currentTime = new Date().getTime();
      if (currentTime - timer > 20) {
         const result = fun(e, params);
         timer = currentTime;
         // 鼠标样式
         params.cav.classList[result.status ? 'add' : 'remove'](style.get('mousemove'))
      }
   }
 }


// 事件添加
 export const addEvents = (self,cav, fun, params) => {
    cav.addEventListener('dblclick', dbClick.bind(self, fun, params))
    cav.addEventListener('mousedown', mouseDown.bind(self, fun, params))
    cav.addEventListener('mouseUp', mouseUp.bind(self, fun, params))
    cav.addEventListener('mousemove', mousemove.call(self, fun, params))
 }