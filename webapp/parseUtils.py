import httplib2
import os
from bs4 import BeautifulSoup, SoupStrainer
from os import listdir

http = httplib2.Http()
status, response = http.request('http://baker-ripley.herokuapp.com/national-resources')

templateDirectory = './webapp/templates'

def getAllLinks():
	allLinks = []
	for template in listdir(templateDirectory):
		print template
		fullLink = os.getcwd() + '/webapp/templates/' + template
		htmlfile = open(fullLink)
		for link in BeautifulSoup(htmlfile, parseOnlyThese=SoupStrainer('a')):
			if link.has_attr('href'):
				allLinks.append(link['href'])

	valid = getValidLinks(allLinks)
	checkIfValid(valid)
	return allLinks
	# for link in allLinks:
	# 	if "http" not in link and "https" not in link:
	# 		print link + ' is no'
	# 	else:
	# 		onlyLinks.append(link)
	
	# print onlyLinks

	# for link in BeautifulSoup(response, parseOnlyThese=SoupStrainer('a')):
	# 	if link.has_attr('href'):
	# 		print link['href']


def getValidLinks(links):
	print 'valid links only'
	validLinks = []
	for link in links:
		if "http" in link or "https" in link: 
			validLinks.append(link)
			print link
	return validLinks

def checkIfValid(links):
	invalid = []
	h = httplib2.Http()
	for link in links:
		resp, content = h.request(link, 'HEAD')
		print resp.status
		if resp.status < 400:
			print link + ' is valid'
		else:
			print link + ' oh no not valid'
			invalid.append(link)

def getLinksFromHtml():
	print('hello')
