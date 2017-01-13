/**
 * Created by linxiaojie on 2017/1/9.
 */
const $ = require('jquery')
export default class Timeout {
  constructor({el = '', disabledClass = 'disabled', text = '发送验证码', disabledCb = (count) => {
    return '发送（' + count + '）秒'
  }, seconds = 60}) {
    super({el, disabledCb, disabledClass, text, seconds})
    if (options.el === ''){
      throw new Error('el不能为空')
    }
    const me = this;
    me.el = options.el
    me.$el = $(me.el)
    me.disabledClass = disabledClass
    me.text = text
    me.disabledCb = disabledCb
    me.seconds = seconds
    me._counted = 0;
    me.timeout = null;
    me.event = $({});
    me.init();
  }
  init () {
    var me = this,
      $el = me.$el,
      type = 'touchend.timecount';
    $el.removeClass(me.disabledClass);
    $el.text(me.text);
    $el.off(type)
    $el.on(type, function(e){
      e.preventDefault();
      if($el.hasClass(me.disabledClass)){
        return;
      }
      me.start();
    })
  }
  start () {
    var me = this,
      $el = me.$el,
      disabledClass = me.disabledClass;
    if($el.hasClass(disabledClass)){
      return;
    }
    me._counted = 0;
    me.trigger('start.timecount');
    me.count();
  }
  restart () {
    this.init();
  }
  count () {
    var me = this, counted = me._counted, $el = me.$el;
    $el.addClass(me.disabledClass);
    $el.text(me.disabledCb(me.seconds - counted));
    me.timeout && clearTimeout(me.timeout);
    me.timeout = setTimeout($.proxy(function(){
      if(counted === me.seconds){
        me.restart();
        me.trigger('over.timecount');
      }else{
        me._counted ++;
        me.count();
      }
    }, me), 1000);
  }
}