import EventDispatcher from 'dispatchers/event_dispatcher';
import $ from '../dollar';
import _ from '../underscore';
import ButtonActions from 'actions/button_actions';
import ButtonUtils from 'utils/button';

const BUTTON_TYPES = ['primary', 'link', 'secondary'];
var buttonId = 0;

class Button {
  constructor() {
    this.AP_BUTTON_CLASS = "ap-aui-button";
  }

  setType($button, type){
    if(type && _.contains(BUTTON_TYPES, type)) {
      $button.addClass("aui-button-" + type);
    }
    return $button;
  }

  setDisabled($button, disabled) {
    if(typeof disabled !== "undefined") {
      $button.attr('aria-disabled', disabled);
    }
    return $button;
  }

  _setId($button, id) {
    if(!id) {
      id = "ap-button-" + buttonId;
      buttonId++;
    }
    $button.attr("id", id);
    return $button;
  }

  _additionalClasses($button, classes) {
    if(classes) {
      if(typeof classes !== "string") {
        classes = classes.join(" ");
      }
      $button.addClass(classes);
    }
    return $button;
  }

  getName($button) {
    return $($button).data("name");
  }

  getText($button) {
    return $($button).text();
  }

  getIdentifier($button) {
    return $($button).data('identifier');
  }

  isVisible($button) {
    return $($button).is(":visible");
  }

  isEnabled($button) {
    return !($($button).attr('aria-disabled') === 'true');
  }

  render (options) {
    var $button = $("<button />");
    options = options || {};
    $button.addClass("aui-button " + this.AP_BUTTON_CLASS);
    $button.text(options.text);
    $button.data(options.data);
    $button.data({
      name: options.name || options.text,
      identifier: options.identifier || ButtonUtils.randomIdentifier()
    });
    this._additionalClasses($button, options.additionalClasses);
    this.setType($button, options.type);
    this.setDisabled($button, options.disabled || false);
    this._setId($button, options.id);
    return $button;
  }
}

var ButtonComponent = new Button();
// register 1 button listener globally on dom load
$(function(){
  $("body").on("click", "." + ButtonComponent.AP_BUTTON_CLASS, function(e){
      var $button = $(e.target).closest("." + ButtonComponent.AP_BUTTON_CLASS);
      if ($button.attr('aria-disabled') !== 'true') {
        ButtonActions.clicked($button);
      }
  });
});

EventDispatcher.register("button-toggle", (data) => {
  data.$el.attr('aria-disabled', data.disabled);
});

export default ButtonComponent;
