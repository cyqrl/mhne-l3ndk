document.addEventListener("DOMContentLoaded", function() {
  const siteName = window.location.pathname.split('/').pop();
  fetch(`/averageRating/${siteName}`)
    .then(response => response.json())
    .then(data => {
      updateAverageRating(data.average);
    })
    .catch(error => {
      console.error('Error fetching متوسط التقييم:', error);
    });
});

function updateAverageRating(averageRating) {
  const averageRatingElement = document.getElementById('averageRating');
  if (averageRating !== '') {
    averageRatingElement.innerText = `متوسط التقييم: ${averageRating} \u2605`;
  } else {
    averageRatingElement.innerText = 'متوسط التقييم: N/A';
    
  }
}

document.getElementById('commentForm').addEventListener('submit', submitRating);


function submitRating(event) {
  event.preventDefault();
var rating = document.querySelector('input[name="rating"]:checked').value;
document.querySelector('input[name="rating"]:checked').checked = false;
  const siteName = window.location.pathname.split('/').pop();
  fetch('/submitRating', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ siteName, rating })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    updateAverageRating(data.averageRating);
  })
  .catch(error => {
    console.error('Error submitting rating:', error);
  });
}
