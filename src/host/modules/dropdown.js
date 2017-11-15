/**
* DO NOT INCLUDE ME IN THE PUBLIC DOCUMENTATION
* there is no AUI implementation of this
*/

import HostApi from '../host-api';
import util from '../util';
import EventDispatcher from '../dispatchers/event_dispatcher';
import EventActions from '../actions/event_actions';
import DropdownActions from '../actions/dropdown_actions';

var dropdownProvider;

function buildListItem(listItem) {
  let finishedListItem = {};
  if (typeof listItem === 'string') {
    finishedListItem.content = listItem;
  } else if (listItem.text && typeof listItem.text === 'string') {
    finishedListItem.content = listItem.text;
    if(typeof listItem.disabled === 'boolean') {
      finishedListItem.disabled = listItem.disabled;
    }
    if(typeof listItem.itemId !== 'undefined') {
      finishedListItem.itemId = listItem.itemId;
    }
  } else {
    throw new Error('Unknown dropdown list item format.');
  }
  return finishedListItem;
}

function moduleListToApiList(list) {
  return list.map((item) => {
    if (item.list && Array.isArray(item.list)) {
      let returnval = {
        heading: item.heading
      }
      returnval.items = item.list.map((listitem) => {
        return buildListItem(listitem);
      });
      return returnval;
    }
  });
}

/**
* @class DropdownItem
* A single item in a dropdown menu can be a string or an object
* @param {String} itemId The id of a single dropdown item
* @param {String} text    The text to display in the dropdown item
*/

/**
* @module Dropdown
* @description Dropdown menu that can go outside the iframe bounds.
* @example
* // create a dropdown menu with 1 section and 2 items
* var mydropdown = {
*   dropdownId: 'my-dropdown',
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
*   console.log('dropdown item selected', data.dropdownId, data.item);
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
  * @param {String} options.dropdownId A unique identifier for the dropdown that will be referenced in events.
  * @param {String} options.list        An array containing dropdown items {Dropdown~DropdownItem}
  * @example
  * // create a dropdown menu with 1 section and 2 items
  * var mydropdown = {
  *   dropdownId: 'my-dropdown',
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
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');
    if (dropdownProvider) {
      const dropdownGroups = moduleListToApiList(options.list);
      const dropdownProviderOptions = {
        dropdownId: options.dropdownId,
        dropdownGroups: dropdownGroups,
        dropdownItemNotifier: (data) => {
          DropdownActions.itemSelected(data.dropdownId, data.item, callback._context.extension);
        }
      };
      dropdownProvider.create(dropdownProviderOptions, callback._context);
      return dropdownProviderOptions;
    }
  },

  /**
  * @name showAt
  * @method
  * @description Displays a created dropdown menu.
  * @param {String} dropdownId   Id used when creating the dropdown
  * @param {String} x             x position from the edge of your iframe to display
  * @param {String} y             y position from the edge of your iframe to display
  * @param {String} width         Optionally enforce a width for the dropdown menu
  * @example
  * // create a dropdown menu with 1 section and 2 items
  * var mydropdown = {
  *   dropdownId: 'my-dropdown',
  *   list: [{
  *     list:['one', 'two']
  *   }]
  * };
  *
  * AP.dropdown.create(mydropdown);
  * // Get the button that activated the dropdown
  * let rect = document.querySelector('button').getBoundingClientRect();
  * AP.dropdown.showAt('my-dropdown', rect.left, rect.top, rect.width);
  */
  showAt(dropdownId, x, y, width) {
    let callback = util.last(arguments);
    let rect = {left: 0, top: 0};
    let iframe = document.getElementById(callback._context.extension_id);
    if(iframe) {
      rect = iframe.getBoundingClientRect();
    } else {
      console.error('ACJS: no iframe found for dropdown');
    }

    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');
    if (dropdownProvider) {
      const dropdownProviderArgs = {
        dropdownId: dropdownId,
        x: x,
        y: y,
        width: width
      };
      dropdownProvider.showAt(dropdownProviderArgs, {
        iframeDimensions: rect,
        onItemSelection: (dropdownId, item) => {
          DropdownActions.itemSelected(dropdownId, item, callback._context.extension);
        }
      });
    }
  },
  /**
  * @name hide
  * @method
  * @description Hide a dropdown menu
  * @param {String} dropdownId The id of the dropdown to hide
  * @example
  * AP.dropdown.create('my-dropdown');
  * AP.dropdown.hide('my-dropdown');
  */
  hide(id) {
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');
    if (dropdownProvider) {
      dropdownProvider.hide(id);
    }
  },

  /**
  * @name itemDisable
  * @method
  * @description Disable an item in the dropdown menu
  * @param {String} dropdownId The id of the dropdown
  * @param {String} itemId     The dropdown item to disable
  * @example
  * AP.dropdown.create('my-dropdown');
  * AP.dropdown.itemDisable('my-dropdown', 'item-id');
  */
  itemDisable(dropdownId, itemId) {
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');
    if (dropdownProvider) {
      dropdownProvider.itemDisable(dropdownId, itemId);
    }
  },

  /**
  * @name itemEnable
  * @method
  * @description Hide a dropdown menu
  * @param {String} dropdownId The id of the dropdown
  * @param {String} itemId The id of the dropdown item to enable
  * @example
  * AP.dropdown.create('my-dropdown');
  * AP.dropdown.itemEnable('my-dropdown', 'item-id');
  */
  itemEnable(dropdownId, itemId) {
    const frameworkAdaptor = HostApi.getFrameworkAdaptor();
    const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');
    if (dropdownProvider) {
      dropdownProvider.itemEnable(dropdownId, itemId);
    }
  }

}


EventDispatcher.register('dropdown-item-selected', (data) => {
  EventActions.broadcast('dropdown-item-selected', {
    addon_key: data.extension.addon_key,
    key: data.extension.key
  }, {
    dropdownId: data.id,
    item: data.item
  });
});

// friendly unload with connectHost.destroy
EventDispatcher.register('iframe-destroyed', (data) => {
  const frameworkAdaptor = HostApi.getFrameworkAdaptor();
  const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');
  if (dropdownProvider) {
    dropdownProvider.destroyByExtension(data.extension.extension_id);
  }
});

// unfriendly unload by removing the iframe from the DOM
EventDispatcher.register('after:iframe-unload', (data) => {
  const frameworkAdaptor = HostApi.getFrameworkAdaptor();
  const dropdownProvider = frameworkAdaptor.getProviderByModuleName('dropdown');
  if (dropdownProvider) {
    dropdownProvider.destroyByExtension(data.extension.extension_id);
  }
});
