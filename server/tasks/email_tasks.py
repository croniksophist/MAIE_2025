from .celery_app import celery
import smtplib

@celery.task
def send_email(recipient: str, subject: str, body: str):
    sender = "no-reply@maie.com"
    message = f"Subject: {subject}\n\n{body}"
    
    with smtplib.SMTP("smtp.mailtrap.io", 2525) as server:
        server.login("your_username", "your_password")
        server.sendmail(sender, recipient, message)
    
    return f"Email sent to {recipient}"
