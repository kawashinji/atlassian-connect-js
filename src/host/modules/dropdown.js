/**
* DO NOT INCLUDE ME IN THE PUBLIC DOCUMENTATION
* there is no AUI implementation of this
*/

import util from '../util';
import ModuleProviders from '../module-providers';
import EventDispatcher from '../dispatchers/event_dispatcher';
import EventActions from '../actions/event_actions';
import DropdownActions from '../actions/dropdown_actions';

var dropdownProvider;

function buildListItem(listItem) {
  if (typeof listItem === 'string') {
    return {
      content: listItem
    };
  }
  if (listItem.text && typeof listItem.text === 'string') {
    return {
      content: listItem.text
    }
  }
  throw new Error('Unknown dropdown list item format.');
}

function moduleListToApiList(list) {
  return list.map((item) => {
    const isSection = item.list && Array.isArray(item.list);
    if (isSection) {
      let returnval = {
        heading: item.heading
      }
      returnval.items = item.list.map((listitem) => {
        return buildListItem(listitem);
      });
      return returnval;
    } else {
      return {
        items: [buildListItem(item)]
      }
    }
  });
}

/**
* @class DropdownItem
* A single item in a dropdown menu can be a string or an object
* @param {String} item_id The id of a single dropdown item
* @param {String} text    The text to display in the dropdown item
*/

/**
* @module Dropdown
* @description Dropdown menu that can go outside the iframe bounds.
* @example
* // create a dropdown menu with 1 section and 2 items
* var mydropdown = {
*   dropdown_id: 'my-dropdown',
*   list: [{
*     heading: 'section heading',
*     list: [
*       {text: 'one'},
*       {text: 'two'}
*     ]
*   }]
* };
*
* AP.events.on('dropdown-item-selected', (data) =>{
*   console.log('dropdown item selected', data.dropdown_id, data.item);
* });
*
* AP.dropdown.create(mydropdown);
* // button is an element in our document that triggered the dropdown
* let rect = document.querySelector('button').getBoundingClientRect();
* AP.dropdown.showAt('my-dropdown', rect.left, rect.top, rect.width);
*
*/

export default {
  /**
  * @name create
  * @method
  * @description Creates a new dropdown.
  * @param {Object} options             Options of the dropdown.
  * @param {String} options.dropdown_id A unique identifier for the dropdown that will be referenced in events.
  * @param {String} options.list        An array containing dropdown items {Dropdown~DropdownItem}
  * @example
  * // create a dropdown menu with 1 section and 2 items
  * var mydropdown = {
  *   dropdown_id: 'my-dropdown',
  *   list: [{
  *     heading: 'section heading',
  *     list: [
  *       {text: 'one'},
  *       {text: 'two'}
  *     ]
  *   }]
  * };
  *
  * AP.dropdown.create(mydropdown);
  */
  create(options, callback) {
    callback = util.last(arguments);
    if (typeof options !== 'object') {
      return;
    }
    dropdownProvider = ModuleProviders.getProvider('dropdown');
    if (dropdownProvider) {
      dropdownProvider.registerItemNotifier((data) => {
        DropdownActions.itemSelected(data.dropdown_id, data.item, callback._context.extension);
      });
      options.list = moduleListToApiList(options.list);
      dropdownProvider.create(options, callback._context);
      // return for testing
      return options;
    }
  },

  /**
  * @name showAt
  * @method
  * @description Displays a created dropdown menu.
  * @param {String} dropdown_id   Id used when creating the dropdown
  * @param {String} x             x position from the edge of your iframe to display
  * @param {String} y             y position from the edge of your iframe to display
  * @param {String} width         Optionally enforce a width for the dropdown menu
  * @example
  * // create a dropdown menu with 1 section and 2 items
  * var mydropdown = {
  *   dropdown_id: 'my-dropdown',
  *   list: [
  *     'one', 'two'
  *   }]
  * };
  *
  * AP.dropdown.create(mydropdown);
  * // Get the button that activated the dropdown
  * let rect = document.querySelector('button').getBoundingClientRect();
  * AP.dropdown.showAt('my-dropdown', rect.left, rect.top, rect.width);
  */
  showAt(dropdown_id, x, y, width) {
    let callback = util.last(arguments);
    let rect = document.getElementById(callback._context.extension_id).getBoundingClientRect();

    if (dropdownProvider) {
      dropdownProvider.showAt({
        dropdown_id,
        x,
        y,
        width
      }, {
        iframeDimensions: rect,
        onItemSelection: (dropdown_id, item) => {
          DropdownActions.itemSelected(dropdown_id, item, callback._context.extension);
        }
      });
    }
  },
  /**
  * @name hide
  * @method
  * @description Hide a dropdown menu
  * @param {String} dropdown_id The id of the dropdown to hide
  * @example
  * AP.dropdown.create('my-dropdown');
  * AP.dropdown.hide('my-dropdown');
  */
  hide(id) {
    if (dropdownProvider) {
      dropdownProvider.hide(id);
    }
  },

  /**
  * @name itemDisable
  * @method
  * @description Disable an item in the dropdown menu
  * @param {String} dropdown_id The id of the dropdown
  * @param {String} item_id     The dropdown item to disable
  * @example
  * AP.dropdown.create('my-dropdown');
  * AP.dropdown.itemDisable('my-dropdown', 'item-id');
  */
  itemDisable(dropdown_id, item_id) {
    if (dropdownProvider) {
      dropdownProvider.itemDisable(dropdown_id, item_id);
    }
  },

  /**
  * @name itemEnable
  * @method
  * @description Hide a dropdown menu
  * @param {String} dropdown_id The id of the dropdown
  * @param {String} item_id The id of the dropdown item to enable
  * @example
  * AP.dropdown.create('my-dropdown');
  * AP.dropdown.itemEnable('my-dropdown', 'item-id');
  */
  itemEnable(dropdown_id, item_id) {
    if (dropdownProvider) {
      dropdownProvider.itemEnable(dropdown_id, item_id);
    }
  }

}


EventDispatcher.register('dropdown-item-selected', (data) => {
  EventActions.broadcast('dropdown-item-selected', {
    addon_key: data.extension.addon_key,
    key: data.extension.key
  }, {
    dropdown_id: data.id,
    item: data.item
  });
});