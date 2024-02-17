document.getElementById('appointmentForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = new FormData(this);

    // Here you can send formData to the server for further processing
    // For demonstration purpose, let's log the data to the console
    for (var pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
    }

    // You can also display a confirmation message or redirect the user after successful booking
    alert('Appointment booked successfully!');
    this.reset(); // Reset the form after successful submission
});