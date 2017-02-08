/**
 * Created by linxiaojie on 2017/2/8.
 */
require('./index.less')
import Slide from 'common/slide'
import {ready} from 'common/util/dom'

ready(() => {
  let slide = new Slide({container: '.slide-wrapper.vertical', direction: 'vertical', loop: true})
  slide = new Slide({container: '.slide-wrapper.horizon', direction: 'horizon'})
  console.dir(slide)
})

