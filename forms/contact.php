<?php
// Replace contact@example.com with your real receiving email address
$receiving_email_address = 'amin.alamdari@ozu.edu.tr';

// Check if the request is a POST request and if it contains JSON data
if ($_SERVER["REQUEST_METHOD"] == "POST" && $_SERVER["CONTENT_TYPE"] == "application/json") {
    // Retrieve JSON data
    $data = json_decode(file_get_contents("php://input"), true);

    // Retrieve form data
    $name = $data['name'];
    $email = $data['email'];
    $subject = $data['subject'];
    $message = $data['message'];

    // Create email headers
    $headers = "From: $name <$email>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    $headers .= "Content-Type: text/plain; charset=utf-8" . "\r\n";

    // Compose email message
    $email_message = "Name: $name\n";
    $email_message .= "Email: $email\n";
    $email_message .= "Subject: $subject\n\n";
    $email_message .= "Message:\n$message";

    // Send email
    if (mail($receiving_email_address, $subject, $email_message, $headers)) {
        // Respond with a JSON success message
        echo json_encode(['success' => true]);
    } else {
        // Respond with a JSON error message
        echo json_encode(['success' => false, 'message' => 'Error sending email']);
    }
} else {
    // Respond with a JSON error message for an invalid request
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
