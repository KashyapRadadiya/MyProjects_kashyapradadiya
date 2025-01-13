console.log('hello kashyap')
var resultBox = document.getElementById('result-box');
// ccsicsicb
function showHome() {
  document.getElementById('aboutSection').style.display = 'none';
  document.getElementById('homeSection').style.display = 'block';
}

function showAbout() {
  document.getElementById('homeSection').style.display = 'none';
  document.getElementById('aboutSection').style.display = 'block';
}

window.onload = showHome;

function adjustTextArea() {
  var textArea = document.getElementById('emailInput');

  textArea.style.height = 'auto';
  textArea.style.height = textArea.scrollHeight + 'px';

  var maxHeight = window.innerHeight * 0.7;
  if (textArea.scrollHeight > maxHeight) {
    textArea.style.height = maxHeight + 'px';
  }
}
 



document.getElementById('checkEmailBtn').addEventListener('click', () => {
  const emailInput = document.getElementById('emailInput').value;

  if (!emailInput.trim()) {
    alert('Please enter an email!');
    return;
  }

  // Make an API request to the Python server
  fetch('http://localhost:8080', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: emailInput }),
  })
    .then((response) => response.json())
    .then((data) => {
      const resultBox = document.getElementById('result');
      if (data.error) {
          resultBox.textContent = data.error;
          resultBox.style.color = 'red'; // Error color
      } else {
          resultBox.textContent = data.prediction;
          if (data.prediction === 'Spam Mail') {
              resultBox.style.color = 'red'; 
              resultBox.style.backgroundColor = '#ffe6e6'; 
          } else {
              resultBox.style.color = 'green';
              resultBox.style.backgroundColor = '#e6ffe6'; 
          }
      }
  })
    .catch((error) => {
      console.error('Error:', error);
      alert('Something went wrong. Please try again.');
    });
});
