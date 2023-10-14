import SerialHandler from "./serialHandler.js";

function debounce(func, wait, immediate) {
  // 'private' variable for instance
  // The returned function will be able to reference this due to closure.
  // Each call to the returned function will share this common timer.
  var timeout;

  // Calling debounce returns a new anonymous function
  return function() {
    // reference the context and args for the setTimeout function
    var context = this,
      args = arguments;

    // Should the function be called now? If immediate is true
    //   and not already in a timeout then the answer is: Yes
    var callNow = immediate && !timeout;

    // This is the basic debounce behaviour where you can call this
    //   function several times, but it will only execute once
    //   (before or after imposing a delay).
    //   Each time the returned function is called, the timer starts over.
    clearTimeout(timeout);

    // Set the new timeout
    timeout = setTimeout(function() {

      // Inside the timeout function, clear the timeout variable
      // which will let the next execution run when in 'immediate' mode
      timeout = null;

      // Check if the function already ran with the immediate flag
      if (!immediate) {
        // Call the original function with apply
        // apply lets you define the 'this' object as well as the arguments
        //    (both captured before setTimeout)
        func.apply(context, args);
      }
    }, wait);

    // Immediate mode and no wait timer? Execute the function...
    if (callNow) func.apply(context, args);
  }
}

const serialHandler=new SerialHandler();

async function selectPort(){
  await serialHandler.init();
  await serialHandler.write("get");
  let initialValue=parseInt(await serialHandler.read());
  console.log("Initial value: "+initialValue);
  document.getElementById("slider").value=initialValue;
  document.getElementById("input").value=initialValue;
  //switch layout
  document.getElementById("select-content").classList.add("hidden");
  document.getElementById("control-container").classList.remove("hidden");
}
function onValueChange(ev){
  console.log("Slider value changed to "+ev.target.value);
  document.getElementById("slider").value=ev.target.value;
  document.getElementById("input").value=ev.target.value;
  debouncedSendValue(parseInt(ev.target.value));
}

function sendValue(val){
  console.log("Sending value "+val);
  serialHandler.write(val);
}

const debouncedSendValue=debounce(sendValue,100);

document.getElementById("connect-button").addEventListener("click",selectPort);
document.getElementById("slider").addEventListener("input",onValueChange);
document.getElementById("input").addEventListener("input",onValueChange);
