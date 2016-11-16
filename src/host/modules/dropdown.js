import DropdownActions from '../actions/dropdown_actions';
class Dropdown {
  constructor(){
    console.log("RUNNING", arguments, this);
  }
  getSelected () {

  }
  hide() {

  }

  isVisible(){

  }
  moveDown(){

  }
  moveUp(){

  }
  onHide(){

  }
  onSelect(){

  }
  query(){

  }
  select(){

  }
  setItems(items, callback){

  }
  showAt(){

  }

}

// export default {
//   create: {
//     constructor: Dropdown
//   },
//   setItems: function(){
//     console.log("SET ITEMS???", arguments, this);
//   }
// };
console.log("DEPR???");
export default {
  create: {
    constructor: Dropdown,
    setItems: Dropdown.prototype.setItems
  }
}