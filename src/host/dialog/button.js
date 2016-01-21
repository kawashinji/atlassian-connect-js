import $ from '../dollar';
import EventDispatcher from 'dispatchers/event_dispatcher';

function buttonClick(e){
  EventDispatcher.dispatch('dialog-button-click', $(e.target));
}

function Button(options) {
  this.$el = $('<button />')
      .text(options.text)
      .addClass('aui-button aui-button-' + options.type)
      .addClass(options.additionalClasses)
      .data('options',options)
      .click(buttonClick);

  this.isEnabled = function () {
    return !(this.$el.attr('aria-disabled') === 'true');
  };

  this.setEnabled = function (enabled) {
    //cannot disable a noDisable button
    if (options.noDisable === true) {
      return false;
    }
    this.$el.attr('aria-disabled', !enabled);
    return true;
  };

  this.setEnabled(true);

  this.setText = function (text) {
    if (text) {
      this.$el.text(text);
    }
  };

}

export default {
  render (text, options){
    var defaults = {
      type: 'link',
      additionalClasses: 'ap-dialog-button'
    };

    return new Button($.extend({text}, defaults, options));
  }
}