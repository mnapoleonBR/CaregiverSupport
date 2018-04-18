import smtplib
import flask
import urllib
from smtplib import SMTPException
from email.mime.text import MIMEText



def send_email(msg):
  sender = 'jlee671@yahoo.com'
  #THIS IS LITERALLY MY PASSWORD IN PLAIN TEXT THIS IS SO PROBLEMATIC LOL
  password = 'C0wsg0m00yahoo'
  receiver = 'jared_lee@brown.edu'
  receivers = ['jared_lee@brown.edu']
  # link = flask.url_for('calendar', _external=True)
  #link = "bakerripley.org"

  try:
    # msg = MIMEText(u'Hello this is a test <a href="' + link + '">link here</a>', 'html')
    # msg['Subject'] = subject
    # msg['From'] = sender
    # msg['To'] = receiver

    smtpObj = smtplib.SMTP('smtp.mail.yahoo.com', 587)
    smtpObj.ehlo()
    smtpObj.starttls()
    smtpObj.ehlo()
    smtpObj.login(sender, password)
    smtpObj.sendmail(sender, receivers, msg.as_string())         
    smtpObj.quit()

  except SMTPException:
    return 'not worked'

  return 'email successfully sent'

def createEventEmail(request):
  subject = "[Caregiver Event Suggestion]"
  sender = 'jlee671@yahoo.com'
  receiver = 'jared_lee@brown.edu'


  startDate = request.form["start-date"]
  endDate = request.form["end-date"]
  name = request.form["first-name"] + " " + request.form["last-name"]
  email = request.form["email"]
  eventName = request.form["event-name"]
  eventLocation = request.form["event-location"]
  eventDescription = request.form["event-description"]


  link = flask.url_for('createEvent', _external=True)
  for i in range(0, 25):
    print(link + '?' + urllib.parse.urlencode(request.form))

  link = link + '?' + urllib.parse.urlencode(request.form)
  params = {'start'}
  body =  ('Name: ' + name + '<br>' + 'Email: ' + email + '<br>' +
          'Event Name: ' + eventName + '<br>' +
          'Event Location: ' + eventLocation + '<br>' +
          'Start Date: ' + startDate + '<br>' +
          'End Date: ' + endDate + '<br>' +
          'Event Description: ' + eventDescription + '<br>' +
          'Click <a href="' + link + '">here</a> to add event to calendar ')
  msg = MIMEText(body, 'html')
  msg['Subject'] = subject
  msg['From'] = sender
  msg['To'] = receiver
  return msg
