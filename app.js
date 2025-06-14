const form = document.getElementById('locationForm');
const locationInput = document.getElementById('locationInput');
const resultDiv = document.getElementById('result');

function isValidLocation(input) {
  // Allow letters, spaces, commas, periods, length 2-50
  const regex = /^[a-zA-Z\s,.]{2,50}$/;
  return regex.test(input.trim());
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const location = locationInput.value.trim();

  if (!isValidLocation(location)) {
    resultDiv.className = 'error visible';
    resultDiv.textContent = '❌ Please enter a valid US city name (no numbers or symbols).';
    return;
  }

  // Clear previous messages and show loading
  resultDiv.className = 'loading visible';
  resultDiv.textContent = '⏳ Checking snowstorm status...';

  try {
    const response = await fetch(`http://localhost:3000/snowstorm?location=${encodeURIComponent(location)}`);

    if (!response.ok) {
      resultDiv.className = 'error visible';
      resultDiv.textContent = `Error: ${response.statusText}`;
      return;
    }

    const data = await response.json();

    if (data.error) {
      resultDiv.className = 'error visible';
      resultDiv.textContent = `Error: ${data.error}`;
      return;
    }

    // Show success message with snowstorm info
    resultDiv.className = 'success visible';
    resultDiv.textContent = data.message;

  } catch (error) {
    resultDiv.className = 'error visible';
    resultDiv.textContent = 'Network error. Try again later.';
    console.error(error);
  }
});
