import os
import requests
from bs4 import BeautifulSoup, SoupStrainer
from os import listdir
from collections import defaultdict

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
	for link in links:
		resp = requests.head(link)
		if resp.status_code < 400:
			workingLinks.append(link)
		else:
			notWorkingLinks.append(link)
	return workingLinks, notWorkingLinks

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