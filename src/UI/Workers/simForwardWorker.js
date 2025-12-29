onmessage = (event) => {
  console.log("Simming Forward One Week");

  const result = event.data[0] * event.data[1];

  if (isNaN(result)) {
    postMessage("Please write two numbers");
  } else {
      const workerResult = "Result: " + result;
      setTimeout(() => {
	  console.log("Finished simming forward one week")
	  postMessage(workerResult);
      }, 2000);      
  }
};
