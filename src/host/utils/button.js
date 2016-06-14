class ButtonUtils {
  // button identifier for XDM. NOT an id attribute
  randomIdentifier(){
    return Math.random().toString(16).substring(7);
  }
}

var buttonUtilsInstance = new ButtonUtils();

export default buttonUtilsInstance;