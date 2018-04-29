import os
import requests
from bs4 import BeautifulSoup, SoupStrainer
from os import listdir
from collections import defaultdict
from multiprocessing.dummy import Pool as ThreadPool 


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
	pool = ThreadPool(8) 
	responses = pool.map(requests.head, links)
	for response in responses:
		if response.status_code < 400:
			workingLinks.append(response.url)
		else:
			notWorkingLinks.append(response.url)
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