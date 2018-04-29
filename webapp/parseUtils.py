import httplib2
import os
from bs4 import BeautifulSoup, SoupStrainer
from os import listdir
from collections import defaultdict

http = httplib2.Http()
status, response = http.request('http://baker-ripley.herokuapp.com/national-resources')

templateDirectory = './webapp/templates'

def getAllLinks():
	allLinks = defaultdict(list)
	for template in listdir(templateDirectory):
		tempLinks = []
		fullLink = os.getcwd() + '/webapp/templates/' + template
		htmlfile = open(fullLink)
		for link in BeautifulSoup(htmlfile, parseOnlyThese=SoupStrainer('a')):
			if link.has_attr('href'):
				allLinks[template].append(link['href'])
	return allLinks

def getValidLinksFromTemplate(template):
	allLinks = []
	fullLink = os.getcwd() + '/webapp/templates/' + template
	htmlfile = open(fullLink)
	for link in BeautifulSoup(htmlfile, parseOnlyThese=SoupStrainer('a')):
		if link.has_attr('href'):
			allLinks.append(link['href'])
	return getValidLinks(allLinks)
	

def getValidLinks(links):
	validLinks = []
	for link in links:
		if "http" in link or "https" in link: 
			validLinks.append(link)
	return validLinks

def pingLinks(links):
	workingLinks = []
	notWorkingLinks = []
	h = httplib2.Http()
	for link in links:
		resp, content = h.request(link, 'HEAD')
		if resp.status < 400:
			workingLinks.append(link)
		else:
			notWorkingLinks.append(link)
	return workingLinks, notWorkingLinks

def isLinkValid(link):
	h = httplib2.Http()
	resp, content = h.request(link, 'HEAD')
	if resp.status < 400:
		return true
	return false
	
	# print 'HERE'
	# print 'HERE'
	# print 'HERE'
	# print 'HERE'
	# for key in finalLinks:
	# 	print key
	# 	for link in finalLinks[key]:
	# 		for k in link:
	# 			print k
	# 			print link[key]
	# return finalLinks

# /home: 
# 	valid: "google.com"
# 	invalid: "yahoo.com"
# /calendar:
# 	valid: 'helloworld.com'
# 	invalid: 'bakerripley.org'

def getLinksFromHtml():
	templateToValid = {}
	for template in listdir(templateDirectory):
		tempDict = {}
		linksToCheck = getValidLinksFromTemplate(template)
		working, notWorking = pingLinks(linksToCheck)
		tempDict['working'] = working
		tempDict['notWorking'] = notWorking
		templateToValid[template] = tempDict

	return templateToValid