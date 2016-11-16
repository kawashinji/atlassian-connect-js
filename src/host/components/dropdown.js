import $ from '../dollar';
import DropdownActions from '../actions/dropdown_actions';
import EventDispatcher from '../dispatchers/event_dispatcher';
const DROPDOWN_PREFIX = 'ap-dropdown-';

class Dropdown {

  addSections($dropdown, sections) {

  }

  _renderListItem(options) {
    if(typeof options === 'string') {
      options = {
        text: options
      }
    }

    var $li = $('<li />');
    var $a = $('<a />').attr('href');
    $a.text(options.text);
    $li.append($a);
    return $li;
  }

  _renderSection(section){
    var $section = $('<div />').addClass('aui-dropdown2-section');
    var $sectionHeading;
    var $section = $('<ul />');

    if(Array.isArray(section)) {
      section = {
        list: section
      }
    }

    if(section.heading) {
      $sectionHeading = $('<div />').addClass('aui-dropdown2-heading');
      $sectionHeading.text(section.heading);
      $section.append($sectionHeading);
    }

    section.list.forEach((item) => {
      $section.append(this._renderListItem(item));
    }, this);

    return $section;
  }

  render (options) {
    var _id = DROPDOWN_PREFIX + options.id;
    var $dropdown = $('<div />').id(_id);
    $dropdown.addClass('aui-style-default aui-dropdown2');
    return $dropdown;
  }

}

var DropdownComponent = new Dropdown();

EventDispatcher.register('dropdown-close', (data) => {
  DropdownComponent.close(data.id);
});

export default DropdownComponent;