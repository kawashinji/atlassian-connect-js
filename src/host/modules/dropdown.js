/**
* @module Dropdown
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
export default {
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

  hide(id) {
    if (dropdownProvider) {
      dropdownProvider.hide(id);
    }
  },

  itemEnable(id) {
    if (dropdownProvider) {
      dropdownProvider.itemEnable(id);
    }
  },

  itemDisable(id) {
    if (dropdownProvider) {
      dropdownProvider.itemDisable(id);
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